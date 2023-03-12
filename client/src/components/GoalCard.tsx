import { Card, Collapse, IconButton, Typography } from "@mui/material";
import { Goal } from "../contexts/ResolutionContext";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import GoalOptions from "./GoalOptions";
import UpdateGoalForm from "./UpdateGoalForm";

import { useState, useContext } from "react";
import { ResolutionContext } from "../contexts/ResolutionContext";

interface GoalCardProps {
  goal: Goal;
  resolutionKey: string;
  achieveGoal: () => void;
  setCompleted: (completed: boolean) => void;
}

const GoalCard = ({
  goal,
  resolutionKey,
  setCompleted,
  achieveGoal,
}: GoalCardProps) => {
  const { updateGoal } = useContext(ResolutionContext);

  const [editing, setEditing] = useState(false);

  const handleGoalToggle = () => {
    if (goal.nTimesToAchieve === 1) {
      if (goal.completed) {
        setCompleted(false);
      } else {
        setCompleted(true);
      }

      return;
    }

    // otherwise achieve the goal
    achieveGoal();
  };

  return (
    <>
      <Collapse in={!editing}>
        <Card
          sx={{
            width: "40%",
            height: "5rem",
            margin: "20px",
            marginLeft: "0px",
            boxShadow: 3,
          }}
        >
          <div
            style={{
              marginLeft: "5px",
              marginRight: "20px",
              boxSizing: "border-box",
              paddingTop: "0px",
              display: "flex",
              height: "100%",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex" }}>
              <GoalOptions
                goal={goal}
                resolutionKey={resolutionKey}
                openEditForm={() => setEditing(true)}
              />
              <div>
                <Typography variant="h5">
                  <strong>{goal.description}</strong>
                </Typography>
                <Typography variant="h6">
                  <em>Need to achieve {goal.nTimesToAchieve} more times!</em>
                </Typography>
              </div>
            </div>
            <IconButton onClick={handleGoalToggle}>
              {goal.completed ? (
                <CheckCircleIcon fontSize="large" />
              ) : (
                <RadioButtonUncheckedIcon fontSize="large" />
              )}
            </IconButton>
          </div>
        </Card>
      </Collapse>
      <Collapse in={editing}>
        {/* TODO: Finish submitForm implementation for update */}
        <UpdateGoalForm
          current_description={goal.description}
          submitForm={(description) =>
            updateGoal(resolutionKey, goal.id, description)
          }
          closeEditForm={() => setEditing(false)}
        />
      </Collapse>
    </>
  );
};

export default GoalCard;
