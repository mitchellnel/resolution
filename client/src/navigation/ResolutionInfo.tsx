import { Container, Typography } from '@mui/material';
import { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ResolutionContext } from '../contexts/ResolutionContext';
import Button from "@mui/material/Button";
import GoalCard from '../components/GoalCard';
import CreateGoalCard from '../components/CreateGoalCard';
import GoalProgress from '../components/GoalProgress/GoalProgress';

const ResolutionInfo = () => {

    //Pull goal CRUD functions from resolution context and pass them as props into appropriate components
    const { getResolutionById, addGoal, setGoalCompleted } = useContext(ResolutionContext);
    const { id } = useParams();
    const resolution = getResolutionById(id);

    const navigate = useNavigate();

  return (
    <>
        { resolution ? 
        <Container>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <Typography
                variant="h4"
                color="textSecondary"
                component="h2"
                gutterBottom
                >
                    {resolution.title}
                </Typography>
                <GoalProgress style={{width: '30%'}} goalsCompleted={resolution.goals_completed} goalCount={resolution.goal_count}/>
            </div>
            <Typography
            gutterBottom
            >
                {resolution.description}
            </Typography>
            <div>
                {resolution.goals.map(goal => <GoalCard key={goal.id} goal={goal} resolutionKey={resolution.id} setCompleted={(completed : boolean) => setGoalCompleted(resolution.id, goal.id, completed)}/>)}
                <CreateGoalCard goalCreationHandler={(description : string) => addGoal(resolution.id, description)}/>
            </div>
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