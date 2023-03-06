import { Card, CardContent, Typography } from "@mui/material";
import { Goal } from "../contexts/ResolutionContext";
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface GoalCardProps {
  goal: Goal
}

const GoalCard = ({goal}: GoalCardProps) => {

  return (
    <Card sx={{width: '30%', height: '5rem', margin: '20px', marginLeft: '0px', boxShadow: 3}}>
      <div style={{marginLeft: '20px', marginRight: '20px', boxSizing: 'border-box', paddingTop: '0px', display: 'flex', height: '100%', justifyContent: 'space-between', alignItems: 'center'}}>
        <Typography variant='h6'>{goal.description}</Typography>
        {goal.completed ? 
          <CheckCircleIcon fontSize='large' /> :
          <RadioButtonUncheckedIcon fontSize='large' />
        }
      </div>
    </Card>
  );
};

export default GoalCard;