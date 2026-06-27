import React, { useState } from 'react';

const UseStateExamples = () => {
  return (
    <div>
      <h1>useState Hook Examples</h1>
      <p>The useState hook allows you to add state to functional components. It returns an array with the current state value and a function to update it.</p>
      
      <BasicCounter />
      <ObjectState />
      <ArrayState />
      <MultipleStates />
      <FunctionalUpdates />
      <LazyInitialization />
      <FormExample />
      <ToggleExample />
    </div>
  );
};

// Basic counter example
const BasicCounter = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="example-container">
      <h2 className="example-title">1. Basic Counter</h2>
      <p className="example-description">
        Simple counter that increments and decrements a number.
      </p>
      
      <div className="demo-section">
        <h3>Count: {count}</h3>
        <button onClick={() => setCount(count + 1)}>Increment</button>
        <button onClick={() => setCount(count - 1)}>Decrement</button>
        <button onClick={() => setCount(0)} className="secondary">Reset</button>
      </div>

      <div className="code-section">
        <h4 className="code-title">Code:</h4>
        <pre><code>{`const BasicCounter = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h3>Count: {count}</h3>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
};`}</code></pre>
      </div>
    </div>
  );
};

// Object state example
const ObjectState = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: ''
  });

  const updateUser = (field, value) => {
    setUser(prevUser => ({
      ...prevUser,
      [field]: value
    }));
  };

  return (
    <div className="example-container">
      <h2 className="example-title">2. Object State</h2>
      <p className="example-description">
        Managing object state requires spreading the previous state to avoid overwriting other properties.
      </p>
      
      <div className="demo-section">
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={user.name}
            onChange={(e) => updateUser('name', e.target.value)}
            placeholder="Enter your name"
          />
        </div>
        
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={user.email}
            onChange={(e) => updateUser('email', e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        
        <div className="form-group">
          <label>Age:</label>
          <input
            type="number"
            value={user.age}
            onChange={(e) => updateUser('age', e.target.value)}
            placeholder="Enter your age"
          />
        </div>

        <div className="card">
          <h4>User Data:</h4>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">Code:</h4>
        <pre><code>{`const ObjectState = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: ''
  });

  const updateUser = (field, value) => {
    setUser(prevUser => ({
      ...prevUser,  // Spread previous state
      [field]: value
    }));
  };

  return (
    <div>
      <input
        value={user.name}
        onChange={(e) => updateUser('name', e.target.value)}
      />
      {/* More inputs... */}
    </div>
  );
};`}</code></pre>
      </div>
    </div>
  );
};

// Array state example
const ArrayState = () => {
  const [items, setItems] = useState(['Apple', 'Banana', 'Orange']);
  const [newItem, setNewItem] = useState('');

  const addItem = () => {
    if (newItem.trim()) {
      setItems(prevItems => [...prevItems, newItem.trim()]);
      setNewItem('');
    }
  };

  const removeItem = (index) => {
    setItems(prevItems => prevItems.filter((_, i) => i !== index));
  };

  const updateItem = (index, newValue) => {
    setItems(prevItems =>
      prevItems.map((item, i) => i === index ? newValue : item)
    );
  };

  return (
    <div className="example-container">
      <h2 className="example-title">3. Array State</h2>
      <p className="example-description">
        Managing arrays in state requires creating new arrays rather than mutating existing ones.
      </p>
      
      <div className="demo-section">
        <div className="flex">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Add new item"
            onKeyPress={(e) => e.key === 'Enter' && addItem()}
          />
          <button onClick={addItem}>Add Item</button>
        </div>

        <div style={{ marginTop: '1rem' }}>
          {items.map((item, index) => (
            <div key={index} className="card">
              <div className="flex">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateItem(index, e.target.value)}
                />
                <button 
                  onClick={() => removeItem(index)}
                  className="danger"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <p>Total items: {items.length}</p>
      </div>

      <div className="code-section">
        <h4 className="code-title">Code:</h4>
        <pre><code>{`const ArrayState = () => {
  const [items, setItems] = useState(['Apple', 'Banana', 'Orange']);

  const addItem = (newItem) => {
    setItems(prevItems => [...prevItems, newItem]);
  };

  const removeItem = (index) => {
    setItems(prevItems => prevItems.filter((_, i) => i !== index));
  };

  const updateItem = (index, newValue) => {
    setItems(prevItems =>
      prevItems.map((item, i) => i === index ? newValue : item)
    );
  };

  return (
    <div>
      {items.map((item, index) => (
        <div key={index}>
          <input
            value={item}
            onChange={(e) => updateItem(index, e.target.value)}
          />
          <button onClick={() => removeItem(index)}>Remove</button>
        </div>
      ))}
    </div>
  );
};`}</code></pre>
      </div>
    </div>
  );
};

// Multiple states example
const MultipleStates = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [color, setColor] = useState('blue');

  return (
    <div className="example-container">
      <h2 className="example-title">4. Multiple States</h2>
      <p className="example-description">
        You can use multiple useState hooks in a single component for different pieces of state.
      </p>
      
      <div className="demo-section">
        <div className="grid grid-2">
          <div>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label>Age:</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value) || 0)}
              />
            </div>
            
            <div className="form-group">
              <label>Color:</label>
              <select value={color} onChange={(e) => setColor(e.target.value)}>
                <option value="blue">Blue</option>
                <option value="red">Red</option>
                <option value="green">Green</option>
                <option value="purple">Purple</option>
              </select>
            </div>
            
            <button onClick={() => setIsVisible(!isVisible)}>
              {isVisible ? 'Hide' : 'Show'} Display
            </button>
          </div>

          {isVisible && (
            <div className="card" style={{ color: color }}>
              <h4>Display:</h4>
              <p><strong>Name:</strong> {name || 'No name'}</p>
              <p><strong>Age:</strong> {age}</p>
              <p><strong>Color:</strong> {color}</p>
              <p><strong>Visible:</strong> {isVisible ? 'Yes' : 'No'}</p>
            </div>
          )}
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">Code:</h4>
        <pre><code>{`const MultipleStates = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [color, setColor] = useState('blue');

  return (
    <div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="number"
        value={age}
        onChange={(e) => setAge(parseInt(e.target.value))}
      />
      <select value={color} onChange={(e) => setColor(e.target.value)}>
        <option value="blue">Blue</option>
        <option value="red">Red</option>
      </select>
      <button onClick={() => setIsVisible(!isVisible)}>
        Toggle Visibility
      </button>
    </div>
  );
};`}</code></pre>
      </div>
    </div>
  );
};

