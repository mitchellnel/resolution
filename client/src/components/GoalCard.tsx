import { Card, Collapse, IconButton, Typography } from "@mui/material";
import { Goal } from "../contexts/ResolutionContext";
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GoalOptions from "./GoalOptions";
import UpdateGoalForm from "./UpdateGoalForm";
import { useState } from "react";

interface GoalCardProps {
  goal: Goal;
  setCompleted: (completed: boolean) => void;
}

const GoalCard = ({goal, setCompleted}: GoalCardProps) => {
  
  const [ editing, setEditing ] = useState(false);

  const handleGoalToggle = () => {
    if (goal.completed) {
      setCompleted(false);
    }
    else {
      setCompleted(true);
    }
  }

  return (
    <>
      <Collapse in={!editing}>
        <Card sx={{width: '30%', height: '5rem', margin: '20px', marginLeft: '0px', boxShadow: 3}}>
          <div style={{marginLeft: '5px', marginRight: '20px', boxSizing: 'border-box', paddingTop: '0px', display: 'flex', height: '100%', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{display: 'flex'}}>
              <GoalOptions goal={goal} openEditForm={() => setEditing(true)}/>
              <Typography variant='h6'>{goal.description}</Typography>
            </div>
            <IconButton onClick={handleGoalToggle}>
              {goal.completed ? 
                <CheckCircleIcon fontSize='large' /> :
                <RadioButtonUncheckedIcon fontSize='large' />
              }
            </IconButton>
          </div>
        </Card>
      </Collapse>
      <Collapse in={editing}>
        {/* TODO: Finish submitForm implementation for update */}
        <UpdateGoalForm submitForm={() => null} closeEditForm={() => setEditing(false)}/>
      </Collapse>
    </>
  );
};

export default GoalCard;