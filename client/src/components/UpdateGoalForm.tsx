import React from 'react';
import { Button, Container, TextField, Typography } from '@mui/material';
import { useState } from 'react';

interface UpdateGoalFormProps {
    current_description: string;
    submitForm: (description : string) => void;
    closeEditForm: () => void;
}

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