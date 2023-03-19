import { fireEvent, render, screen } from "@testing-library/react";
import UpdateGoalForm from "../components/UpdateGoalForm";

const currentDescription = "test description"

const mockSubmitForm = jest.fn();

const mockCloseEditForm = jest.fn();

describe("UpdateGoalForm tests", () => {
  it("Update goal description as bound data", () => {
    render(<UpdateGoalForm current_description={currentDescription} submitForm={mockSubmitForm} closeEditForm={mockCloseEditForm}/>);
    const descriptionInputElement = screen.getByTestId("update-goal-form-description");
    fireEvent.change(descriptionInputElement, { target: { value: "new test description" } });
    expect((descriptionInputElement as HTMLInputElement).value).toBe("new test description");
  });

  it("Update goal description initialzes with current_descriptoin", () => {
    render(<UpdateGoalForm current_description={currentDescription} submitForm={mockSubmitForm} closeEditForm={mockCloseEditForm}/>);
    const descriptionInputElement = screen.getByTestId("update-goal-form-description");
    expect((descriptionInputElement as HTMLInputElement).value).toBe(currentDescription);
  });
});