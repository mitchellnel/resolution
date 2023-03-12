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
import { ReminderFrequency } from "../types";

interface CreateGoalFormProps {
  submitForm: (
    description: string,
    reminderFrequency: ReminderFrequency
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

  const [reminderFrequency, setReminderFrequency] = useState("");
  const [reminderFrequencyError, setReminderFrequencyError] = useState(false);

  const handleReminderFrequencySelectChange = (event: SelectChangeEvent) => {
    setReminderFrequency(event.target.value as string);
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
    if (description && reminderFrequency) {
      submitForm(description, reminderFrequency as ReminderFrequency);

      setDescription("");
      setDescriptionError(false);

      setReminderFrequency("");
      setReminderFrequencyError(false);

      closeForm();
    }
  };

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
            onChange={handleReminderFrequencySelectChange}
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
