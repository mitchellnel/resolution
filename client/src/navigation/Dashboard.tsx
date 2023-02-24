import { Container, Grid } from '@mui/material';
import { useContext } from 'react';
import CreateResolutionCard from '../components/CreateResolutionCard';
import ResolutionCard from '../components/ResolutionCard'
import { ResolutionContext } from '../contexts/ResolutionContext';

const Dashboard = () => {

    const { resolutions } = useContext(ResolutionContext);

  return (
    <Container>
        <Grid container spacing={3}>
            {resolutions.map(resolution => {
                return <ResolutionCard resolution={resolution}/>
            })}
            <CreateResolutionCard />
        </Grid>
    </Container>
  );
}

export default Dashboard;
