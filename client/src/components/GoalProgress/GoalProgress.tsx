import './GoalProgress.css'

/**
 * The props type for {@link GoalProgress}.
 * 
 * @category Component Props
 */
export interface GoalProgressProps {
  /**
   * The style for {@link GoalProgress}
   */
  style: any,
  /**
   * The number of goals completed
   */
  goalsCompleted: number,
  /**
   * The total number of goals
   */
  goalCount: number
}

/**
 * Displays a progress bar showing how many goals are completed compared to how many goals exist.
 * 
 * @group Components
 * @category Page
 * @returns GoalProgress component
 */
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