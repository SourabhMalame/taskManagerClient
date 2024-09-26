// src/components/TaskOverview.js
import React, { useEffect, useState } from "react";
import { Card, Spinner, Alert } from "react-bootstrap"; // Import Spinner and Alert
import axios from "axios"; // Import axios

const TaskOverview = () => {
  const [tasks, setTasks] = useState([]); // State to store tasks
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch tasks from the API
  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/tasks"); // Adjust the API URL as needed
      setTasks(response.data); // Set the tasks
    } catch (err) {
      setError("Error fetching tasks."); // Handle the error
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  useEffect(() => {
    fetchTasks(); // Call the fetch function on component mount
  }, []); // Empty dependency array means this runs once when the component mounts

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;
  const pendingTasks = tasks.filter((task) => task.status === "Pending").length;
  const uncompletedTasks = tasks.filter(
    (task) => task.status === "Uncompleted"
  ).length;

  // Count tasks by category
  const categoryCount = tasks.reduce((acc, task) => {
    acc[task.category] = (acc[task.category] || 0) + 1;
    return acc;
  }, {});

  if (loading) {
    return <Spinner animation="border" />; // Show loading spinner
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>; // Show error message
  }

  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>Task Overview</Card.Title>
        <hr />
        <p>Total Tasks: {totalTasks}</p>
        <p>Completed Tasks: {completedTasks}</p>
        <p>Pending Tasks: {pendingTasks}</p>
        <p>Uncompleted Tasks: {uncompletedTasks}</p>

        <h6 className="mt-3">Tasks by Category:</h6>
        <ul>
          {Object.entries(categoryCount).map(([category, count]) => (
            <li key={category}>
              {category}: {count}
            </li>
          ))}
        </ul>
      </Card.Body>
    </Card>
  );
};

export default TaskOverview;
