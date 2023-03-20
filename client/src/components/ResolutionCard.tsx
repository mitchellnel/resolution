import { Card, CardContent, CardHeader, Grid, Typography } from "@mui/material";
import GoalProgress from "./GoalProgress/GoalProgress";
import { Resolution } from "../contexts/ResolutionContext";
import { Link} from "react-router-dom";
import ResolutionOptions from "./ResolutionOptions";

/**
 * The props type for {@link ResolutionCard}.
 * 
 * @category Component Props
 */
export interface ResolutionCardProps {
  /**
   * The resolution to display
   */
  resolution: Resolution
}

/**
 * Displays resolution information on the {@link Dashboard}. Shows resolution title, description, as well as 
 * {@link GoalProgress}, which displays resolution progress dependent on what proportion of goals are completed.
 * 
 * @group Components
 * @category Page
 * @returns ResolutionCard component
 */
const ResolutionCard = ({resolution}: ResolutionCardProps) => {

  return (
    <Grid item xs={4}>
      <Link to={`/resolution/${resolution.id}`} style={{textDecoration: 'none'}}>
        <Card sx={{height: '10em', boxShadow: 3}}>
          <CardHeader title={resolution.title} titleTypographyProps={{fontWeight: 'medium'}} action={<ResolutionOptions resolution={resolution}/>}/>
          <CardContent sx={{paddingTop: '0px'}}>
            <Typography gutterBottom>{resolution.description}</Typography>
            <GoalProgress style={{}} goalsCompleted={resolution.goals_completed} goalCount={resolution.goal_count}/>
          </CardContent>
        </Card>
      </Link>
    </Grid>
  );
}

export default ResolutionCard;
