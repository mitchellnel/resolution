import "./App.css";
import HeaderDrawer from "./components/HeaderDrawer";
import Dashboard from "./navigation/Dashboard";

function App() {

  return (
    <HeaderDrawer>
      <Dashboard />
    </HeaderDrawer>
  );
}

export default App;
