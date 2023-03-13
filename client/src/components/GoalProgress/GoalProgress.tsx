import './GoalProgress.css'

interface GoalProgressProps {
  style: any,
  goalsCompleted: number,
  goalCount: number
}

const GoalProgress = ({style, goalsCompleted, goalCount}: GoalProgressProps) => {

  return (
    <div style={style} className="progress">
        <div className="progress-done" style={{width: `${goalsCompleted/goalCount * 100}%`}}/>
        <div className="progress-text" style={{fontWeight: 'bold'}}>
          {goalsCompleted/goalCount === 1 ? 'COMPLETED!' : `${goalsCompleted}/${goalCount} GOALS DONE!`}
        </div>
    </div>
  );
}

export default GoalProgress;