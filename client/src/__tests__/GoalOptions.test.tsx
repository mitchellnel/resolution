import { fireEvent, render, screen } from '@testing-library/react';
import GoalOptions from '../components/GoalOptions';

const mockGoal = {
    id: '0',
    description: 'mock-description',
    nTimesToAchieve: 3,
    completed: false,
    eventID: 'mock-event-string'
};

const mockResolutionKey = 'mock-resolution-key';

const mockOpenEditForm = jest.fn();

describe('GoalOptions tests', () => {
  it("GoalOptions doesn't render edit option when options button is not clicked", () => {
    render(<GoalOptions goal={mockGoal} resolutionKey={mockResolutionKey} openEditForm={mockOpenEditForm}/>);
    const editButtonElement = screen.queryByText(/edit/i);
    expect(editButtonElement).not.toBeInTheDocument();
  });

  it("GoalOptions doesn't render delete option when options button is not clicked", () => {
    render(<GoalOptions goal={mockGoal} resolutionKey={mockResolutionKey} openEditForm={mockOpenEditForm}/>);
    const deleteButtonElement = screen.queryByText(/delete/i);
    expect(deleteButtonElement).not.toBeInTheDocument();
  });

  it("GoalOptions renders edit option when options button is clicked", () => {
    render(<GoalOptions goal={mockGoal} resolutionKey={mockResolutionKey} openEditForm={mockOpenEditForm}/>);
    const optionsButtonElement = screen.getByTestId('goal-options-button');
    fireEvent.click(optionsButtonElement);
    const editButtonElement = screen.getByText(/edit/i);
    expect(editButtonElement).toBeInTheDocument();
  });

  it('GoalOptions renders delete option when options button is clicked', () => {
    render(<GoalOptions goal={mockGoal} resolutionKey={mockResolutionKey} openEditForm={mockOpenEditForm}/>);
    const optionsButtonElement = screen.getByTestId('goal-options-button');
    fireEvent.click(optionsButtonElement);
    const deleteButtonElement = screen.getByText(/delete/i);
    expect(deleteButtonElement).toBeInTheDocument();
  });
});
