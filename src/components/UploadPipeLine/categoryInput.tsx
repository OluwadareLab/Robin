import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';

const MyDropdown = () => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleDropdownSelect = (value) => {
    setInputValue(value);
  };

  const onCLick = (e) => {
    e.preventDefault();
    if (inputValue.trim() !== '') {
      setOptions(prevOptions => [...prevOptions, inputValue.trim()]);
      setInputValue('');
    }
  };

  return (
    <div>
      
        <input 
          type="text" 
          value={inputValue} 
          onChange={handleInputChange} 
          placeholder="Category Name" 
        />
        <button type="button" onClick={onCLick}>Add</button>
  
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          Select an option
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {options.map((option, index) => (
            <Dropdown.Item key={index} onClick={() => handleDropdownSelect(option)}>
              {option}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default MyDropdown;
