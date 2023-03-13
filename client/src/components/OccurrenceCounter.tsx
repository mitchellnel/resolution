import { Button, Typography } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';

interface OccurrenceCounterProps {
    completed: boolean,
    nTimesToAchieve: number,
    goalAchievementHandler: () => void
}

const OccurrenceCounter = ({ completed, nTimesToAchieve, goalAchievementHandler } : OccurrenceCounterProps) => {

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
        ...(completed && {
            border: '',
        })
      };

  return (
    <Button onClick={goalAchievementHandler} sx={style} color='success'>
        {!completed &&
        <>
            <CheckIcon className='checkmark' fontSize="inherit" />
            <Typography className='occurrences' fontSize="inherit" color="secondary">
                {nTimesToAchieve}
            </Typography>
        </>
        }
    </Button>
  );
}

export default OccurrenceCounter;