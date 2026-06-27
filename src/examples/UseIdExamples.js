import React, { useId, useState } from 'react';

const UseIdExamples = () => {
  return (
    <div>
      <h1>useId Hook Examples (React 18)</h1>
      <p>The useId hook generates unique IDs that are stable across server and client renders. It's particularly useful for accessibility attributes and form elements.</p>
      
      <BasicExample />
      <FormExample />
      <AccessibilityExample />
      <MultipleIdsExample />
      <ListExample />
    </div>
  );
};

// Basic useId example
const BasicExample = () => {
  const id = useId();
  const [name, setName] = useState('');

  return (
    <div className="example-container">
      <h2 className="example-title">1. Basic useId Usage</h2>
      <p className="example-description">
        Generate a unique ID that's stable across server and client renders.
      </p>
      
      <div className="demo-section">
        <div className="card">
          <h4>Generated ID: {id}</h4>
          <p>This ID is unique and stable across renders.</p>
          
          <div className="form-group">
            <label htmlFor={id}>Name:</label>
            <input
              id={id}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>
          
          <p><small>The input is properly associated with its label using the generated ID.</small></p>
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">Code:</h4>
        <pre><code>{`const BasicExample = () => {
  const id = useId();
  const [name, setName] = useState('');

  return (
    <div>
      <h4>Generated ID: {id}</h4>
      <label htmlFor={id}>Name:</label>
      <input
        id={id}
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
  );
};`}</code></pre>
      </div>
    </div>
  );
};

// Form example with multiple fields
const FormExample = () => {
  const baseId = useId();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="example-container">
      <h2 className="example-title">2. Form with Multiple Fields</h2>
      <p className="example-description">
        Use useId as a base to create unique IDs for multiple form elements.
      </p>
      
      <div className="demo-section">
        <form>
          <div className="grid grid-2">
            <div className="form-group">
              <label htmlFor={`${baseId}-firstName`}>First Name:</label>
              <input
                id={`${baseId}-firstName`}
                type="text"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor={`${baseId}-lastName`}>Last Name:</label>
              <input
                id={`${baseId}-lastName`}
                type="text"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor={`${baseId}-email`}>Email:</label>
            <input
              id={`${baseId}-email`}
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-2">
            <div className="form-group">
              <label htmlFor={`${baseId}-password`}>Password:</label>
              <input
                id={`${baseId}-password`}
                type="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor={`${baseId}-confirmPassword`}>Confirm Password:</label>
              <input
                id={`${baseId}-confirmPassword`}
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                required
              />
            </div>
          </div>
        </form>
        
        <div className="card">
          <h4>Generated IDs:</h4>
          <p><strong>Base ID:</strong> {baseId}</p>
          <p><strong>First Name ID:</strong> {baseId}-firstName</p>
          <p><strong>Last Name ID:</strong> {baseId}-lastName</p>
          <p><strong>Email ID:</strong> {baseId}-email</p>
          <p><strong>Password ID:</strong> {baseId}-password</p>
          <p><strong>Confirm Password ID:</strong> {baseId}-confirmPassword</p>
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">Code:</h4>
        <pre><code>{`const FormExample = () => {
  const baseId = useId();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  return (
    <form>
      <div>
        <label htmlFor={\`\${baseId}-firstName\`}>First Name:</label>
        <input
          id={\`\${baseId}-firstName\`}
          type="text"
          value={formData.firstName}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            firstName: e.target.value 
          }))}
        />
      </div>
      
      <div>
        <label htmlFor={\`\${baseId}-email\`}>Email:</label>
        <input
          id={\`\${baseId}-email\`}
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            email: e.target.value 
          }))}
        />
      </div>
    </form>
  );
};`}</code></pre>
      </div>
    </div>
  );
};

