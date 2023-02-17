import { Card, Grid, IconButton } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';

const CreateResolutionCard = ({resolution}: any) => {

  return (
    <Grid item xs={4}>
      <Card sx={{height: '10em', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#eeeded', boxShadow: 3}}>
        <IconButton>
            <AddCircleIcon fontSize='large'/>
        </IconButton>
      </Card>
    </Grid>
  );
}

export default CreateResolutionCard;