import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Advice from '../components/advice'

export default function DataTable({ locations, classes, sex }) {
    if (!locations) return <></>;
    const calculateDistance = (row) => {
      const v = ((row.start.x - row.end.x) ** 2 + (row.start.y - row.end.y) ** 2) ** (1 / 2)
      return v
    }
    /*
      m: g: 97.1
         z: 137.1
         ex: 89.4
      f: g: 91.1
         z: 129.9
         x: 86.8
    */
    const ideals = sex == 'male' ? {g: 97.1, z: 137.1, x: 89.4} : {g: 91.1, z: 129.9, x: 86.8}

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
      target: ideals.g / ideals.z
    }
    distances['Biocular (Eye) Width'].comparison = {
      to: 'Bizygomatic (Cheek) Width',
      relative: distances['Temporal (Forehead) Width'].distance / distances['Bizygomatic (Cheek) Width'].distance,
      target: ideals.x / ideals.z
    }
    const thirds = ['Lower', 'Middle', 'Upper']
    const totalHeight = thirds.reduce((ac, r) => ac + distances[r + ' Third'].distance, 0)
  
    thirds.forEach(r => {
      distances[r + ' Third'].comparison = {
        to: 'total face height',
        relative: distances[r + ' Third'].distance / totalHeight,
        target: 0.33
      }
    })
  
    distances['Face Height'] = {
      distance: totalHeight,
      comparison: {
        to: 'Bizygomatic (Cheek) Width',
        relative: totalHeight / distances['Bizygomatic (Cheek) Width'].distance,
        target: 1.618
      }
    }
    Object.keys(distances).forEach(k=> {
      if(!(distances[k].comparison)) return;
      distances[k].comparison.proportion = distances[k].comparison.relative / distances[k].comparison.target
    })
    const Comparison = ({ comparison, name }) => {
      if (!comparison) return <></>;
      return <>
        Your {name} is {(comparison.relative * 100).toLocaleString(undefined, { maximumFractionDigits: 0 })}% of
        your {comparison.to}. The ideal ratio is {(comparison.target * 100).toLocaleString(undefined, { maximumFractionDigits: 0 })}%.
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
                {distances[k].distance.toLocaleString(undefined, { maximumFractionDigits: 0 })} px
                </TableCell>
              <TableCell className={classes.optionalColumn}>{distances[k].comparison && (100 * distances[k].comparison?.relative)?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
              <TableCell className={classes.optionalColumn}>{distances[k].comparison && (100 * distances[k].comparison?.target)?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
              <TableCell>
                <Comparison name={k} comparison={distances[k].comparison} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
      <Advice distances={distances} sex={sex}/>
    </>
  }