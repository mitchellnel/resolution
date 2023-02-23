import "./App.css";
import HeaderDrawer from "./components/HeaderDrawer";
import LogInModal from "./components/LogInModal";
import { ResolutionProvider } from "./contexts/ResolutionContext";
import { UserProvider } from "./contexts/UserContext";
import Dashboard from "./navigation/Dashboard";

function App() {

  return (
    <UserProvider>
      <ResolutionProvider>
        <LogInModal />
        <HeaderDrawer>
          <Dashboard />
        </HeaderDrawer>
      </ResolutionProvider>
    </UserProvider>
  );
}

export default App;
