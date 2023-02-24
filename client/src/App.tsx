import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import HeaderDrawer from "./components/HeaderDrawer";
import LogInModal from "./components/LogInModal";
import { ResolutionProvider } from "./contexts/ResolutionContext";
import { UserProvider } from "./contexts/UserContext";
import CreateResolutionForm from "./navigation/CreateResolutionForm";
import Dashboard from "./navigation/Dashboard";
import ErrorPage from "./navigation/ErrorPage";
import ResolutionInfo from "./navigation/ResolutionInfo";

function App() {

  return (
    <BrowserRouter>
      <UserProvider>
        <ResolutionProvider>
          <LogInModal />
          <HeaderDrawer>
            <Routes>
              <Route path='*' element={<ErrorPage />} />
              <Route path='/' element={<Dashboard />} />
              <Route path='/create' element={<CreateResolutionForm />} />
              <Route path='/resolution/:id' element={<ResolutionInfo />} />
            </Routes>
          </HeaderDrawer>
        </ResolutionProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
