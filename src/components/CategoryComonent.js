import React from 'react';
import { Select, MenuItem, TextField } from '@mui/material';

function CategoryComponent({ categories, selectedCategory, setSelectedCategory, newTaskData, handleChange }) {
  return (
    <div>
      <Select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        fullWidth
        displayEmpty
      >
        <MenuItem value="" disabled>
          Select Category
        </MenuItem>
        {categories.map(category => (
          <MenuItem key={category.id} value={category.id}>{category.title}</MenuItem>
        ))}
      </Select>

      {!selectedCategory && (
        <div>
          <TextField
            name="categories.title"
            label="Category Title"
            value={newTaskData.categories.title}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="categories.label"
            label="Category Label"
            value={newTaskData.categories.label}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </div>
      )}
    </div>
  );
}

export default CategoryComponent;
