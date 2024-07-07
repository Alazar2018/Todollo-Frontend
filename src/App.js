import React, { useState } from 'react';
import { AppBar, Container, Toolbar, Typography, IconButton, Snackbar,Button } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DashboardComponent from './components/DashboardComponent';
import CreateTaskComponent from './components/CreateTaskComponent';

function App() {
  const [open, setOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleCreateTask = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSuccessMessage = (message) => {
    setSuccessMessage(message);
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage('');
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>To-Do List</Typography>
          <IconButton color="inherit" onClick={handleCreateTask}>
            <AddCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" style={{ marginTop: '20px' }}>
        <DashboardComponent />
      </Container>
      <CreateTaskComponent 
        open={open} 
        onClose={handleClose} 
        onSuccess={handleSuccessMessage} 
      />
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

export default App;
