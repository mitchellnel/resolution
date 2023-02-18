import { Container, Grid } from '@mui/material';
import CreateResolutionCard from '../components/CreateResolutionCard';
import ResolutionCard from '../components/ResolutionCard'

const Dashboard = () => {

    let resolutions = [
        {
            title: "Eat Healthy",
            goals_completed: 3,
            goal_count: 5
        },
        {
            title: "Exercise More",
            goals_completed: 1,
            goal_count: 5
        },
        {
            title: "Rest More",
            goals_completed: 1,
            goal_count: 1
        }
    ]

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
