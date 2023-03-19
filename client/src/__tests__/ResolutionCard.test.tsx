import { render, screen } from "@testing-library/react";
import ResolutionCard from "../components/ResolutionCard";
import { BrowserRouter } from "react-router-dom";

const mockResolution = {
  id: "0",
  title: "mock-title",
  description: "mock-description",
  goals: [],
  goals_completed: 0,
  goal_count: 1,
};

const MockResolutionCard = () => {
  return (
    <BrowserRouter>
      <ResolutionCard resolution={mockResolution} />
    </BrowserRouter>
  );
};

describe("ResolutionCard tests", () => {
  it("ResolutionCard displays title", () => {
    render(<MockResolutionCard />);
    const titleElement = screen.getByText(/mock-title/i);
    expect(titleElement).toBeInTheDocument();
  });

  it("ResolutionCard displays description", () => {
    render(<MockResolutionCard />);
    const descriptionElement = screen.getByText(/mock-description/i);
    expect(descriptionElement).toBeInTheDocument();
  });
});
