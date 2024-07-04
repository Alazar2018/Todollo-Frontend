import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import DetailTaskComponent from './DetailTaskComponent'; // Import the DetailTaskComponent

const getColorForPriority = (priority) => {
  switch (priority) {
    case 'Low':
      return 'green';
    case 'Medium':
      return 'yellow';
    case 'High':
      return 'red';
    default:
      return 'default'; // Default color if priority is not recognized
  }
};

function TaskComponent() {
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false); // State for confirmation dialog

  useEffect(() => {
    fetchTasks();

    // Refresh tasks every 3 seconds
    const interval = setInterval(fetchTasks, 3000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const fetchTasks = () => {
    axios.get('http://localhost:8080/api/task/getAll')
      .then(response => {
        setTasks(response.data);
      })
      .catch(error => {
        console.error('Error fetching tasks:', error);
      });
  };

  const handleDelete = (taskId) => {
    axios.delete(`http://localhost:8080/api/task/remove/${taskId}`)
      .then(response => {
        fetchTasks(); // Reload tasks after deletion
        // Clear selected task when it's deleted
        if (selectedTaskId === taskId) {
          setSelectedTaskId(null);
          setOpenDialog(false); // Close dialog if the deleted task is currently open
        }
      })
      .catch(error => {
        console.error('Error deleting task:', error);
      });
  };

  const handleConfirmDelete = (taskId) => {
    setConfirmDeleteOpen(false); // Close confirmation dialog
    handleDelete(taskId); // Proceed with deletion
  };

  const handleRowClick = (taskId) => {
    if (tasks.find(task => task.id === taskId)?.status !== 'COMPLETED' && !confirmDeleteOpen) {
      setSelectedTaskId(taskId);
      setOpenDialog(true); // Open the dialog when a task is selected
    }
  };

  const handleCloseDialog = () => {
    setSelectedTaskId(null); // Clear selected task ID
    setOpenDialog(false); // Close the dialog
  };

  const openDeleteConfirmation = (taskId) => {
    setSelectedTaskId(taskId);
    setConfirmDeleteOpen(true); // Open confirmation dialog
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Task End Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}  style={{ cursor: 'pointer', textDecoration: task.status === 'COMPLETED' ? 'line-through' : 'none', backgroundColor: task.status === 'COMPLETED' ? 'green' : 'none', color: task.status === 'COMPLETED' ? 'white' : 'none' }}>
                <TableCell onClick={() => handleRowClick(task.id)} style={{ color: task.status === 'COMPLETED' ? 'white' : 'black' }}>{task.title}</TableCell>
                <TableCell onClick={() => handleRowClick(task.id)}>
                  <Chip label={task.priorites} style={{ backgroundColor: getColorForPriority(task.priorites), color: task.priorites !== 'Medium' ? 'white' : 'black', textDecoration: task.status === 'COMPLETED' ? 'line-through' : 'none' }} />
                </TableCell>
                <TableCell onClick={() => handleRowClick(task.id)} style={{ color: task.status === 'COMPLETED' ? 'white' : 'black' }}>{task.categories}</TableCell>
                <TableCell onClick={() => handleRowClick(task.id)} style={{ color: task.status === 'COMPLETED' ? 'white' : 'black' }}>{new Date(task.taskEndDate).toLocaleString()}</TableCell>
                <TableCell >
                  {task.status !== 'COMPLETED' && !confirmDeleteOpen && (
                    <IconButton onClick={() => openDeleteConfirmation(task.id)} style={{ color: 'red' }}>
                      <DeleteIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog to display task details */}
      <Dialog open={openDialog} onClose={handleCloseDialog} aria-labelledby="task-detail-dialog">
        <DialogTitle>Task Details</DialogTitle>
        <DialogContent>
          {selectedTaskId && <DetailTaskComponent taskId={selectedTaskId} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation dialog for delete */}
      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this task?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleConfirmDelete(selectedTaskId)} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default TaskComponent;
