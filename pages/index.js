import { DropzoneArea } from 'material-ui-dropzone'
import { Container, FormControl, Select, MenuItem, FormHelperText } from '@material-ui/core'
import { useState } from 'react'
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import DataTable from '../components/data_table'
import Instructions from '../components/instructions'
import Paper from '@material-ui/core/Paper';
import Contact from '../components/contact';

const useStyles = makeStyles(theme => ({
  optionalColumn: {
    padding: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
    [theme.breakpoints.up('md')]: {
      display: 'auto',
    },
    [theme.breakpoints.up('lg')]: {
      display: 'auto',
    },
  },
  firstHero: {
    width: '100vw',
    minHeight: '80vh',
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    backgroundImage: "url('/img/hair3.jpg')",
    backgroundSize: 'cover',
  },
  loadingHolder: {
    padding: '20px'
  },
  whiteText: {
    color: theme.palette.primary.contrastText,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

export default function Home() {
  const classes = useStyles();
  const [results, setResults] = useState({})
  const [sex, setSex] = useState("female")
  const imgWithPreview = (files) => {
    if (!files || files.length == 0) return;
    var reader = new FileReader();
    reader.onloadend = function (event) {
      setResults({ loading: true, src: event.target.result });
      var img = document.createElement("img");
      img.src = event.target.result;
      var canvas = document.getElementById('myCanvas')
      canvas.width = img.width;
      canvas.height = img.height;
      resizeCanvas(canvas)
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      handleChange(files, setResults);
    }
    reader.readAsDataURL(files[0]);
  }
  return (
    <>
    
      <div className={classes.firstHero}>
        <Typography component="h1" variant="h1" align="center" color="textPrimary" gutterBottom className={classes.whiteText}>
          Hair to Help Us
      </Typography>
        <Typography variant="h5" align="center" color="textSecondary" component="p" className={classes.whiteText}>
          do hair good
      </Typography>
        <Container maxWidth="sm">
          <Paper>
            <Instructions />
            <Grid container justify="center" className={classes.loadingHolder}>
            <FormControl className={classes.formControl}>
              <Select labelId="demo-simple-select-label" id="demo-simple-select" value={sex} onChange={(e) => { setSex(e.target.value) }}           >
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="male">Male</MenuItem>
              </Select>
              <FormHelperText>Used to determine "ideal" proportions</FormHelperText>
            </FormControl>
            </Grid>
            <DropzoneArea
              onChange={imgWithPreview.bind(this)}
              filesLimit={1}
              maxFileSize={10000000}
              showPreviews={false}
            />
          </Paper>
        </Container>
        <Container maxWidth="sm" >
          <Grid container justify="center" className={classes.loadingHolder}>
            {(results?.loading) && <CircularProgress />}
          </Grid>
          <canvas id="myCanvas" style={{ maxWidth: '100%' }}></canvas>
          <DataTable locations={results.locations} classes={classes} sex={sex}/>
        </Container>
      </div>
      <Contact/>
    </>
  )
}

function resizeCanvas(canvas) {
  const MAX_WIDTH = 1024;
  const MAX_HEIGHT = 1024;
  if (canvas.width > MAX_WIDTH) {
    canvas.height = canvas.height * MAX_WIDTH / canvas.width
    canvas.width = MAX_WIDTH
  }
  if (canvas.height > MAX_HEIGHT) {
    canvas.width = canvas.width * MAX_HEIGHT / canvas.height
    canvas.height = MAX_WIDTH
  }
}

var drawLine = function (canvas, ctx, start, end, color) {
  ctx.beginPath();
  ctx.moveTo(start.x, start.y)
  ctx.lineTo(end.x, end.y)
  ctx.lineWidth = canvas.width * 0.003;
  ctx.strokeStyle = color;
  ctx.stroke();
}

async function handleChange(files, setState) {
  if (!files || files.length == 0) return;

  var canvas = document.getElementById('myCanvas')
  var urlencoded = new URLSearchParams();
  urlencoded.append("image_base64", canvas.toDataURL('image/jpeg'))

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  const r = await fetch('/api/face',
    {
      headers: myHeaders,
      method: 'POST',
      body: urlencoded,
      redirect: 'follow'
    }
  ).then(r => r.json())

  var ctx = canvas.getContext("2d");
  const landmarks = {
    'Bizygomatic (Cheek) Width': {
      location: (r) => [r.face.landmark.face.face_contour_left_63, r.face.landmark.face.face_contour_right_63],
      color: 'red'
    },
    'Bigonial (Jaw) Width': {
      location: (r) => [r.face.landmark.face.face_contour_left_40, r.face.landmark.face.face_contour_right_40],
      color: 'red'
    },
    'Temporal (Forehead) Width': {
      location: (r) => [r.face.landmark.left_eyebrow.left_eyebrow_5, r.face.landmark.right_eyebrow.right_eyebrow_5],
      color: 'red'
    },
    'Biocular (Eye) Width': {
      location: (r) => [r.face.landmark.left_eye.left_eye_0, r.face.landmark.right_eye.right_eye_0],
      color: 'red'
    },
    'Lower Third': {
      location: (r) => [r.face.landmark.face.face_contour_left_0, r.face.landmark.nose.nose_left_62],
      color: 'white',
      flared: true
    },
    'Middle Third': {
      location: (r) => [r.face.landmark.nose.nose_left_62, r.face.landmark.nose.nose_midline_10],
      color: 'white',
      flared: true
    },
    'Upper Third': {
      location: (r) => [r.face.landmark.nose.nose_midline_10, r.face.landmark.face.face_hairline_72],
      color: 'white',
      flared: true
    }
  }
  const locations = Object.keys(landmarks).map(k => {
    const [f, s] = landmarks[k].location(r);
    drawLine(canvas, ctx, f, s, landmarks[k].color)
    if (landmarks[k].flared) {
      const d = canvas.width * 0.06
      drawLine(canvas, ctx, { x: f.x - d, y: f.y }, { x: f.x + d, y: f.y }, landmarks[k].color)
      drawLine(canvas, ctx, { x: s.x - d, y: s.y }, { x: s.x + d, y: s.y }, landmarks[k].color)
    }
    return {
      'name': k,
      'start': f,
      'end': s
    }
  })
  setState({ locations })
}