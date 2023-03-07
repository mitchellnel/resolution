import React from 'react';
import { Button, Container, TextField, Typography } from '@mui/material';
import { useState } from 'react';

interface CreateGoalFormProps {
    submitForm: (description : string) => void;
    closeForm: () => void;
}

const CreateGoalForm = ({ submitForm, closeForm } : CreateGoalFormProps ) => {

    const fieldStyle = {
      marginTop: 3,
      marginBottom: 3,
      display: 'block'
    }

    const [ description, setDescription ] = useState('');
    const [ descriptionError, setDescriptionError ] = useState(false);

    const handleCancel = () => {
        closeForm();
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
        setDescription('');
        setDescriptionError(false);
        closeForm();
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
              Create a New Goal
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
                    Create
                </Button>
            </form>
        </Container>
  );
}

export default CreateGoalForm;