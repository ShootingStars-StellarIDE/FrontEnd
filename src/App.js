import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ContainerListPage from "./pages/ContainerListPage";
import ContainerEditPage from "./pages/ContainerEditPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <div className="App-header">
      <Router>
        <Routes>
          <Route path={"/"} element={<LoginPage />} />
          <Route path={"/signup"} element={<SignUpPage />} />
          <Route
            path={"/dashboard/containers"}
            element={<ContainerListPage />}
          />
          <Route path={"/dashboard/profile"} element={<ProfilePage />} />
          <Route
            path={"/containers/:containerId"}
            element={<ContainerEditPage />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
