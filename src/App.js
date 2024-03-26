import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import './App.css';
import { evaluate } from 'mathjs';

function App() {
  const fetchNames = async () => {
    const response = await fetch('https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete');
    if (!response.ok) {
      throw new Error('Failed to fetch autocomplete data');
    }
    return response.json();
  };

  const [formula, setFormula] = useState('');
  const [final, setFinal] = useState([]);
  const [result, setResult] = useState(null)
  const [showDropdown, setShowDropdown] = useState(false); // State for dropdown visibility
  const [filteredNames, setFilteredNames] = useState([]);  
  const [error, setError] = useState('');
  const { data: names } = useQuery('autocomplete', fetchNames);

  const operators = [     // Arithmetic operators
    { name: '+', category: 'operator', value: '+' },
    { name: '-', category: 'operator', value: '-' },
    { name: '*', category: 'operator', value: '*' },
    { name: '/', category: 'operator', value: '/' },
    { name: '(', category: 'operator', value: '(' },
    { name: ')', category: 'operator', value: ')' },
    { name: '%', category: 'operator', value: '%' },
    { name: '^', category: 'operator', value: '^' },
  ]; 

  const handleInputChange = (value) => {
    setFormula(value);
    if (names && value.trim() !== '') 
    {
      const word = value.trim()
      const filteredData = names.filter((item) =>
        item.name.toLowerCase().includes(word.toLowerCase())
      );
      console.log("Filtered Data",filteredData)
      setFilteredNames(filteredData);
    } 
    else {
      setFilteredNames([]);
    }
  };

  const handleSelectName = (item) => {
    const modifiedItem = {
      ...item,
      category: 'operand', // Change the category to 'operand'
    };
    console.log("The Selected Operand:",modifiedItem);
    setFinal((prev) => [...prev, modifiedItem]);
    setFilteredNames([]);
    setFormula('');
  };
  
  const handleOperatorSelection = (item) =>{
    console.log("The Operator Item:", item)
    setFinal((prev) => [...prev, item]);
  }

  const handleRemoveItem = (index) => {
    setFinal((prev) => prev.filter((_, idx) => idx !== index));
    setShowDropdown(false)
  };

  const handleCalculate = () => {
    setShowDropdown(false);
    console.log("Final",final);
    // Build the arithmetic expression from final array
    const expression = final.map(item => item.value === '^' ? '**' : item.value).join('');
    console.log('Arithmetic Expression:', expression);
  
    try {
      if (final.some(item => item.category === 'operator')) {
        const cal = eval(expression);
        console.log(cal);
        setResult(cal.toString());
        setError('');
      } else {
        setError('Error: Invalid Expression');
      }
    } catch (error) {
      setError('Error: Invalid Expression');
    }
  };
  
  
  const handleReset = () => {
    setFinal([]);
    setFormula('');
    setResult(null);
    setShowDropdown(false);
    setError('')
  };

  return (
    <div className="App">
      <h1>Expression Calculator</h1>
      <div className='container'>
      <div className={error ? 'final-string error' : 'final-string'}>
        {final.map((operand, index) => (
          <div key={index} className="final-item">
            <p>{operand.name}</p>
            <button className="cancel-button" onClick={()=>handleRemoveItem(index)}>
              x
            </button>
          </div>
        ))}
        </div>
        
        {/* Error message display */}
        {error && <div className="error-message">{error}</div>}
        
        <div className='input-section'>
          {/* Operands */}
          <div className='operands'>
            {/* Contains the Operands */}
            <input
              type="text"
              placeholder="Select Category ......................."
              value={formula}
              onChange={(e) => handleInputChange(e.target.value)}
              className='operands-input'
            />
        
            {/* Dropdown for filtered names */}
            {filteredNames.length > 0 && (
              <div className="dropdown">
                {filteredNames.map((item, index) => (
                  <div className='dropdown-item' key={index} onClick={() => handleSelectName(item)}>
                    {item.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Reset & Calculate Button */}
          <div className='calculate-button'>
              <button className='reset' onClick={handleReset}> Reset </button>
              <button className='calculate' onClick={handleCalculate}> Calculate </button>
          </div>

          {/* Operators */}
          <div className='operators'>
            {/* Button to toggle dropdown visibility */}
            <button className='select-operand-button' onClick={() => setShowDropdown(!showDropdown)}>
              Select Operator
            </button>

            {/* Dropdown grid */}
            {showDropdown && (
              <div className='operators-grid'>
                {operators.map((operator) => (
                  <button key={operator.value} onClick={() => handleOperatorSelection(operator)} className='operator-button'>
                    {operator.name}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
          {!error && result !== null && <div className="result-message">Result: {result}</div>}

      </div>
            
    </div>
  );
  
}

export default App;
