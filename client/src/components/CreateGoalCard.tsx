import { Button, Collapse } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CreateGoalForm from "./CreateGoalForm";
import { useState } from "react";
import { ReminderFrequency, Weekday } from "../types";
import { Dayjs } from "dayjs";

/**
 * The props type for {@link CreateGoalCard}.
 * 
 * @category Component Props
 */
export interface CreateGoalCardProps {
  /**
   * Function that calls the backend API to create a goal in the database.
   * 
   * @param description - Description of new goal
   * @param timesToAchieve - Times to achieve of new goal
   * @param reminderFrequency - Reminder frequency of new goal
   * @param reminderTime - Reminder time of new goal if reminderFrequency is not None
   * @param reminderDay - Reminder day of new goal if weekly reminder
   * @param reminderDate - Reminder date of new goal if monthly reminder
   */
  goalCreationHandler: (
    description: string,
    timesToAchieve: number,
    reminderFrequency: ReminderFrequency,
    reminderTime: Dayjs,
    reminderDay: Weekday,
    reminderDate: number
  ) => void;
}

/**
 * A card component that, when not clicked, shows a button to add a new goal. When the button is clicked,
 * the button collapses and the {@link CreateGoalForm} expands. Collapses when either the submit button or cancel
 * button on {@link CreateGoalForm} is clicked.
 * 
 * @group Components
 * @category Page
 * @returns CreateGoalCard component
 */
const CreateGoalCard = ({ goalCreationHandler }: CreateGoalCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const style = {
    height: "5rem",
    width: "40%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eeeded",
    fontSize: "3rem",
    boxShadow: 3,
    color: "#5A5A5A",
    "&:hover": {
      boxShadow: 6,
    },
  };

  return (
    <>
      <Collapse in={!expanded}>
        <Button sx={style} onClick={() => setExpanded(true)}>
          <AddCircleIcon fontSize="inherit" />
        </Button>
      </Collapse>
      <Collapse in={expanded}>
        <CreateGoalForm
          submitForm={goalCreationHandler}
          closeForm={() => setExpanded(false)}
        />
      </Collapse>
    </>
  );
};

export default CreateGoalCard;
