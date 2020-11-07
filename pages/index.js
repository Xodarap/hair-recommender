import { DropzoneArea } from 'material-ui-dropzone'
import { Container } from '@material-ui/core'
import { useState } from 'react'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles  } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Advice from '../components/advice'

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
    height: '80vh',
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    backgroundImage: "url('/img/bg.jpg')",
    backgroundSize: 'cover',
  },
  loadingHolder: {
    padding: '20px'
  }
}));

export default function Home({url}) {
  const classes = useStyles();
  const [results, setResults] = useState({})
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
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
    reader.readAsDataURL(files[0]);
    handleChange(files, setResults, url);
  }
  return (
    <>
    <Container component="main" className={classes.firstHero}>
      <Typography component="h1" variant="h1" align="center" color="textPrimary" gutterBottom>
        Hair 
      </Typography>
      <Typography variant="h5" align="center" color="textSecondary" component="p">
        Do hair good
      </Typography>
    </Container>
      <Container maxWidth="sm">
        <DropzoneArea
          onChange={imgWithPreview.bind(this)}
          filesLimit={1}
          maxFileSize={2000000}
        />
      </Container>
      <Container maxWidth="sm" >
        <Grid container justify="center" className={classes.loadingHolder}>
          {(results?.loading || true) && <CircularProgress />}
        </Grid>
        <canvas id="myCanvas" style={{ maxWidth: '100%' }}></canvas>
        <DataTable locations={results.locations} classes={classes}/>
      </Container>
    </>
  )
}

const DataTable = ({locations, classes }) => {
  if(!locations) return <></>;
  const calculateDistance = (row) => {
    const v = ((row.start.x - row.end.x) ** 2 + (row.start.y - row.end.y) ** 2) ** (1/2)
    return v
  }
  const distances = locations.reduce((d, row) => {
    d[row.name] = {
      distance: calculateDistance(row),
      start: row.start,
      end: row.end
    }
    return d;
  }, {})
  distances['Bigonial (Jaw) Width'].comparison = {
    to: 'Bizygomatic (Cheek) Width', 
    relative: distances['Bigonial (Jaw) Width'].distance / distances['Bizygomatic (Cheek) Width'].distance,
    target: 0.75
  }  
  distances['Temporal (Forehead) Width'].comparison = {
    to: 'Bizygomatic (Cheek) Width', 
    relative: distances['Temporal (Forehead) Width'].distance / distances['Bizygomatic (Cheek) Width'].distance,
    target: 0.82
  } 
  const thirds = ['Lower', 'Middle', 'Upper']
  const totalHeight = thirds.reduce((ac, r) => ac + distances[r + ' Third'].distance, 0)

  thirds.forEach(r => {
    distances[r + ' Third'].comparison = {
      to: 'total face height',
      relative: distances[r + ' Third'].distance/totalHeight,
      target: 0.33
    }
  })

  distances['Face Height'] = {
    distance: totalHeight,
    comparison: {
      to: 'Bizygomatic (Cheek) Width',
      relative: totalHeight/distances['Bizygomatic (Cheek) Width'].distance,
      target: 1.618
    }
  }

  const Comparison = ({comparison, name}) => {
    if(!comparison) return <></>;
    return <>
      Your {name} is {(comparison.relative * 100).toLocaleString(undefined, {maximumFractionDigits: 0})}% of
      your {comparison.to}. The ideal ratio is {comparison.target * 100}%.
    </>
  }
  return <><TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Distance</TableCell>
            <TableCell className={classes.optionalColumn}>%</TableCell>            
            <TableCell className={classes.optionalColumn}>Ideal</TableCell>
            <TableCell>Comparison</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(distances).map((k) => (
            <TableRow key={k}>
              <TableCell component="th" scope="row">
                {k}
              </TableCell>
              <TableCell>
                {distances[k].distance.toLocaleString(undefined, {maximumFractionDigits: 0})} px
              </TableCell>
              <TableCell className={classes.optionalColumn}>{distances[k].comparison && (100 *distances[k].comparison?.relative)?.toLocaleString(undefined, {maximumFractionDigits: 0})}</TableCell>
              <TableCell className={classes.optionalColumn}>{distances[k].comparison && (100 *distances[k].comparison?.target)?.toLocaleString(undefined, {maximumFractionDigits: 0})}</TableCell>
              <TableCell>
                <Comparison name={k} comparison={distances[k].comparison} />
              </TableCell>              
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <Advice distances={distances}/>
    </>
}


var drawLine = function (canvas, ctx, start, end, color) {
  ctx.beginPath();
  ctx.moveTo(start.x, start.y)
  ctx.lineTo(end.x, end.y)
  ctx.lineWidth = canvas.width * 0.003;
  ctx.strokeStyle = color;
  ctx.stroke();
}

async function handleChange(files, setState, url) {
  if (!files || files.length == 0) return;

  const formData = new FormData()
  formData.append('image_file', files[0])
  const r = await fetch(url,
    {
      method: 'POST',
      body: formData
    }).then(r => r.json())
  var canvas = document.getElementById('myCanvas')
  var ctx = canvas.getContext("2d");
  const landmarks = {
    'Bizygomatic (Cheek) Width': {
      location: (r) => [r.face.landmark.face.face_contour_left_63, r.face.landmark.face.face_contour_right_63],
      color: 'red'
    },
    'Bigonial (Jaw) Width': {
      location: (r) => [r.face.landmark.face.face_contour_left_40, r.face.landmark.face.face_contour_right_40],
      color: 'green'
    },
    'Temporal (Forehead) Width': {
      location: (r) => 
      [r.face.landmark.left_eyebrow.left_eyebrow_5, r.face.landmark.right_eyebrow.right_eyebrow_5],
      /*[{x: r.face.landmark.right_eyebrow.right_eyebrow_0.x, y: r.face.landmark.face.face_hairline_114.y},
        {x: r.face.landmark.left_eyebrow.left_eyebrow_0.x, y: r.face.landmark.face.face_hairline_30.y}],*/
      color: 'blue'
    },
    'Lower Third': {
      location: (r) => [r.face.landmark.face.face_contour_left_0, r.face.landmark.nose.nose_left_62],
      color: 'black',
      flared: true
    },
    'Middle Third': {
      location: (r) => [r.face.landmark.nose.nose_left_62, r.face.landmark.nose.nose_midline_10],
      color: 'green',
      flared: true
    },
    'Upper Third': {
      location: (r) => [r.face.landmark.nose.nose_midline_10, r.face.landmark.face.face_hairline_72],
      color: 'blue',
      flared: true
    }
  }
  const locations = Object.keys(landmarks).map(k => {
    const [f, s] = landmarks[k].location(r);
    drawLine(canvas, ctx, f, s, landmarks[k].color)
    if(landmarks[k].flared){
      const d = canvas.width * 0.06
      drawLine(canvas, ctx, {x: f.x - d, y: f.y}, {x: f.x + d, y: f.y}, landmarks[k].color)
      drawLine(canvas, ctx, {x: s.x - d, y: s.y}, {x: s.x + d, y: s.y}, landmarks[k].color)
    }
    return {
      'name': k,
      'start': f,
      'end': s
    }
  })
  setState({locations})
}

export async function getStaticProps() {
  return {
    props: {
      url: 'https://api-us.faceplusplus.com/facepp/v1/face/thousandlandmark?api_key=' +
       process.env.FACE_KEY +
       '&api_secret=' +
       process.env.FACE_SECRET+
       '&return_landmark=all',
    },
  }
}