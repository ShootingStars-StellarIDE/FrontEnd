import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ContainerListPage from "./pages/ContainerListPage";
import ContainerEditPage from "./pages/ContainerEditPage";
import SearchPassword from "./pages/SearchPassword";
import SearchEmail from "./pages/SearchEmail";

function App() {
  return (
    <div className="App-header">
      <Router>
        <Routes>
          <Route path={"/"} element={<LoginPage />} />
          <Route path={"/signup"} element={<SignUpPage />} />
          <Route path={"/search-email"} element={<SearchEmail />} />
          <Route path={"/search-password"} element={<SearchPassword />} />
          <Route
            path={"/dashboard/containers"}
            element={<ContainerListPage />}
          />
          <Route path={"/containers/1"} element={<ContainerEditPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
