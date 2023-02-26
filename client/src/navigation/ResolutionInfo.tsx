import { Container, Typography } from '@mui/material';
import { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ResolutionContext } from '../contexts/ResolutionContext';
import Button from "@mui/material/Button";

//page that opens w

const ResolutionInfo = () => {

    const { getResolutionById } = useContext(ResolutionContext);
    const { id } = useParams();
    const resolution = getResolutionById(id);


    const navigate = useNavigate();

  return (
    <>
        { resolution ? 
        <Container>
            <Typography
            variant="h4"
            color="textSecondary"
            component="h2"
            gutterBottom
            >
                {resolution.title}
            </Typography>
            <Typography
            gutterBottom
            >
                {resolution.description}
            </Typography>

            <Button onClick={() => navigate('/')}> Back to dashboard </Button>
        </Container>

        
        :
        <Typography
            variant="h4"
            color="textSecondary"
            component="h2"
            gutterBottom
        >
            Resolution not found
        </Typography> }
    </>
  );
}

export default ResolutionInfo;