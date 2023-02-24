import { Box, Modal, Typography } from '@mui/material';
import { User } from 'firebase/auth';
import { useContext, useEffect, useState } from 'react';
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

const LogInModal = () => {

    const { authenticated, setCurrentUser, setAuthenticated } = useContext(UserContext);
    const [ open, setOpen ] = useState(!authenticated);

    useEffect(() => setOpen(!authenticated), [authenticated]);

  return (
    <Modal
    open={open}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
    >
        <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
            Looks like you're not signed in
            </Typography>
            {/* Fix typing on next line. Looks pretty bad. Only got it to work with casting */}
            <GoogleSignInButton setAuthenticatedFlag={setAuthenticated} setUser={(setCurrentUser as React.Dispatch<React.SetStateAction<User>>)}/>
        </Box>
    </Modal>
  );
}

export default LogInModal;