// Functional updates example
const FunctionalUpdates = () => {
  const [count, setCount] = useState(0);

  const incrementTwice = () => {
    // Wrong way - will only increment by 1
    // setCount(count + 1);
    // setCount(count + 1);
    
    // Correct way - using functional updates
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
  };

  const incrementAsync = () => {
    setTimeout(() => {
      setCount(prev => prev + 1); // Always use functional update in async operations
    }, 1000);
  };

  return (
    <div className="example-container">
      <h2 className="example-title">5. Functional Updates</h2>
      <p className="example-description">
        When the new state depends on the previous state, use functional updates to avoid stale closure issues.
      </p>
      
      <div className="demo-section">
        <h3>Count: {count}</h3>
        <button onClick={() => setCount(count + 1)}>
          Normal Increment
        </button>
        <button onClick={incrementTwice}>
          Increment Twice (Functional)
        </button>
        <button onClick={incrementAsync}>
          Async Increment (1s delay)
        </button>
        <button onClick={() => setCount(0)} className="secondary">
          Reset
        </button>
      </div>

      <div className="code-section">
        <h4 className="code-title">Code:</h4>
        <pre><code>{`const FunctionalUpdates = () => {
  const [count, setCount] = useState(0);

  const incrementTwice = () => {
    // Wrong way - will only increment by 1
    // setCount(count + 1);
    // setCount(count + 1);
    
    // Correct way - using functional updates
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
  };

  const incrementAsync = () => {
    setTimeout(() => {
      setCount(prev => prev + 1); // Always use functional update in async
    }, 1000);
  };

  return (
    <div>
      <h3>Count: {count}</h3>
      <button onClick={incrementTwice}>Increment Twice</button>
      <button onClick={incrementAsync}>Async Increment</button>
    </div>
  );
};`}</code></pre>
      </div>
    </div>
  );
};

// Lazy initialization example
const LazyInitialization = () => {
  // Expensive computation only runs once
  const [data, setData] = useState(() => {
    console.log('Expensive initialization running...');
    return Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      value: Math.random() * 100
    }));
  });

  const [count, setCount] = useState(() => {
    console.log('Getting initial count from localStorage');
    return parseInt(localStorage.getItem('count') || '0');
  });

  const updateCount = (newCount) => {
    setCount(newCount);
    localStorage.setItem('count', newCount.toString());
  };

  return (
    <div className="example-container">
      <h2 className="example-title">6. Lazy Initialization</h2>
      <p className="example-description">
        Pass a function to useState for expensive initial state calculations that should only run once.
      </p>
      
      <div className="demo-section">
        <div className="alert info">
          <strong>Note:</strong> Check the console to see when initialization functions run.
        </div>
        
        <p>Generated {data.length} data items (check console for initialization message)</p>
        <p>Persistent count from localStorage: {count}</p>
        
        <button onClick={() => updateCount(count + 1)}>
          Increment Persistent Count
        </button>
        <button onClick={() => updateCount(0)} className="secondary">
          Reset Count
        </button>
      </div>

      <div className="code-section">
        <h4 className="code-title">Code:</h4>
        <pre><code>{`const LazyInitialization = () => {
  // Expensive computation only runs once
  const [data, setData] = useState(() => {
    console.log('Expensive initialization running...');
    return Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      value: Math.random() * 100
    }));
  });

  // Reading from localStorage only once
  const [count, setCount] = useState(() => {
    return parseInt(localStorage.getItem('count') || '0');
  });

  return (
    <div>
      <p>Generated {data.length} items</p>
      <p>Count: {count}</p>
    </div>
  );
};`}</code></pre>
      </div>
    </div>
  );
};

