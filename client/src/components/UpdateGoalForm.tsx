import React from 'react';
import { Button, Container, TextField, Typography } from '@mui/material';
import { useState } from 'react';

/**
 * The props type for {@link UpdateGoalForm}.
 * 
 * @category Component Props
 */
export interface UpdateGoalFormProps {
    /**
     * The current description of the existing goal to edit
     */
    current_description: string;
    /**
     * Function that calls the backend API to update the goal to edit with a new description
     * 
     * @param description - New description for existing goal to edit
     */
    submitForm: (description : string) => void;
    /**
     * Closes the form through the {@link GoalCard} component.
     */
    closeEditForm: () => void;
}

/**
 * The component that allows users to update the description of an existing goal for a given resolution. Contains form input
 * for the new description.
 * 
 * @group Components
 * @category Page
 * @returns UpdateGoalForm component
 */
const UpdateGoalForm = ({ current_description, submitForm, closeEditForm } : UpdateGoalFormProps ) => {

    const fieldStyle = {
      marginTop: 3,
      marginBottom: 3,
      display: 'block'
    }

    const [ description, setDescription ] = useState(current_description);
    const [ descriptionError, setDescriptionError ] = useState(false);

    const handleCancel = () => {
        closeEditForm();
        setDescriptionError(false);
    }

    const handleSubmit = (event : React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setDescriptionError(false);
      if (description === '') {
        setDescriptionError(true);
      }
      if (description) {
        submitForm(description);
        setDescription(description);
        setDescriptionError(false);
        closeEditForm();
      }
    }

  return (
        <Container>
            <Typography
              variant="h6"
              color="textSecondary"
              component="h2"
              gutterBottom
            >
              Edit Goal
            </Typography>
            <form noValidate autoComplete="off" onSubmit={handleSubmit}>
              <TextField
                value={description}
                sx={fieldStyle}
                onChange={(event : React.ChangeEvent<HTMLInputElement>) => setDescription(event.target.value)}
                label="Description"
                variant="outlined"
                color="secondary"
                fullWidth
                required
                error={descriptionError}
                inputProps={{"data-testid": "update-goal-form-description"}}
              />
                <Button
                    type="button"
                    color="error"
                    variant="contained"
                    onClick={handleCancel}
                    style={{marginRight: '20px'}}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    color="secondary"
                    variant="contained"
                >
                    Edit
                </Button>
            </form>
        </Container>
  );
}

export default UpdateGoalForm;