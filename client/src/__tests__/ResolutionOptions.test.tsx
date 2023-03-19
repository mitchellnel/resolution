import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ResolutionOptions from '../components/ResolutionOptions';

const mockResolution = {
    id: '0',
    title: 'mock-title',
    description: 'mock-description',
    goals: [],
    goals_completed: 0,
    goal_count: 1
};

const MockResolutionOptions = () => {
    return (
      <BrowserRouter>
        <ResolutionOptions resolution={mockResolution}/>
      </BrowserRouter>
    )
  };

describe('ResolutionOptions tests', () => {
  it("ResolutionOptions doesn't render edit option when options button is not clicked", () => {
    render(<MockResolutionOptions />);
    const titleElement = screen.queryByText(/edit/i);
    expect(titleElement).not.toBeInTheDocument();
  });

  it("ResolutionOptions doesn't render delete option when options button is not clicked", () => {
    render(<MockResolutionOptions />);
    const titleElement = screen.queryByText(/delete/i);
    expect(titleElement).not.toBeInTheDocument();
  });

  it("ResolutionOptions renders edit option when options button is clicked", () => {
    render(<MockResolutionOptions />);
    const buttonElement = screen.getByTestId('resolution-options-button');
    fireEvent.click(buttonElement);
    const titleElement = screen.getByText(/edit/i);
    expect(titleElement).toBeInTheDocument();
  });

  it('ResolutionOptions renders delete option when options button is clicked', () => {
    render(<MockResolutionOptions />);
    const buttonElement = screen.getByTestId('resolution-options-button');
    fireEvent.click(buttonElement);
    const titleElement = screen.getByText(/delete/i);
    expect(titleElement).toBeInTheDocument();
  });
});