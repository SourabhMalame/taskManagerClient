// src/App.js
import "./App.css";
import Login from "./components/Login";
import NavbarMain from "./components/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RegistrationForm from "./components/RegistrationForm";
import Dashboard from "./components/pages/Dashbord";
import PrivateRoute from "./util/PrivateRoute"; // Import the PrivateRoute component

function App() {
  return (
    <BrowserRouter>
      <NavbarMain />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<RegistrationForm />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
