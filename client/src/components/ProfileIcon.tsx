import { Avatar, Box, IconButton, Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import { UserContext, UserContextInterface } from '../contexts/UserContext';
import { useContext, useState } from 'react';
import GoogleSignOutButton from "./GoogleLogin/GoogleSignOutButton";

const ProfileIcon = () => {

    interface UserInfo {
        displayName: string,
        photoURL: string
    }

    const { currentUser }: UserContextInterface = useContext(UserContext);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const menuOpen = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

  return (
    <>
        {currentUser ?
            <div style={{ display: "flex", alignItems: "center" }}>
                <Typography>{(currentUser as UserInfo).displayName}</Typography>
                <Box
                sx={{ display: "flex", alignItems: "center", textAlign: "center" }}
                >
                    <Tooltip title="Account settings">
                        <IconButton
                        onClick={handleClick}
                        size="small"
                        aria-controls={menuOpen ? "account-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={menuOpen ? "true" : undefined}
                        >
                        <Avatar
                            src={(currentUser as UserInfo).photoURL}
                            alt={(currentUser as UserInfo).displayName}
                            imgProps={{ referrerPolicy: 'no-referrer'}}
                            />
                        </IconButton>
                    </Tooltip>
                </Box>
                <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={menuOpen}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                    },
                    "&:before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        heizght: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                    },
                    },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                    <MenuItem onClick={handleClose}>
                        <GoogleSignOutButton/>
                    </MenuItem>
                </Menu>
            </div>
        :
        <Typography>
            NOT SIGNED IN
        </Typography>
        }
    </>
  );
};

export default ProfileIcon;
