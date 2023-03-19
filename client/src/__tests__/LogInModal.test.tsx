import { render, screen } from "@testing-library/react";
import LogInModal from "../components/LogInModal";
import { UserContext } from "../contexts/UserContext";

function renderLogInModal(authState: boolean) {
  return render(
    //LogInModal only uses authenticated flag from UserContext, so currentUser can be null
    <UserContext.Provider
      value={{ currentUser: null, authenticated: authState }}
    >
      <LogInModal />
    </UserContext.Provider>
  );
}

describe("LogInModal tests", () => {
  it("LogInModal Box renders when user is not authenticated", () => {
    renderLogInModal(false);
    const logInBoxElement = screen.getByTestId("log-in-box");
    expect(logInBoxElement).toBeInTheDocument();
  });

  it("LogInModal Box doesn't render when user is authenticated", () => {
    renderLogInModal(true);
    const logInBoxElement = screen.queryByTestId("log-in-box");
    expect(logInBoxElement).not.toBeInTheDocument();
  });
});
