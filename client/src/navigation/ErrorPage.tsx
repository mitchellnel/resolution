import { Container } from '@mui/material';
import Typography from '@mui/material/Typography';

/**
 * The page that displays a 404 error when a nonexistent route is accessed.
 * 
 * @group Components
 * @category Navigation
 * @returns ErrorPage navigation component
 */
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