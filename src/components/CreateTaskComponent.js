import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, Select, MenuItem, Grid } from '@mui/material';
import axios from 'axios';

function CreateTaskComponent({ open, onClose, onSuccess }) {
  const [newTaskData, setNewTaskData] = useState({
    title: '',
    description: '',
    priorites: 'Low',
    categories: {
      id: 0,
      title: '',
      labelColor: '',
    },
    taskEndDate: new Date().toISOString().slice(0, 10),
  });
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    axios.get('http://localhost:8080/api/categories/getAll')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name.startsWith('categories.')) {
      const key = name.split('.')[1];
      setNewTaskData(prevState => ({
        ...prevState,
        categories: {
          ...prevState.categories,
          [key]: value,
        }
      }));
    } else {
      setNewTaskData(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    if (event.target.value) {
      const category = categories.find(cat => cat.id === event.target.value);
      setNewTaskData(prevState => ({
        ...prevState,
        categories: category,
      }));
    } else {
      setNewTaskData(prevState => ({
        ...prevState,
        categories: {
          id: 0,
          title: '',
          labelColor: '',
        }
      }));
    }
  };

  const handleSubmit = () => {
    if (!selectedCategory) {
      axios.post('http://localhost:8080/api/categories/createNewCategory', {
        title: newTaskData.categories.title,
        labelColor: newTaskData.categories.labelColor,
      })
        .then(response => {
          createTask(response.data.id);
        })
        .catch(error => {
          console.error('Error creating new category:', error);
        });
    } else {
      createTask(selectedCategory);
    }
  };

  const createTask = (categoryId) => {
    const requestData = {
      title: newTaskData.title,
      description: newTaskData.description,
      priorites: newTaskData.priorites,
      taskEndDate: newTaskData.taskEndDate,
    };

    axios.post(`http://localhost:8080/api/task/createNewTask/${categoryId}`, requestData)
      .then(response => {
        onClose();
        onSuccess('Task created successfully!');
        resetForm();
      })
      .catch(error => {
        console.error('Error creating new task:', error);
      });
  };

  const resetForm = () => {
    setNewTaskData({
      title: '',
      description: '',
      priorites: 'Low',
      categories: { id: 0, title: '', labelColor: '' },
      taskEndDate: new Date().toISOString().substr(0, 10),
    });
    setSelectedCategory('');
  };

  const today = new Date().toISOString().substr(0, 10);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        outline: 'none',
        borderRadius: 2,
      }}>
        <Typography variant="h6" align="center" gutterBottom>Create New Task</Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              name="title"
              label="Title"
              value={newTaskData.title}
              onChange={handleChange}
              fullWidth
              margin="dense"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="taskEndDate"
              label="Task End Date"
              type="date"
              value={newTaskData.taskEndDate}
              onChange={handleChange}
              fullWidth
              margin="dense"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: today }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="description"
              label="Description"
              value={newTaskData.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
              margin="dense"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="priorites"
              select
              label="Priority"
              value={newTaskData.priorites}
              onChange={handleChange}
              fullWidth
              margin="dense"
              variant="outlined"
            >
              {['Low', 'Medium', 'High'].map((priority) => (
                <MenuItem key={priority} value={priority}>
                  {priority}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <Select
              value={selectedCategory}
              onChange={handleCategoryChange}
              fullWidth
              displayEmpty
              renderValue={(selected) => selected ? categories.find(cat => cat.id === selected).title : 'Select Category'}
              variant="outlined"
              margin="dense"
            >
              <MenuItem value="" disabled>
                Select Category
              </MenuItem>
              {categories.map(category => (
                <MenuItem key={category.id} value={category.id}>{category.title}</MenuItem>
              ))}
            </Select>
          </Grid>
          {!selectedCategory && (
            <>
              <Grid item xs={6}>
                <TextField
                  name="categories.title"
                  label="New Category Title"
                  value={newTaskData.categories.title}
                  onChange={handleChange}
                  fullWidth
                  margin="dense"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="categories.labelColor"
                  label="New Category Label Color"
                  value={newTaskData.categories.labelColor}
                  onChange={handleChange}
                  fullWidth
                  margin="dense"
                  variant="outlined"
                />
              </Grid>
            </>
          )}
          <Grid item xs={12} display="flex" justifyContent="flex-end" mt={2}>
            <Button variant="outlined" onClick={onClose} sx={{ mr: 1 }}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>Create Task</Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}

export default CreateTaskComponent;