// Accessibility example
const AccessibilityExample = () => {
  const titleId = useId();
  const descriptionId = useId();
  const errorId = useId();
  
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const validateInput = (inputValue) => {
    if (inputValue.length < 3) {
      setError('Input must be at least 3 characters long');
    } else if (inputValue.length > 20) {
      setError('Input must be less than 20 characters long');
    } else {
      setError('');
    }
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    validateInput(newValue);
  };

  return (
    <div className="example-container">
      <h2 className="example-title">3. Accessibility with ARIA</h2>
      <p className="example-description">
        Use useId to create proper accessibility relationships with ARIA attributes.
      </p>
      
      <div className="demo-section">
        <div className="form-group">
          <label 
            htmlFor={titleId}
            id={`${titleId}-label`}
          >
            Username:
          </label>
          <input
            id={titleId}
            type="text"
            value={value}
            onChange={handleChange}
            aria-describedby={`${descriptionId} ${error ? errorId : ''}`}
            aria-labelledby={`${titleId}-label`}
            aria-invalid={error ? 'true' : 'false'}
            placeholder="Enter username"
          />
          
          <div id={descriptionId} className="form-help">
            Enter a username between 3 and 20 characters.
          </div>
          
          {error && (
            <div id={errorId} className="error" role="alert">
              {error}
            </div>
          )}
        </div>
        
        <div className="card">
          <h4>ARIA Relationships:</h4>
          <p><strong>Input ID:</strong> {titleId}</p>
          <p><strong>Label ID:</strong> {titleId}-label</p>
          <p><strong>Description ID:</strong> {descriptionId}</p>
          <p><strong>Error ID:</strong> {errorId}</p>
          <p><strong>Current Value:</strong> "{value}"</p>
          <p><strong>Has Error:</strong> {error ? 'Yes' : 'No'}</p>
        </div>
        
        <div className="alert info">
          This input has proper accessibility attributes that screen readers can understand.
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">Code:</h4>
        <pre><code>{`const AccessibilityExample = () => {
  const titleId = useId();
  const descriptionId = useId();
  const errorId = useId();
  
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  return (
    <div>
      <label htmlFor={titleId} id={\`\${titleId}-label\`}>
        Username:
      </label>
      <input
        id={titleId}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-describedby={\`\${descriptionId} \${error ? errorId : ''}\`}
        aria-labelledby={\`\${titleId}-label\`}
        aria-invalid={error ? 'true' : 'false'}
      />
      
      <div id={descriptionId}>
        Enter a username between 3 and 20 characters.
      </div>
      
      {error && (
        <div id={errorId} role="alert">
          {error}
        </div>
      )}
    </div>
  );
};`}</code></pre>
      </div>
    </div>
  );
};

