import { Card, Grid, IconButton } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Link } from "react-router-dom";

const CreateResolutionCard = () => {

  return (
    <Grid item xs={4}>
      <Link to="/create">
        <Card sx={{height: '10em', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#eeeded', boxShadow: 3}}>
          <IconButton>
              <AddCircleIcon fontSize='large'/>
          </IconButton>
        </Card>
      </Link>
    </Grid>
  );
}

export default CreateResolutionCard;