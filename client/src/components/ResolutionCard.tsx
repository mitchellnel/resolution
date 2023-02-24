import { Card, CardContent, CardHeader, Grid, IconButton, Typography } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import GoalProgress from "./GoalProgress/GoalProgress";
import { Resolution } from "../contexts/ResolutionContext";
import { Link } from "react-router-dom";

interface ResolutionCardProps {
  resolution: Resolution
}

const ResolutionCard = ({resolution}: ResolutionCardProps) => {

  return (
    <Grid item xs={4}>
      <Link to={`/resolution/${resolution.id}`} style={{textDecoration: 'none'}}>
        <Card sx={{height: '10em', boxShadow: 3}}>
          <CardHeader title={resolution.title} titleTypographyProps={{fontWeight: 'medium'}} action={
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          }/>
          <CardContent sx={{paddingTop: '0px'}}>
            <Typography gutterBottom>{resolution.description}</Typography>
            <GoalProgress goalsCompleted={resolution.goals_completed} goalCount={resolution.goal_count}/>
          </CardContent>
        </Card>
      </Link>
    </Grid>
  );
}

export default ResolutionCard;
