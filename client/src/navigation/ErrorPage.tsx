import { Container } from '@mui/material';
import Typography from '@mui/material/Typography';

const ErrorPage = () => {

  return (
    <Container>
        <Typography
        variant="h1"
        color="textSecondary"
        gutterBottom
        >
            404 Page Not Found
        </Typography>
    </Container>
  );

}

export default ErrorPage;