import { Container, Grid } from '@mui/material';
import { useContext } from 'react';
import CreateResolutionCard from '../components/CreateResolutionCard';
import ResolutionCard from '../components/ResolutionCard'
import { ResolutionContext } from '../contexts/ResolutionContext';

/**
 * The page that displays all {@link ResolutionCard}s of the current user.
 * 
 * @group Components
 * @category Navigation
 * @returns Dashboard navigation component
 */
const Dashboard = () => {

    const { resolutions } = useContext(ResolutionContext);

  return (
    <Container>
        <Grid container spacing={3}>
            {resolutions.map(resolution => {
                return <ResolutionCard key={resolution.id} resolution={resolution}/>
            })}
            <CreateResolutionCard />
        </Grid>
    </Container>
  );
}

export default Dashboard;
