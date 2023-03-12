import React from "react";
import {
  Button,
  Container,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { ReminderFrequency, Weekday } from "../types";
import { LocalizationProvider, MobileTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

interface CreateGoalFormProps {
  submitForm: (
    description: string,
    timesToAchieve: number,
    reminderFrequency: ReminderFrequency,
    reminderTime: Dayjs,
    reminderDay: Weekday,
    reminderDate: number
  ) => void;
  closeForm: () => void;
}

const CreateGoalForm = ({ submitForm, closeForm }: CreateGoalFormProps) => {
  const fieldStyle = {
    marginTop: 3,
    marginBottom: 3,
    display: "block",
  };

  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState(false);

  const [timesToAchieve, setTimesToAchieve] = useState(1);
  const [timesToAchieveError, setTimesToAchieveError] = useState(false);

  const [reminderFrequency, setReminderFrequency] = useState("");
  const [reminderFrequencyError, setReminderFrequencyError] = useState(false);

  const [reminderTime, setReminderTime] = useState<Dayjs | null>(
    dayjs("2023-03-12T00:00")
  );

  const [reminderDay, setReminderDay] = useState(0);
  const [reminderDate, setReminderDate] = useState(1);

  const handleTimesToAchieveChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTimesToAchieve(event.target.value as any);

    if (Number(event.target.value)) {
      const value: Number = Number(event.target.value);

      if (value <= 0) {
        setTimesToAchieveError(true);
      } else {
        setTimesToAchieveError(false);
      }
    } else if (event.target.value !== "") {
      setTimesToAchieveError(true);
    } else {
      setTimesToAchieveError(false);
    }
  };

  const handleCancel = () => {
    closeForm();
    setDescriptionError(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDescriptionError(false);

    // set errors if applicable
    if (description === "") {
      setDescriptionError(true);
    }

    if (reminderFrequency === "") {
      setReminderFrequencyError(true);
    }

    // send form data
    if (
      description &&
      timesToAchieve &&
      reminderFrequency &&
      reminderTime &&
      reminderDay &&
      reminderDate
    ) {
      submitForm(
        description,
        timesToAchieve,
        reminderFrequency as ReminderFrequency,
        reminderTime,
        reminderDay as Weekday,
        reminderDate
      );

      setDescription("");
      setDescriptionError(false);

      setTimesToAchieve(1);
      setTimesToAchieveError(false);

      setReminderFrequency("");
      setReminderFrequencyError(false);

      setReminderTime(dayjs("2023-03-12T00:00"));

      setReminderDay(0);
      setReminderDate(1);

      closeForm();
    }
  };

  const dateMenuItems = [];
  for (let i = 1; i <= 31; i++) {
    dateMenuItems.push(<MenuItem value={i}>{i}</MenuItem>);
  }

  return (
    <Container>
      <Typography
        variant="h6"
        color="textSecondary"
        component="h2"
        gutterBottom
      >
        Create a New Goal
      </Typography>
      <form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <TextField
          value={description}
          sx={fieldStyle}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setDescription(event.target.value)
          }
          label="Description"
          variant="outlined"
          color="secondary"
          fullWidth
          required
          error={descriptionError}
        />

        <TextField
          value={timesToAchieve}
          sx={fieldStyle}
          onChange={handleTimesToAchieveChange}
          label="Number of times to achieve this goal"
          variant="outlined"
          color="secondary"
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          fullWidth
          required
          error={timesToAchieveError}
        />

        <FormControl
          required
          sx={{ minWidth: 240 }}
          error={reminderFrequencyError}
        >
          <InputLabel id="select-reminder-frequency">
            Reminder Frequency
          </InputLabel>
          <Select
            labelId="select-reminder-frequency"
            id="select-reminder-frequency"
            value={reminderFrequency}
            label="Reminder Frequency *"
            onChange={(event: SelectChangeEvent) => {
              setReminderFrequency(event.target.value as string);
            }}
          >
            <MenuItem value={ReminderFrequency.None}>
              <em>None</em>
            </MenuItem>
            <MenuItem value={ReminderFrequency.Daily}>Daily</MenuItem>
            <MenuItem value={ReminderFrequency.Weekly}>Weekly</MenuItem>
            <MenuItem value={ReminderFrequency.Monthly}>Monthly</MenuItem>
          </Select>
          <FormHelperText>Required</FormHelperText>
        </FormControl>

        {reminderFrequency !== "" &&
        reminderFrequency !== (ReminderFrequency.None as string) ? (
          <FormControl
            required
            sx={{ minWidth: 120, margin: "0 0 0 10px" }}
            disabled={reminderFrequency !== ReminderFrequency.None}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MobileTimePicker
                label="Reminder Time*"
                value={reminderTime}
                onChange={(newValue) => {
                  setReminderTime(newValue);
                }}
              />
            </LocalizationProvider>
          </FormControl>
        ) : null}

        <br />

        {reminderFrequency === ReminderFrequency.Weekly ||
        reminderFrequency === ReminderFrequency.Monthly ? (
          <FormControl
            required
            sx={{ minWidth: 120, margin: "20px 0 0 0" }}
            error={reminderFrequencyError}
          >
            {reminderFrequency === ReminderFrequency.Weekly ? (
              <>
                <InputLabel id="select-reminder-day">Reminder Day</InputLabel>
                <Select
                  labelId="select-reminder-day"
                  id="select-reminder-day"
                  value={String(reminderDay)}
                  label="Reminder Day *"
                  onChange={(event: SelectChangeEvent) => {
                    setReminderDay(Number(event.target.value));
                  }}
                >
                  <MenuItem value={Weekday.Monday}>Monday</MenuItem>
                  <MenuItem value={Weekday.Tuesday}>Tuesday</MenuItem>
                  <MenuItem value={Weekday.Wednesday}>Wednesday</MenuItem>
                  <MenuItem value={Weekday.Thursday}>Thursday</MenuItem>
                  <MenuItem value={Weekday.Friday}>Friday</MenuItem>
                  <MenuItem value={Weekday.Saturday}>Saturday</MenuItem>
                  <MenuItem value={Weekday.Sunday}>Sunday</MenuItem>
                </Select>
              </>
            ) : (
              <>
                <InputLabel id="select-reminder-date">Reminder Date</InputLabel>
                <Select
                  autoWidth={true}
                  labelId="select-reminder-date"
                  id="select-reminder-date"
                  value={String(reminderDate)}
                  label="Reminder Date *"
                  onChange={(event: SelectChangeEvent) => {
                    setReminderDate(Number(event.target.value));
                  }}
                >
                  {dateMenuItems}
                </Select>
              </>
            )}
            <FormHelperText>Required</FormHelperText>
          </FormControl>
        ) : null}

        <br />

        <div style={{ margin: "10px 0 0 0" }}>
          <Button
            type="button"
            color="error"
            variant="contained"
            onClick={handleCancel}
            style={{ marginRight: "20px" }}
          >
            Cancel
          </Button>
          <Button type="submit" color="secondary" variant="contained">
            Create
          </Button>
        </div>
      </form>
    </Container>
  );
};

export default CreateGoalForm;
