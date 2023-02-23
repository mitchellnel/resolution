import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import HeaderDrawer from "./components/HeaderDrawer";
import LogInModal from "./components/LogInModal";
import { ResolutionProvider } from "./contexts/ResolutionContext";
import { UserProvider } from "./contexts/UserContext";
import CreateResolutionForm from "./navigation/CreateResolutionForm";
import Dashboard from "./navigation/Dashboard";

function App() {

  return (
    <BrowserRouter>
      <UserProvider>
        <ResolutionProvider>
          <LogInModal />
          <HeaderDrawer>
            <Routes>
              <Route path='/' element={<Dashboard />} />
              <Route path='/create' element={<CreateResolutionForm />} />
            </Routes>
          </HeaderDrawer>
        </ResolutionProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
