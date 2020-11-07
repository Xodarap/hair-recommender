import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

export default function Advice({distances}) {
    return <>
    <Typography component="h2" variant="h2" align="center" color="textPrimary" gutterBottom>
    Advice 
    </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Advice</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
              <TableRow>
                <TableCell component="th" scope="row">
                Forehead Height
                </TableCell>
                <TableCell>
                  {distances['Upper Third'].comparison.relative < 0.25 ? 
                    <span>Your forehead height is smaller than the ideal. Consider hair styles which
                      go up to exaggerate the size of your forehead.
                    </span>  
                    : distances['Upper Third'].comparison.relative > 0.35 ? 
                    <span>Your forehead height is larger than the ideal. Consider hair styles which
                      cover up your forehead to make it seem smaller.
                    </span> 
                    :  <span>Your forehead height is close to the ideal. You can wear hairstyles
                      that either hide or show your forehead.
                  </span> 
                }
                </TableCell>           
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Forehead Width
                </TableCell>
                <TableCell>
                  {distances['Temporal (Forehead) Width'].comparison.relative < 111/140 ? 
                    <span>Your forehead width is smaller than the ideal. Consider hair styles which
                      are short on the sides to exaggerate the width of your forehead.
                    </span>  
                    : distances['Temporal (Forehead) Width'].comparison.relative > 121/140 ? 
                    <span>Your forehead width is larger than the ideal. Consider hair styles which
                      are long on the sides to make it seem smaller.
                    </span> 
                    :  <span>Your forehead width is close to the ideal. You can wear hairstyles
                      with either long or short sides
                  </span> 
                }
                </TableCell>           
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Face Height:Width
                </TableCell>
                <TableCell>
                  {distances['Face Height'].comparison.relative < 1.5 ? 
                    <span>Your face is shorter than the ideal. Consider hairstyles that are large
                      on the top and short on the sides to make it seem taller.
                    </span>  
                    : distances['Temporal (Forehead) Width'].comparison.relative > 1.7 ? 
                    <span>Your face is taller than the ideal. Consider hairstyles that are short
                    on the top and long on the sides to make it seem taller.
                    </span> 
                    :  <span>Your face height:width ratio is close to the ideal. You can wear hairstyles
                      with either long or short sides
                  </span> 
                }
                </TableCell>           
              </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  }
  