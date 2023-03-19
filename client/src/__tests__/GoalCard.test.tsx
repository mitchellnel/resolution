import { render, screen } from "@testing-library/react";
import GoalCard from "../components/GoalCard";

const mockIncompleteGoal = {
  id: "0",
  description: "mock-description",
  nTimesToAchieve: 3,
  completed: false,
  eventID: "mock-event-string",
};

const mockCompletedGoal = {
  id: "0",
  description: "mock-description",
  nTimesToAchieve: 1,
  completed: true,
  eventID: "mock-event-string",
};

const mockResolutionKey = "mock-resolution-key";

const mockAchieveGoal = jest.fn();

const mocksetCompleted = jest.fn();

describe("GoalCard tests", () => {
  it("GoalCard displays description", () => {
    render(
      <GoalCard
        goal={mockIncompleteGoal}
        resolutionKey={mockResolutionKey}
        achieveGoal={mockAchieveGoal}
        setCompleted={mocksetCompleted}
      />
    );
    const titleElement = screen.getByText(/mock-description/i);
    expect(titleElement).toBeInTheDocument();
  });

  it("GoalCard renders OccurrenceCounter for incomplete goal", () => {
    render(
      <GoalCard
        goal={mockIncompleteGoal}
        resolutionKey={mockResolutionKey}
        achieveGoal={mockAchieveGoal}
        setCompleted={mocksetCompleted}
      />
    );
    const occurrenceCountElement = screen.getByText(/3/i);
    expect(occurrenceCountElement).toBeInTheDocument();
  });

  it("GoalCard doesn't render OccurrenceCounter for complete goal", () => {
    render(
      <GoalCard
        goal={mockCompletedGoal}
        resolutionKey={mockResolutionKey}
        achieveGoal={mockAchieveGoal}
        setCompleted={mocksetCompleted}
      />
    );
    const occurrenceCountElement = screen.queryByText(/1/i);
    expect(occurrenceCountElement).not.toBeInTheDocument();
  });
});