// Form example
const FormExample = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
    subscribe: false,
    country: 'US'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      message: '',
      subscribe: false,
      country: 'US'
    });
    setErrors({});
    setIsSubmitted(false);
  };

  return (
    <div className="example-container">
      <h2 className="example-title">7. Form Handling</h2>
      <p className="example-description">
        Complex form with validation, different input types, and error handling.
      </p>
      
      <div className="demo-section">
        {isSubmitted && (
          <div className="alert success">
            Form submitted successfully! Data: {JSON.stringify(formData, null, 2)}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-2">
            <div className="form-group">
              <label>First Name:</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
              {errors.firstName && <div className="error">{errors.firstName}</div>}
            </div>

            <div className="form-group">
              <label>Last Name:</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
              {errors.lastName && <div className="error">{errors.lastName}</div>}
            </div>
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <div className="error">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label>Country:</label>
            <select name="country" value={formData.country} onChange={handleChange}>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="UK">United Kingdom</option>
              <option value="AU">Australia</option>
            </select>
          </div>

          <div className="form-group">
            <label>Message:</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
            />
            {errors.message && <div className="error">{errors.message}</div>}
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="subscribe"
                checked={formData.subscribe}
                onChange={handleChange}
              />
              Subscribe to newsletter
            </label>
          </div>

          <div className="flex">
            <button type="submit">Submit</button>
            <button type="button" onClick={resetForm} className="secondary">Reset</button>
          </div>
        </form>
      </div>

      <div className="code-section">
        <h4 className="code-title">Code (simplified):</h4>
        <pre><code>{`const FormExample = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subscribe: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <form>
      <input
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
      />
      <input
        type="checkbox"
        name="subscribe"
        checked={formData.subscribe}
        onChange={handleChange}
      />
    </form>
  );
};`}</code></pre>
      </div>
    </div>
  );
};

// Toggle example
const ToggleExample = () => {
  const [isOn, setIsOn] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggle = (setter) => setter(prev => !prev);

  return (
    <div className="example-container">
      <h2 className="example-title">8. Toggle Pattern</h2>
      <p className="example-description">
        Common pattern for boolean state toggles with functional updates.
      </p>
      
      <div className="demo-section" style={{ 
        backgroundColor: isDarkMode ? '#2d3748' : 'white',
        color: isDarkMode ? 'white' : 'black',
        transition: 'all 0.3s'
      }}>
        <div className="flex flex-column">
          <div className="flex">
            <button onClick={() => toggle(setIsOn)}>
              {isOn ? '🔛 ON' : '⬜ OFF'}
            </button>
            <span>Switch is {isOn ? 'ON' : 'OFF'}</span>
          </div>

          <div className="flex">
            <button onClick={() => toggle(setIsDarkMode)}>
              {isDarkMode ? '🌙 Dark' : '☀️ Light'}
            </button>
            <span>Theme: {isDarkMode ? 'Dark' : 'Light'}</span>
          </div>

          <div className="flex">
            <button onClick={() => toggle(setIsExpanded)}>
              {isExpanded ? '🔼 Collapse' : '🔽 Expand'}
            </button>
            <span>Panel is {isExpanded ? 'expanded' : 'collapsed'}</span>
          </div>

          {isExpanded && (
            <div className="card" style={{ 
              backgroundColor: isDarkMode ? '#4a5568' : '#f7fafc',
              marginTop: '1rem'
            }}>
              <p>This content is only visible when expanded!</p>
              <p>The dark mode toggle also affects this panel.</p>
            </div>
          )}
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">Code:</h4>
        <pre><code>{`const ToggleExample = () => {
  const [isOn, setIsOn] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggle = (setter) => setter(prev => !prev);

  return (
    <div>
      <button onClick={() => toggle(setIsOn)}>
        {isOn ? 'ON' : 'OFF'}
      </button>
      
      <button onClick={() => toggle(setIsDarkMode)}>
        {isDarkMode ? 'Dark' : 'Light'}
      </button>
      
      {/* Or directly: */}
      <button onClick={() => setIsOn(prev => !prev)}>
        Toggle
      </button>
    </div>
  );
};`}</code></pre>
      </div>
    </div>
  );
};

export default UseStateExamples;
