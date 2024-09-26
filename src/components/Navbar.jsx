// src/components/Navbar.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import useHistory for navigation
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faSignOut } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const NavbarMain = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigat = useNavigate();

  useEffect(() => {
    // Check for token on component mount
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username"); // Get username from local storage
    if (localStorage.getItem("token")) {
      setIsAuthenticated(true);
      setUser({ name: username }); // Set user data directly from local storage
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token from local storage
    localStorage.removeItem("username"); // Remove the username from local storage
    setIsAuthenticated(false); // Update authenticated state
    setUser(null); // Clear user data
    localStorage.clear();
    window.location.reload();
    navigat("/");
  };

  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{ backgroundColor: "#87CEEB" }}
    >
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <span>
            <FontAwesomeIcon
              icon={faBell}
              color="blue"
              className="fa-shake mx-1"
            />
            <strong>Task Manager</strong>
          </span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="navbar-nav ms-auto">
            <Link className="nav-link" to="/">
              Home
            </Link>
            {isAuthenticated ? (
              <>
                <span className="navbar-text mx-2">
                  Welcome, {user?.name || "User"}!
                </span>
                <div
                  className="nav-link"
                  style={{ cursor: "pointer" }}
                  onClick={handleLogout} // Call handleLogout on sign-out click
                >
                  <FontAwesomeIcon icon={faSignOut} size="lg" />
                </div>
              </>
            ) : (
              <>
                <Link className="nav-link" to="/login">
                  Login
                </Link>
                <Link className="nav-link" to="/signup">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarMain;
