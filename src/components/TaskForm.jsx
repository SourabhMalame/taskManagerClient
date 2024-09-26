import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios"; // Import axios for API calls

const API_URL = "http://localhost:5000/api/tasks"; // Your API base URL

const TaskForm = ({ addTaskToState }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("Uncompleted");
  const [category, setCategory] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // For handling errors
  const [successMessage, setSuccessMessage] = useState(""); // For success notification

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("email")
    const newTask = {
      title,
      description,
      status,
      startDate,
      endDate,
      category,
      userId, // Include userId in the task object
    };

    try {
      const savedTask = await addTask(newTask); // Call the API to add the task
      if (addTaskToState) {
        addTaskToState(savedTask); // Update state in parent component if needed
      }

      // Reset form fields
      setTitle("");
      setDescription("");
      setStatus("Uncompleted");
      setStartDate("");
      setEndDate("");
      setCategory("");

      // Show success message
      setSuccessMessage("Task added successfully!");
      setErrorMessage(""); // Clear any previous error messages

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      setErrorMessage("Error saving task. Please try again.");
      setSuccessMessage(""); // Clear success message on error
      console.error("Error saving task:", error);
    }
  };

  // Define the addTask function directly within the component
  const addTask = async (task) => {
    try {
      const response = await axios.post(`${API_URL}/tasks`, task); // Replace with your actual endpoint
      return response.data; // Return the saved task data
    } catch (error) {
      throw error; // Throw the error to be caught in handleSubmit
    }
  };

  return (
    <>
      {/* Display success message */}
      {successMessage && (
        <Alert variant="success" className="my-3">
          {successMessage}
        </Alert>
      )}

      {/* Display error message */}
      {errorMessage && (
        <Alert variant="danger" className="my-3">
          {errorMessage}
        </Alert>
      )}

      <Form onSubmit={handleSubmit} className="task-form">
        <Form.Group className="mb-3" controlId="task-title">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="task-description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter task description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="task-status">
          <Form.Label>Status</Form.Label>
          <Form.Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="Uncompleted">Uncompleted</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="task-category">
          <Form.Label>Category</Form.Label>
          <Form.Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Urgent">Urgent</option>
            <option value="Others">Others</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="start-date">
          <Form.Label>Start Date</Form.Label>
          <Form.Control
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="end-date">
          <Form.Label>End Date</Form.Label>
          <Form.Control
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="success" type="submit">
          Add Task
        </Button>
      </Form>
    </>
  );
};

export default TaskForm;
