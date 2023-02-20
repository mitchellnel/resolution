import "./App.css";
import HeaderDrawer from "./components/HeaderDrawer";
import LogInModal from "./components/LogInModal";
import { UserProvider } from "./contexts/UserContext";
import Dashboard from "./navigation/Dashboard";

function App() {

  return (
    <UserProvider>
      <LogInModal />
      <HeaderDrawer>
        <Dashboard />
      </HeaderDrawer>
    </UserProvider>
  );
}

export default App;
