import React, { useState, useEffect } from 'react';
import { Select } from "@chakra-ui/react";

const CategorySelect = ({ categories }) => {
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  return (
    <Select
      
      onChange={handleChange}
      value={selectedCategory}
      placeholder="Choisir une categorie"
    >

      {categories.map(category => (
        <option key={category._id} value={category._id}>{category.name}</option>
      ))}
    </Select>
  );
};

export default CategorySelect;