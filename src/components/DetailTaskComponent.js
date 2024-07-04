import React, { useState, useEffect } from 'react';
import { Typography, Button, Chip } from '@mui/material';
import axios from 'axios';

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

function DetailTaskComponent({ taskId }) {
  const [taskDetails, setTaskDetails] = useState(null);

  useEffect(() => {
    fetchTaskDetails();
  }, []);

  const fetchTaskDetails = () => {
    axios.get(`http://localhost:8080/api/task/${taskId}`)
      .then(response => {
        setTaskDetails(response.data);
      })
      .catch(error => {
        console.error('Error fetching task details:', error);
      });
  };

  const handleUpdateStatus = (statusText) => {
    axios.put(`http://localhost:8080/api/task/${taskId}/updateStatus/${statusText}`)
      .then(response => {
        fetchTaskDetails(); // Refresh task details after update
      })
      .catch(error => {
        console.error('Error updating task status:', error);
      });
  };

  const isOverdue = () => {
    const currentDate = new Date();
    const taskEndDate = new Date(taskDetails.taskEndDate);
  
    // Clear time part of both dates for comparison
    currentDate.setHours(0, 0, 0, 0);
    taskEndDate.setHours(0, 0, 0, 0);
  
    return currentDate > taskEndDate;
  };
  
  return (
    <div>
      {taskDetails && (
        <div>
          <Typography variant="h6" style={{ textDecoration: taskDetails.status === 'COMPLETED' ? 'line-through' : 'none' }}>
            {taskDetails.title}
          </Typography>
          <Typography variant="body1">{taskDetails.description}</Typography>
          <Typography variant="body2">Priority: <Chip label={taskDetails.priorites} style={{ backgroundColor: getColorForPriority(taskDetails.priorites), color: 'white' }} /></Typography>
          <Typography variant="body2">Category: {taskDetails.categories.title}</Typography>
          <Typography variant="body2">Task End Date: {new Date(taskDetails.taskEndDate).toLocaleString()}</Typography>
          {isOverdue() && <Typography variant="body2" style={{ color: 'red' }}>Status: Overdue</Typography>}
          {!isOverdue() && <Typography variant="body2">Status: {taskDetails.status}</Typography>}
          {!isOverdue() && taskDetails.status !== 'COMPLETED' && (
            <Button variant="contained" color="primary" onClick={() => handleUpdateStatus('Completed')}>
              Mark as Completed
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default DetailTaskComponent;
