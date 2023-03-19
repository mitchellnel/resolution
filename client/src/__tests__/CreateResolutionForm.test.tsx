import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import CreateResolutionForm from "../navigation/CreateResolutionForm";

const MockCreateResolutionForm = () => {
  return (
    <BrowserRouter>
      <CreateResolutionForm />
    </BrowserRouter>
  );
};

describe("CreateResolutionForm tests", () => {
  it("Create resolution title as bound data", () => {
    render(<MockCreateResolutionForm />);
    const titleInputElement = screen.getByTestId(
      "create-resolution-form-title"
    );
    fireEvent.change(titleInputElement, { target: { value: "test title" } });
    expect((titleInputElement as HTMLInputElement).value).toBe("test title");
  });

  it("Create resolution description as bound data", () => {
    render(<MockCreateResolutionForm />);
    const descriptionInputElement = screen.getByTestId(
      "create-resolution-form-description"
    );
    fireEvent.change(descriptionInputElement, {
      target: { value: "test description" },
    });
    expect((descriptionInputElement as HTMLInputElement).value).toBe(
      "test description"
    );
  });
});
