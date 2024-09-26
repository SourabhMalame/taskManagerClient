// src/components/pages/Dashboard.js
import React, { useState, useEffect } from "react";
import { Modal, Button, Dropdown } from "react-bootstrap";
import TaskList from "../../components/TaskList";
import TaskForm from "../../components/TaskForm";
import TaskOverview from "../../components/TaskOverview";
import axios from "axios"; // Import axios for API calls

const API_URL = "http://localhost:5000/api/tasks"; // Correct API base URL

const Dashboard = ({ user }) => {
  console.log(user);
  const [tasks, setTasks] = useState([]); // Store all tasks
  const [showForm, setShowForm] = useState(false); // Control modal visibility
  const [filterStatus, setFilterStatus] = useState("All"); // State for status filter
  const [filterCategory, setFilterCategory] = useState("All"); // State for category filter
  const [error, setError] = useState(""); // State for error messages

  // Fetch tasks for the logged-in user when the component mounts
  useEffect(() => {
    const fetchTasks = async () => {
      if (user && user.id) {
        try {
          const response = await axios.get(`${API_URL}/${user.id}`); // Fetch tasks by user ID
          setTasks(response.data); // Update tasks state with fetched tasks
        } catch (error) {
          setError("Failed to fetch tasks. Please try again later.");
          console.error("Error fetching tasks:", error);
        }
      }
    };

    fetchTasks(); // Call the function
  }, [user]); // Re-run when user changes

  // Function to add a new task to the API
  const addTask = async (task) => {
    try {
      const response = await axios.post(API_URL, {
        ...task,
        userId: userIds, // Include userId when adding a new task
      });
      setTasks((prevTasks) => [...prevTasks, response.data]); // Update local state with the new task
      setShowForm(false); // Close the modal after adding the task
    } catch (error) {
      setError("Error adding task. Please try again."); // Set error message
      console.error("Error adding task:", error);
    }
  };

  const toggleTaskForm = () => setShowForm((prev) => !prev); // Toggle modal visibility

  // Function to filter tasks based on status and category
  const filteredTasks = () => {
    return tasks.filter((task) => {
      const matchesStatus =
        filterStatus === "All" || task.status === filterStatus;
      const matchesCategory =
        filterCategory === "All" || task.category === filterCategory;
      return matchesStatus && matchesCategory; // Apply both filters
    });
  };

  return (
    <div className="container my-4">
      {error && <p className="text-danger">{error}</p>}{" "}
      {/* Display error message */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>All Tasks</h2>
        <Button variant="primary" onClick={toggleTaskForm}>
          New Task
        </Button>
      </div>
      <hr />
      <div className="dashboard-container row">
        <div className="dashboard-left col-md-8 mb-2">
          <TaskList tasks={filteredTasks()} /> {/* Render filtered tasks */}
        </div>
        <div className="dashboard-right col-md-4">
          <TaskOverview tasks={tasks} />{" "}
          {/* Task overview based on all tasks */}
        </div>
      </div>
      {/* Modal for Task Form */}
      <Modal show={showForm} onHide={toggleTaskForm}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TaskForm data={addTask} /> {/* Form for adding a new task */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggleTaskForm}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Dashboard;
