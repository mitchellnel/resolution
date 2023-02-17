import './GoalProgress.css'

const GoalProgress = ({goalsCompleted, goalCount}: any) => {

  return (
    <div className="progress">
        <div className="progress-done" style={{width: `${goalsCompleted/goalCount * 100}%`}}/>
        <div className="progress-text" style={{fontWeight: 'bold'}}>
          {goalsCompleted/goalCount === 1 ? 'COMPLETED!' : `${goalsCompleted}/${goalCount} GOALS DONE!`}
        </div>
    </div>
  );
}

export default GoalProgress;