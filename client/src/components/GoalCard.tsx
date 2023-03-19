import { Card, Collapse, Typography } from "@mui/material";
import { Goal } from "../contexts/ResolutionContext";
import GoalOptions from "./GoalOptions";
import UpdateGoalForm from "./UpdateGoalForm";

import { useState, useContext } from "react";
import { ResolutionContext } from "../contexts/ResolutionContext";
import OccurrenceCounter from "./OccurrenceCounter";

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

  const handleGoalAchievement = () => {
    if (goal.nTimesToAchieve === 1) {
      // lock goal on completion
      setCompleted(true);

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
            transition: '1s',
            ...(goal.completed && {
                backgroundColor: '#90EE90',
                textDecoration: 'line-through',
                textDecorationThickness: '3px'
              })
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
              </div>
            </div>
            {!goal.completed && <OccurrenceCounter nTimesToAchieve={goal.nTimesToAchieve} goalAchievementHandler={handleGoalAchievement} />}
          </div>
        </Card>
      </Collapse>
      <Collapse in={editing}>
        <UpdateGoalForm
          current_description={goal.description}
          submitForm={(description) =>
            updateGoal(resolutionKey, goal.id, goal.eventID ?? "", description)
          }
          closeEditForm={() => setEditing(false)}
        />
      </Collapse>
    </>
  );
};

export default GoalCard;
