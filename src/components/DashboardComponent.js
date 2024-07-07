import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskComponent from './TaskComponent';
import { Snackbar, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

function DashboardComponent() {
  const [tasks, setTasks] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    fetchTasks();
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
        setSuccessMessage('Task deleted successfully!');
        fetchTasks();
        setOpenDialog(false);
      })
      .catch(error => {
        console.error('Error deleting task:', error);
      });
  };

  const handleOpenDialog = (taskId) => {
    setTaskToDelete(taskId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setTaskToDelete(null);
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage('');
  };

  return (
    <div>
      <TaskComponent tasks={tasks} onDelete={handleOpenDialog} />
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this task?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleDelete(taskToDelete)} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={successMessage}
        action={
          <Button color="inherit" size="small" onClick={handleCloseSnackbar}>
            Close
          </Button>
        }
      />
    </div>
  );
}

export default DashboardComponent;
