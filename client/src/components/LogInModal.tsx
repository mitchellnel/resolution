import { Box, Modal, Typography } from '@mui/material';
import { useContext } from 'react';
import GoogleSignInButton from '../components/GoogleLogin/GoogleSignInButton';
import { UserContext } from '../contexts/UserContext';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

/**
 * A log in modal that prompts the user to log in if the user is not logged in. Takes advantage of the
 * authenticated flag from {@link UserContext} to make the determination of whether the user is logged
 * in or not.
 * 
 * @group Components
 * @category Modal
 * @returns LogInModal component
 */
const LogInModal = () => {

    const { authenticated } = useContext(UserContext);

  return (
    <Modal
    open={!authenticated}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
    >
        <Box sx={style} data-testid="log-in-box">
            <Typography id="modal-modal-title" variant="h6" component="h2">
            Looks like you're not signed in
            </Typography>
            <GoogleSignInButton/>
        </Box>
    </Modal>
  );
}

export default LogInModal;