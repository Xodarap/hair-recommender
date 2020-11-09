import { Container, Grid, Link, Typography } from "@material-ui/core"

export default function Contact() {
    return (
        <Container>
            <Grid container style={{textAlign: 'center'}}>
                <Grid item xs={12}>
                    <Typography variant="h2">Contact</Typography>
                    <hr className="primary" />
                    <p></p>
                </Grid>
                <Grid item xs={4}>
                    <Link href="https://www.tiktok.com/@benthamite">
                        <img src="/img/tiktok.svg" style={{ width: '56px', height: '56px' }} />
                        <Typography variant="body1">@benthamite</Typography>
                    </Link>
                </Grid>
                <Grid item xs={4}>
                    <Link href="mailto:xodarap00@gmail.com">
                        <i className="fas fa-envelope fa-4x" data-wow-delay=".1s" style={{ 'color': 'black' }}></i>
                        <Typography variant="body1">xodarap00@gmail.com</Typography>
                    </Link>
                </Grid>
                <Grid item xs={4}>
                    <Link href="https://github.com/xodarap">
                        <i className="fab fa-github fa-4x wow bounceIn" data-wow-delay=".1s" style={{ 'color': 'black' }}></i>
                        <Typography variant="body1">Xodarap</Typography>
                    </Link>
                </Grid>
            </Grid>
        </Container>
    )
}