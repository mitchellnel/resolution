import { Container, Typography } from "@mui/material";
import { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ResolutionContext } from "../contexts/ResolutionContext";
import Button from "@mui/material/Button";
import GoalCard from "../components/GoalCard";
import CreateGoalCard from "../components/CreateGoalCard";
import GoalProgress from "../components/GoalProgress/GoalProgress";
import { ReminderFrequency, Weekday } from "../types";
import { Dayjs } from "dayjs";

/**
 * The page that shows advanced information about a resolution, including its title, description, and its list of goals.
 * On the top right corner of the page, {@link GoalProgress} is also rendered, which displays resolution progress dependent
 * on what proportion of goals are completed.
 * 
 * @group Components
 * @category Navigation
 * @returns ResolutionInfo navigation component
 */
const ResolutionInfo = () => {
  // Pull goal CRUD functions from resolution context and pass them as props into appropriate components
  const { getResolutionById, addGoal, achieveGoal, setGoalCompleted } =
    useContext(ResolutionContext);
  const { id } = useParams();
  const resolution = getResolutionById(id);

  const navigate = useNavigate();

  const goalCreationHandler = (
    description: string,
    timesToAchieve: number,
    reminderFrequency: ReminderFrequency,
    reminderTime: Dayjs,
    reminderDay: Weekday,
    reminderDate: number
  ) => {
    if (resolution) {
      addGoal(
        resolution.id,
        description,
        timesToAchieve,
        reminderFrequency,
        reminderTime,
        reminderDay,
        reminderDate
      );
    }
  };

  return (
    <>
      {resolution ? (
        <Container>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              variant="h4"
              color="textSecondary"
              component="h2"
              gutterBottom
            >
              {resolution.title}
            </Typography>
            <GoalProgress
              style={{ width: "30%" }}
              goalsCompleted={resolution.goals_completed}
              goalCount={resolution.goal_count}
            />
          </div>
          <Typography gutterBottom>{resolution.description}</Typography>
          <div style={{ margin: "auto auto 40px auto" }}>
            {resolution.goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                resolutionKey={resolution.id}
                achieveGoal={() => achieveGoal(resolution.id, goal.id)}
                setCompleted={(completed: boolean) =>
                  setGoalCompleted(resolution.id, goal.id, completed)
                }
              />
            ))}
            <CreateGoalCard goalCreationHandler={goalCreationHandler} />
          </div>
          <Button onClick={() => navigate("/")}> Back to dashboard </Button>
        </Container>
      ) : (
        <Typography
          variant="h4"
          color="textSecondary"
          component="h2"
          gutterBottom
        >
          Resolution not found
        </Typography>
      )}
    </>
  );
};

export default ResolutionInfo;
