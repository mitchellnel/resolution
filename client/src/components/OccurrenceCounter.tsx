import { Button, Typography } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';

/**
 * The props type for {@link OccurrenceCounter}.
 * 
 * @category Component Props
 */
export interface OccurrenceCounterProps {
    /**
     * Times to achieve current goal
     */
    nTimesToAchieve: number,
  /**
   * Function that calls the backend API to achieve a goal in the database
   */
    goalAchievementHandler: () => void
}

/**
 * A component attached to {@link GoalCard}s that are not completed. Shows the number of achievements left
 * for a certain goal when not hovered. When the component is hovered, a green checkmark appears and it
 * can be clicked, which will send an achievement request to the backend API, causing the number of achievements
 * left to decrement.
 * 
 * @group Components
 * @category Page
 * @returns OccurrenceCounter component
 */
const OccurrenceCounter = ({ nTimesToAchieve, goalAchievementHandler } : OccurrenceCounterProps) => {

    const style = {
        height: '70%',
        border: '2px solid gray',
        fontSize: 40,
        ".checkmark": {
            opacity: 0,
            position: 'absolute',
            transition: '0.1s'
        },
        ".occurrences": {
            opacity: 1,
            transition: '0.1s'
        },
        "&:hover .checkmark":{
            opacity: 1
        },
        "&:hover .occurrences":{
            opacity: 0,
            position: 'absolute'
        },
      };

  return (
    <Button onClick={goalAchievementHandler} sx={style} color='success'>
        <CheckIcon className='checkmark' fontSize="inherit" />
        <Typography className='occurrences' fontSize="inherit" color="secondary">
            {nTimesToAchieve}
        </Typography>
    </Button>
  );
}

export default OccurrenceCounter;