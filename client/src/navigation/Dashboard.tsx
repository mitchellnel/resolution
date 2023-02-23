import { Container, Grid } from '@mui/material';
import { useContext } from 'react';
import CreateResolutionCard from '../components/CreateResolutionCard';
import ResolutionCard from '../components/ResolutionCard'
import { ResolutionContext } from '../contexts/ResolutionContext';

const Dashboard = () => {

    let { resolutions } = useContext(ResolutionContext);

  return (
    <div className="resolution-container">
        <Container>
            <Grid container spacing={3}>
                {resolutions.map(resolution => {
                    return <ResolutionCard resolution={resolution}/>
                })}
                <CreateResolutionCard />
            </Grid>
        </Container>
    </div>
  );
}

export default Dashboard;
