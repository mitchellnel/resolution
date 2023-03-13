import { Box, IconButton, Menu, MenuItem, Tooltip, } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Resolution, ResolutionContext} from "../contexts/ResolutionContext";
import { useState, useContext } from "react";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';

interface ResolutionOptionsProps {
  resolution: Resolution
}

const ResolutionOptions = ({resolution}: ResolutionOptionsProps) => {

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setAnchorEl(null);
  };

  const navigate = useNavigate();


  //edit functionality
  const handleEdit = () => {
    navigate("/update", {state: {id: resolution.id, old_title: resolution.title, old_description: resolution.description}});
  };

  
  //delete functionality:
  const {deleteResolution} = useContext(ResolutionContext);

  const handleDelete = () => {
    deleteResolution(resolution.id)
    navigate('/');
    
  };

  return (
    <>
        <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="Options">
            <IconButton
            onClick={handleClick}
            size="small"
            aria-controls={menuOpen ? "options" : undefined}
            aria-haspopup="true"
            aria-expanded={menuOpen ? "true" : undefined}
            >
                <MoreVertIcon />
            </IconButton>
        </Tooltip>
        </Box>
        <Menu
        anchorEl={anchorEl}
        id="options"
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
            <MenuItem onClick={handleEdit} sx={{display: 'flex', justifyContent: 'space-between'}}>
                Edit
                <EditIcon />
            </MenuItem>
            <MenuItem onClick={handleDelete} sx={{color: 'red', display: 'flex', justifyContent: 'space-between'}}>
                Delete
                <DeleteOutlineIcon />
            </MenuItem>
        </Menu>
    </>
  );
}

export default ResolutionOptions;
