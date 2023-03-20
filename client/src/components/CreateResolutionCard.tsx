import { Button, Grid } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useNavigate } from "react-router-dom";

/**
 * The card component that, when clicked, shows navigates the user to the CreateResolutionForm navigation component, 
 * which allows users to create a goal a new resolution.
 * 
 * @group Components
 * @category Page
 * @returns CreateResolutionCard component
 */
const CreateResolutionCard = () => {
  const navigate = useNavigate();

  const style = {
    height: "10rem",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eeeded",
    fontSize: "5rem",
    boxShadow: 3,
    color: "#5A5A5A",
    '&:hover': {
      boxShadow: 6
    }
  };

  return (
    <Grid item xs={4}>
      <Button onClick={() => navigate("/create")} sx={style}>
        <AddCircleIcon fontSize="inherit" />
      </Button>
    </Grid>
  );
};

export default CreateResolutionCard;
