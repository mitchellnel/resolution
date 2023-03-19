import { fireEvent, render, screen } from "@testing-library/react";
import CreateGoalForm from "../components/CreateGoalForm";

const mockSubmitForm = jest.fn();

const mockCloseForm = jest.fn();

describe("CreateGoalForm tests", () => {
  it("Create goal description as bound data", () => {
    render(
      <CreateGoalForm submitForm={mockSubmitForm} closeForm={mockCloseForm} />
    );
    const descriptionInputElement = screen.getByTestId(
      "create-goal-form-description"
    );
    fireEvent.change(descriptionInputElement, {
      target: { value: "test description" },
    });
    expect((descriptionInputElement as HTMLInputElement).value).toBe(
      "test description"
    );
  });

  it("Create goal timesToAchieve as bound data", () => {
    render(
      <CreateGoalForm submitForm={mockSubmitForm} closeForm={mockCloseForm} />
    );
    const timesToAchieveInputElement = screen.getByTestId(
      "create-goal-form-times-to-achieve"
    );
    fireEvent.change(timesToAchieveInputElement, { target: { value: 5 } });
    expect((timesToAchieveInputElement as HTMLInputElement).value).toBe("5");
  });
});
