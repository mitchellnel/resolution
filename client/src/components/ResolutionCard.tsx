import { Card, CardContent, CardHeader, Grid, IconButton } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import GoalProgress from "./GoalProgress/GoalProgress";

const ResolutionCard = ({resolution}: any) => {

  return (
    <Grid item xs={4}>
      <Card sx={{height: '10em', boxShadow: 3}}>
        <CardHeader title={resolution.title} titleTypographyProps={{fontWeight: 'medium'}} action={
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        }/>
        <CardContent>
          <GoalProgress goalsCompleted={resolution.goals_completed} goalCount={resolution.goal_count}/>
        </CardContent>
      </Card>
    </Grid>
  );
}

export default ResolutionCard;
