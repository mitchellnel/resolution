import React, { useContext } from 'react';
import { Button, Container, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { ResolutionContext } from '../contexts/ResolutionContext';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * The form page that allows users to update an existing resolution. Contains title and description form inputs.
 * Initial render fills title and description form inputs with current resolution title and descriptions. Clicking
 * the update button calls the backend API to update the resolution and redirects the user to the {@link Dashboard}.
 * 
 * @group Components
 * @category Navigation
 * @returns UpdateResolutionForm navigation component
 */
const UpdateResolutionForm = () => {

    const navigate = useNavigate();
    const {updateResolution } = useContext(ResolutionContext);

    const fieldStyle = {
      marginTop: 3,
      marginBottom: 3,
      display: 'block'
    }


    const location = useLocation();

    const [ title, setTitle ] = useState(location.state.old_title);
    const [ description, setDescription ] = useState(location.state.old_description);
    const [ titleError, setTitleError ] = useState(false);
    const [ descriptionError, setDescriptionError ] = useState(false);

    const handleSubmit = (event : React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setTitleError(false);
      setDescriptionError(false);
      if (title === '') {
        setTitleError(true);
      }
      if (description === '') {
        setDescriptionError(true);
      }
      if (title && description) {
        updateResolution(location.state.id, title, description);
        navigate('/');
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
              Edit Your Resolution
            </Typography>
            <form noValidate autoComplete="off" onSubmit={handleSubmit}>
              <TextField
                value={title}
                sx={fieldStyle}
                onChange={(event : React.ChangeEvent<HTMLInputElement>) => setTitle(event.target.value)}
                label="Title"
                variant="outlined"
                color="secondary"
                required
                fullWidth
                error={titleError}
              />
              <TextField
                value={description}
                sx={fieldStyle}
                onChange={(event : React.ChangeEvent<HTMLInputElement>) => setDescription(event.target.value)}
                label="Description"
                variant="outlined"
                color="secondary"
                multiline
                rows={4}
                fullWidth
                required
                error={descriptionError}
              />
              <Button
                type="submit"
                color="secondary"
                variant="contained"
              >
                Update
              </Button>
            </form>
        </Container>
  );
}

export default UpdateResolutionForm;
