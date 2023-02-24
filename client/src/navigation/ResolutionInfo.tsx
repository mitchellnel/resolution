import { Container, Grid, Typography } from '@mui/material';
import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import CreateResolutionCard from '../components/CreateResolutionCard';
import ResolutionCard from '../components/ResolutionCard'
import { ResolutionContext } from '../contexts/ResolutionContext';

const ResolutionInfo = () => {

    const { getResolutionById } = useContext(ResolutionContext);
    const { id } = useParams();
    const resolution = getResolutionById(id);

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