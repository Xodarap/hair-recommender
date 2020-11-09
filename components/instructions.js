import Typography from '@material-ui/core/Typography';
import { Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    root: {
        'paddingTop': theme.spacing(5)
    },
}));

export default function Instructions() {
    const classes = useStyles();
    return (
    <Container className={classes.root}>
        <Typography component="p" variant="body1" align="center" color="textPrimary" gutterBottom>
            Upload a picture of yourself with a neutral expression and facing straight towards the camera for best results
        </Typography>

            {/* Data from Farkas, Leslie G., Marko J. Katic, and Christopher R. Forrest. "International anthropometric study of facial morphology in various ethnic groups/races." Journal of Craniofacial Surgery 16.4 (2005): 615-646. */}
    </Container>)
}