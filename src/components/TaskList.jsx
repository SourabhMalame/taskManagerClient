import React, { useEffect, useState } from "react";
import { Card, Spinner, Alert, Form, Button, Modal } from "react-bootstrap";
import axios from "axios";
import moment from "moment";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [showModal, setShowModal] = useState(false); // Modal visibility state

  const getStatusClass = (status) => {
    switch (status) {
      case "Completed":
        return "bg-success text-white";
      case "Pending":
        return "bg-warning text-dark";
      case "Uncompleted":
        return "bg-danger text-white";
      default:
        return "";
    }
  };

  const formatDate = (date) => {
    return moment(date).isValid() ? moment(date).format("MMMM Do, YYYY") : "Invalid date";
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/tasks");
      setTasks(response.data);
    } catch (err) {
      setError("Error fetching tasks.");
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`);
      fetchTasks(); // Reload tasks after deletion
    } catch (err) {
      setError("Error deleting task.");
      console.error("Error deleting task:", err);
    }
  };

  const handleUpdateClick = (task) => {
    setSelectedTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setCategory(task.category);
    setStatus(task.status);
    setShowModal(true); // Show modal on update
  };

  const updateTask = async (taskId) => {
    try {
      const updatedTask = { title, description, category, status };
      await axios.put(`http://localhost:5000/api/tasks/${taskId}`, updatedTask);
      fetchTasks(); // Reload tasks after update
      setShowModal(false); // Close modal after saving changes
    } catch (err) {
      setError("Error updating task.");
      console.error("Error updating task:", err);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const statusMatch = statusFilter ? task.status === statusFilter : true;
    const categoryMatch = categoryFilter ? task.category === categoryFilter : true;
    return statusMatch && categoryMatch;
  });

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  const uniqueCategories = [...new Set(tasks.map((task) => task.category))];

  return (
    <>
      <div className="mb-4">
        <Form.Group controlId="statusFilter">
          <Form.Label>Status</Form.Label>
          <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Uncompleted">Uncompleted</option>
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="categoryFilter">
          <Form.Label>Category</Form.Label>
          <Form.Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">All Categories</option>
            {uniqueCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </div>

      <div className="row">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div className="col-md-4 mb-3" key={task._id}>
              <Card className={`h-100 Taskcard ${getStatusClass(task.status)}`}>
                <Card.Body>
                  <Card.Text>
                    <strong>Start Date:</strong> {formatDate(task.startDate)}
                  </Card.Text>
                  <hr />
                  <Card.Title>{task.title}</Card.Title>
                  <Card.Text>
                    <strong>Description:</strong> {task.description}
                  </Card.Text>
                  <Card.Text>
                    <strong>Status:</strong> {task.status}
                  </Card.Text>
                  <Card.Text>
                    <strong>Category:</strong> {task.category}
                  </Card.Text>
                  <Card.Text>
                    <strong>End Date:</strong> {formatDate(task.endDate)}
                  </Card.Text>
                  <Button variant="danger" className="border" onClick={() => deleteTask(task._id)}>
                    Delete
                  </Button>
                  <Button variant="warning" className="border" onClick={() => handleUpdateClick(task)}>
                    Update
                  </Button>
                </Card.Body>
              </Card>
            </div>
          ))
        ) : (
          <div className="col-12">
            <p className="text-center">No tasks available for this filter.</p>
          </div>
        )}
      </div>

      {/* Modal for Update Form */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formCategory">
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formStatus">
            <Form.Label>Status</Form.Label>
            <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Uncompleted">Uncompleted</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => updateTask(selectedTask._id)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TaskList;
