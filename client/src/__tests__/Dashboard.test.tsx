import { render, screen } from "@testing-library/react";
import Dashboard from "../navigation/Dashboard";
import { Resolution, ResolutionContext } from "../contexts/ResolutionContext";
import { BrowserRouter } from "react-router-dom";

const mockResolutions: Resolution[] = [
  {
    id: "0",
    title: "mock-title-0",
    description: "mock-description-0",
    goals: [],
    goals_completed: 0,
    goal_count: 1,
  },
  {
    id: "1",
    title: "mock-title-1",
    description: "mock-description-1",
    goals: [],
    goals_completed: 0,
    goal_count: 1,
  },
];

const MockResolutionContextValue = {
  resolutions: mockResolutions,
  addResolution: jest.fn(),
  deleteResolution: jest.fn(),
  updateResolution: jest.fn(),
  getResolutionById: jest.fn(),
  addGoal: jest.fn(),
  achieveGoal: jest.fn(),
  setGoalCompleted: jest.fn(),
  deleteGoal: jest.fn(),
  updateGoal: jest.fn(),
};

function renderDashboard() {
  return render(
    <BrowserRouter>
      <ResolutionContext.Provider value={MockResolutionContextValue}>
        <Dashboard />
      </ResolutionContext.Provider>
    </BrowserRouter>
  );
}

describe("Dashboard tests", () => {
  it("Dashboard renders goal cards from resolutions in ResolutionContext", () => {
    renderDashboard();
    const titleElement0 = screen.getByText(/mock-title-0/i);
    expect(titleElement0).toBeInTheDocument();
    const descriptionElement0 = screen.getByText(/mock-description-0/i);
    expect(descriptionElement0).toBeInTheDocument();
    const titleElement1 = screen.getByText(/mock-title-1/i);
    expect(titleElement1).toBeInTheDocument();
    const descriptionElement1 = screen.getByText(/mock-description-1/i);
    expect(descriptionElement1).toBeInTheDocument();
  });
});