// Multiple IDs in one component
const MultipleIdsExample = () => {
  const radioGroupId = useId();
  const checkboxGroupId = useId();
  const selectId = useId();
  
  const [selectedRadio, setSelectedRadio] = useState('option1');
  const [checkboxes, setCheckboxes] = useState({
    feature1: false,
    feature2: true,
    feature3: false
  });
  const [selectValue, setSelectValue] = useState('');

  const handleCheckboxChange = (key) => {
    setCheckboxes(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const radioOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
  ];

  const checkboxOptions = [
    { key: 'feature1', label: 'Feature 1' },
    { key: 'feature2', label: 'Feature 2' },
    { key: 'feature3', label: 'Feature 3' }
  ];

  return (
    <div className="example-container">
      <h2 className="example-title">4. Multiple ID Groups</h2>
      <p className="example-description">
        Use multiple useId calls to create different groups of related elements.
      </p>
      
      <div className="demo-section">
        <div className="grid grid-3">
          <div className="card">
            <fieldset>
              <legend>Radio Group</legend>
              <div role="radiogroup" aria-labelledby={`${radioGroupId}-legend`}>
                <div id={`${radioGroupId}-legend`} style={{ display: 'none' }}>
                  Choose one option
                </div>
                {radioOptions.map((option) => (
                  <label key={option.value} className="form-group">
                    <input
                      type="radio"
                      name={radioGroupId}
                      value={option.value}
                      checked={selectedRadio === option.value}
                      onChange={(e) => setSelectedRadio(e.target.value)}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
          
          <div className="card">
            <fieldset>
              <legend>Checkbox Group</legend>
              <div role="group" aria-labelledby={`${checkboxGroupId}-legend`}>
                <div id={`${checkboxGroupId}-legend`} style={{ display: 'none' }}>
                  Select features
                </div>
                {checkboxOptions.map((option) => (
                  <label key={option.key} className="form-group">
                    <input
                      type="checkbox"
                      id={`${checkboxGroupId}-${option.key}`}
                      checked={checkboxes[option.key]}
                      onChange={() => handleCheckboxChange(option.key)}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
          
          <div className="card">
            <div className="form-group">
              <label htmlFor={selectId}>Select Option:</label>
              <select
                id={selectId}
                value={selectValue}
                onChange={(e) => setSelectValue(e.target.value)}
              >
                <option value="">Choose...</option>
                <option value="value1">Value 1</option>
                <option value="value2">Value 2</option>
                <option value="value3">Value 3</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="card">
          <h4>Current Selections:</h4>
          <p><strong>Radio:</strong> {selectedRadio}</p>
          <p><strong>Checkboxes:</strong> {Object.entries(checkboxes)
            .filter(([_, checked]) => checked)
            .map(([key, _]) => key)
            .join(', ') || 'None'}</p>
          <p><strong>Select:</strong> {selectValue || 'None'}</p>
        </div>
        
        <div className="card">
          <h4>Generated IDs:</h4>
          <p><strong>Radio Group:</strong> {radioGroupId}</p>
          <p><strong>Checkbox Group:</strong> {checkboxGroupId}</p>
          <p><strong>Select:</strong> {selectId}</p>
        </div>
      </div>
    </div>
  );
};

// List example with unique IDs
const ListExample = () => {
  const listId = useId();
  const [items, setItems] = useState([
    { id: 1, title: 'Task 1', completed: false },
    { id: 2, title: 'Task 2', completed: true },
    { id: 3, title: 'Task 3', completed: false }
  ]);
  const [newItemTitle, setNewItemTitle] = useState('');

  const addItem = () => {
    if (newItemTitle.trim()) {
      const newItem = {
        id: Date.now(),
        title: newItemTitle.trim(),
        completed: false
      };
      setItems(prev => [...prev, newItem]);
      setNewItemTitle('');
    }
  };

  const toggleItem = (id) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const deleteItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="example-container">
      <h2 className="example-title">5. Dynamic List with Unique IDs</h2>
      <p className="example-description">
        Create unique IDs for dynamic list items while maintaining proper accessibility.
      </p>
      
      <div className="demo-section">
        <div className="form-group">
          <label htmlFor={`${listId}-input`}>Add New Task:</label>
          <div className="flex">
            <input
              id={`${listId}-input`}
              type="text"
              value={newItemTitle}
              onChange={(e) => setNewItemTitle(e.target.value)}
              placeholder="Enter task title"
              onKeyPress={(e) => e.key === 'Enter' && addItem()}
            />
            <button onClick={addItem} disabled={!newItemTitle.trim()}>
              Add Task
            </button>
          </div>
        </div>
        
        <div role="list" aria-labelledby={`${listId}-heading`}>
          <h4 id={`${listId}-heading`}>Task List ({items.length} items)</h4>
          
          {items.map((item) => {
            const itemId = `${listId}-item-${item.id}`;
            const checkboxId = `${listId}-checkbox-${item.id}`;
            
            return (
              <div 
                key={item.id} 
                role="listitem" 
                className="card"
                id={itemId}
              >
                <div className="flex">
                  <label htmlFor={checkboxId} style={{ flex: 1, cursor: 'pointer' }}>
                    <input
                      id={checkboxId}
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => toggleItem(item.id)}
                      aria-describedby={`${itemId}-title`}
                    />
                    <span 
                      id={`${itemId}-title`}
                      style={{ 
                        textDecoration: item.completed ? 'line-through' : 'none',
                        marginLeft: '0.5rem'
                      }}
                    >
                      {item.title}
                    </span>
                  </label>
                  
                  <button 
                    onClick={() => deleteItem(item.id)}
                    aria-label={`Delete task: ${item.title}`}
                    className="danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
          
          {items.length === 0 && (
            <p className="alert info">No tasks yet. Add one above!</p>
          )}
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">Code:</h4>
        <pre><code>{`const ListExample = () => {
  const listId = useId();
  const [items, setItems] = useState([
    { id: 1, title: 'Task 1', completed: false },
    { id: 2, title: 'Task 2', completed: true }
  ]);

  return (
    <div role="list" aria-labelledby={\`\${listId}-heading\`}>
      <h4 id={\`\${listId}-heading\`}>Task List</h4>
      
      {items.map((item) => {
        const itemId = \`\${listId}-item-\${item.id}\`;
        const checkboxId = \`\${listId}-checkbox-\${item.id}\`;
        
        return (
          <div key={item.id} role="listitem" id={itemId}>
            <label htmlFor={checkboxId}>
              <input
                id={checkboxId}
                type="checkbox"
                checked={item.completed}
                onChange={() => toggleItem(item.id)}
                aria-describedby={\`\${itemId}-title\`}
              />
              <span id={\`\${itemId}-title\`}>
                {item.title}
              </span>
            </label>
          </div>
        );
      })}
    </div>
  );
};`}</code></pre>
      </div>
    </div>
  );
};

export default UseIdExamples;
