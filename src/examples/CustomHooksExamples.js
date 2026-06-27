import React, { useState, useEffect, useRef, useCallback } from 'react';

const CustomHooksExamples = () => {
  return (
    <div>
      <h1>Custom Hooks Examples</h1>
      <p>Custom hooks let you extract component logic into reusable functions. They're just JavaScript functions that call other hooks.</p>
      
      <UseLocalStorageExample />
      <UseFetchExample />
      <UseDebounceExample />
      <UseToggleExample />
      <UseCounterExample />
      <UseIntervalExample />
      <UseOnClickOutsideExample />
      <UseFormExample />
    </div>
  );
};

// Custom hook: useLocalStorage
const useLocalStorage = (key, initialValue) => {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
};

const UseLocalStorageExample = () => {
  const [name, setName] = useLocalStorage('name', '');
  const [age, setAge] = useLocalStorage('age', 0);
  const [preferences, setPreferences] = useLocalStorage('preferences', {
    theme: 'light',
    notifications: true
  });

  return (
    <div className="example-container">
      <h2 className="example-title">1. useLocalStorage Hook</h2>
      <p className="example-description">
        Persist state in localStorage with the same API as useState. Refresh the page to see persistence!
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
                placeholder="Enter your name"
              />
            </div>
            
            <div className="form-group">
              <label>Age:</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                placeholder="Enter your age"
              />
            </div>
            
            <div className="form-group">
              <label>Theme:</label>
              <select
                value={preferences.theme}
                onChange={(e) => setPreferences(prev => ({ ...prev, theme: e.target.value }))}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={preferences.notifications}
                  onChange={(e) => setPreferences(prev => ({ ...prev, notifications: e.target.checked }))}
                />
                Enable notifications
              </label>
            </div>
          </div>
          
          <div className="card">
            <h4>Stored Values:</h4>
            <p><strong>Name:</strong> {name || 'Not set'}</p>
            <p><strong>Age:</strong> {age}</p>
            <p><strong>Theme:</strong> {preferences.theme}</p>
            <p><strong>Notifications:</strong> {preferences.notifications ? 'Enabled' : 'Disabled'}</p>
            <div className="alert info">
              These values persist across page refreshes!
            </div>
          </div>
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">Custom Hook Code:</h4>
        <pre><code>{`const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(\`Error reading localStorage key "\${key}":\`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(\`Error setting localStorage key "\${key}":\`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
};

// Usage
const [name, setName] = useLocalStorage('name', '');`}</code></pre>
      </div>
    </div>
  );
};

// Custom hook: useFetch
const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(url, options);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [url, JSON.stringify(options)]);

  return { data, loading, error };
};

const UseFetchExample = () => {
  const [userId, setUserId] = useState(1);
  const { data: user, loading, error } = useFetch(`https://jsonplaceholder.typicode.com/users/${userId}`);

  return (
    <div className="example-container">
      <h2 className="example-title">2. useFetch Hook</h2>
      <p className="example-description">
        Reusable hook for data fetching with loading states and error handling.
      </p>
      
      <div className="demo-section">
        <div className="form-group">
          <label>User ID:</label>
          <select value={userId} onChange={(e) => setUserId(parseInt(e.target.value))}>
            {[1, 2, 3, 4, 5].map(id => (
              <option key={id} value={id}>User {id}</option>
            ))}
          </select>
        </div>

        {loading && <div className="loading">Loading user data...</div>}
        
        {error && (
          <div className="alert danger">
            Error: {error}
          </div>
        )}

        {user && (
          <div className="card">
            <h4>{user.name}</h4>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Website:</strong> {user.website}</p>
            <p><strong>Company:</strong> {user.company?.name}</p>
          </div>
        )}
      </div>

      <div className="code-section">
        <h4 className="code-title">Custom Hook Code:</h4>
        <pre><code>{`const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        
        const result = await response.json();
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => { cancelled = true; };
  }, [url, JSON.stringify(options)]);

  return { data, loading, error };
};

// Usage
const { data, loading, error } = useFetch('/api/users/1');`}</code></pre>
      </div>
    </div>
  );
};

// Custom hook: useDebounce
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const UseDebounceExample = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setSearching(true);
      
      // Simulate API search
      setTimeout(() => {
        const mockResults = [
          `Result 1 for "${debouncedSearchTerm}"`,
          `Result 2 for "${debouncedSearchTerm}"`,
          `Result 3 for "${debouncedSearchTerm}"`
        ];
        setResults(mockResults);
        setSearching(false);
      }, 300);
    } else {
      setResults([]);
      setSearching(false);
    }
  }, [debouncedSearchTerm]);

  return (
    <div className="example-container">
      <h2 className="example-title">3. useDebounce Hook</h2>
      <p className="example-description">
        Delay expensive operations like API calls until the user stops typing.
      </p>
      
      <div className="demo-section">
        <div className="form-group">
          <label>Search:</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Type to search... (500ms delay)"
          />
        </div>

        <div className="grid grid-2">
          <div>
            <h4>Immediate Value:</h4>
            <p>"{searchTerm}"</p>
            <small>Updates immediately as you type</small>
          </div>
          
          <div>
            <h4>Debounced Value:</h4>
            <p>"{debouncedSearchTerm}"</p>
            <small>Updates 500ms after you stop typing</small>
          </div>
        </div>

        {searching && <div className="loading">Searching...</div>}

        {results.length > 0 && (
          <div>
            <h4>Search Results:</h4>
            {results.map((result, index) => (
              <div key={index} className="card">
                {result}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="code-section">
        <h4 className="code-title">Custom Hook Code:</h4>
        <pre><code>{`const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Usage
const [searchTerm, setSearchTerm] = useState('');
const debouncedSearchTerm = useDebounce(searchTerm, 500);

useEffect(() => {
  if (debouncedSearchTerm) {
    // Perform search
    searchAPI(debouncedSearchTerm);
  }
}, [debouncedSearchTerm]);`}</code></pre>
      </div>
    </div>
  );
};

// Custom hook: useToggle
const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);
  
  const toggle = useCallback(() => setValue(prev => !prev), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  
  return [value, { toggle, setTrue, setFalse }];
};

const UseToggleExample = () => {
  const [isVisible, { toggle: toggleVisible, setTrue: show, setFalse: hide }] = useToggle(false);
  const [isDarkMode, { toggle: toggleDarkMode }] = useToggle(false);
  const [isExpanded, { toggle: toggleExpanded }] = useToggle(true);

  return (
    <div className="example-container">
      <h2 className="example-title">4. useToggle Hook</h2>
      <p className="example-description">
        Simplify boolean state management with toggle, setTrue, and setFalse functions.
      </p>
      
      <div className="demo-section" style={{
        backgroundColor: isDarkMode ? '#2d3748' : 'white',
        color: isDarkMode ? 'white' : 'black',
        transition: 'all 0.3s'
      }}>
        <div className="flex flex-column">
          <div className="flex">
            <button onClick={toggleVisible}>
              {isVisible ? 'Hide' : 'Show'} Content
            </button>
            <button onClick={show}>Show</button>
            <button onClick={hide}>Hide</button>
          </div>

          <div className="flex">
            <button onClick={toggleDarkMode}>
              Toggle {isDarkMode ? 'Light' : 'Dark'} Mode
            </button>
          </div>

          <div className="flex">
            <button onClick={toggleExpanded}>
              {isExpanded ? 'Collapse' : 'Expand'} Panel
            </button>
          </div>

          {isVisible && (
            <div className="card" style={{
              backgroundColor: isDarkMode ? '#4a5568' : '#f7fafc',
              marginTop: '1rem'
            }}>
              <p>This content is conditionally visible!</p>
              <p>Dark mode is {isDarkMode ? 'ON' : 'OFF'}</p>
            </div>
          )}

          {isExpanded && (
            <div className="card" style={{
              backgroundColor: isDarkMode ? '#4a5568' : '#e2e8f0',
              marginTop: '1rem'
            }}>
              <h4>Expanded Panel</h4>
              <p>This panel can be expanded or collapsed.</p>
            </div>
          )}
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">Custom Hook Code:</h4>
        <pre><code>{`const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);
  
  const toggle = useCallback(() => setValue(prev => !prev), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  
  return [value, { toggle, setTrue, setFalse }];
};

// Usage
const [isVisible, { toggle, setTrue: show, setFalse: hide }] = useToggle(false);

<button onClick={toggle}>Toggle</button>
<button onClick={show}>Show</button>
<button onClick={hide}>Hide</button>`}</code></pre>
      </div>
    </div>
  );
};

// Custom hook: useCounter
const useCounter = (initialValue = 0, step = 1) => {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => setCount(prev => prev + step), [step]);
  const decrement = useCallback(() => setCount(prev => prev - step), [step]);
  const reset = useCallback(() => setCount(initialValue), [initialValue]);
  const setValue = useCallback((value) => setCount(value), []);

  return {
    count,
    increment,
    decrement,
    reset,
    setValue
  };
};

const UseCounterExample = () => {
  const counter1 = useCounter(0, 1);
  const counter2 = useCounter(100, 5);
  const counter3 = useCounter(0, 10);

  return (
    <div className="example-container">
      <h2 className="example-title">5. useCounter Hook</h2>
      <p className="example-description">
        Reusable counter logic with customizable initial value and step size.
      </p>
      
      <div className="demo-section">
        <div className="grid grid-3">
          <div className="card">
            <h4>Counter 1 (step: 1)</h4>
            <h3>{counter1.count}</h3>
            <div className="flex flex-column">
              <button onClick={counter1.increment}>+1</button>
              <button onClick={counter1.decrement}>-1</button>
              <button onClick={counter1.reset} className="secondary">Reset</button>
            </div>
          </div>

          <div className="card">
            <h4>Counter 2 (step: 5, start: 100)</h4>
            <h3>{counter2.count}</h3>
            <div className="flex flex-column">
              <button onClick={counter2.increment}>+5</button>
              <button onClick={counter2.decrement}>-5</button>
              <button onClick={counter2.reset} className="secondary">Reset to 100</button>
            </div>
          </div>

          <div className="card">
            <h4>Counter 3 (step: 10)</h4>
            <h3>{counter3.count}</h3>
            <div className="flex flex-column">
              <button onClick={counter3.increment}>+10</button>
              <button onClick={counter3.decrement}>-10</button>
              <button onClick={() => counter3.setValue(50)}>Set to 50</button>
              <button onClick={counter3.reset} className="secondary">Reset</button>
            </div>
          </div>
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">Custom Hook Code:</h4>
        <pre><code>{`const useCounter = (initialValue = 0, step = 1) => {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => setCount(prev => prev + step), [step]);
  const decrement = useCallback(() => setCount(prev => prev - step), [step]);
  const reset = useCallback(() => setCount(initialValue), [initialValue]);
  const setValue = useCallback((value) => setCount(value), []);

  return {
    count,
    increment,
    decrement,
    reset,
    setValue
  };
};

// Usage
const { count, increment, decrement, reset } = useCounter(0, 5);`}</code></pre>
      </div>
    </div>
  );
};

// Custom hook: useInterval
const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

const UseIntervalExample = () => {
  const [count, setCount] = useState(0);
  const [delay, setDelay] = useState(1000);
  const [isRunning, setIsRunning] = useState(false);

  useInterval(() => {
    setCount(count + 1);
  }, isRunning ? delay : null);

  return (
    <div className="example-container">
      <h2 className="example-title">6. useInterval Hook</h2>
      <p className="example-description">
        Declarative interval hook that handles cleanup and dynamic delays.
      </p>
      
      <div className="demo-section">
        <div className="card">
          <h3>Count: {count}</h3>
          
          <div className="form-group">
            <label>Delay (ms):</label>
            <input
              type="number"
              value={delay}
              onChange={(e) => setDelay(parseInt(e.target.value) || 1000)}
              min="100"
              step="100"
            />
          </div>
          
          <div className="flex">
            <button onClick={() => setIsRunning(!isRunning)}>
              {isRunning ? 'Stop' : 'Start'} Timer
            </button>
            <button onClick={() => setCount(0)} className="secondary">
              Reset Count
            </button>
          </div>
          
          <p className="alert info">
            Timer is {isRunning ? 'running' : 'stopped'} with {delay}ms delay
          </p>
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">Custom Hook Code:</h4>
        <pre><code>{`const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

// Usage
const [count, setCount] = useState(0);
const [delay, setDelay] = useState(1000);

useInterval(() => {
  setCount(count + 1);
}, delay); // Pass null to pause`}</code></pre>
      </div>
    </div>
  );
};

// Custom hook: useOnClickOutside
const useOnClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};

const UseOnClickOutsideExample = () => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();

  useOnClickOutside(ref, () => setIsOpen(false));

  return (
    <div className="example-container">
      <h2 className="example-title">7. useOnClickOutside Hook</h2>
      <p className="example-description">
        Detect clicks outside of a component, useful for dropdowns and modals.
      </p>
      
      <div className="demo-section">
        <div className="flex flex-column">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? 'Close' : 'Open'} Dropdown
          </button>
          
          {isOpen && (
            <div
              ref={ref}
              style={{
                position: 'absolute',
                backgroundColor: 'white',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '1rem',
                marginTop: '2rem',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                zIndex: 1000
              }}
            >
              <h4>Dropdown Content</h4>
              <p>Click outside this dropdown to close it!</p>
              <button onClick={() => setIsOpen(false)}>Close</button>
            </div>
          )}
          
          <div className="alert info" style={{ marginTop: isOpen ? '8rem' : '1rem' }}>
            Click outside the dropdown when it's open to see the hook in action.
          </div>
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">Custom Hook Code:</h4>
        <pre><code>{`const useOnClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      // Do nothing if clicking ref's element or descendants
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};

// Usage
const ref = useRef();
useOnClickOutside(ref, () => setIsOpen(false));

<div ref={ref}>
  Content that can be clicked outside of
</div>`}</code></pre>
      </div>
    </div>
  );
};

// Custom hook: useForm
const useForm = (initialValues, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const handleBlur = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    if (validate) {
      const fieldErrors = validate({ ...values, [name]: values[name] });
      setErrors(prev => ({ ...prev, [name]: fieldErrors[name] || '' }));
    }
  }, [values, validate]);

  const handleSubmit = useCallback((onSubmit) => {
    return (e) => {
      e.preventDefault();
      
      const formErrors = validate ? validate(values) : {};
      setErrors(formErrors);
      setTouched(Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
      
      if (Object.keys(formErrors).length === 0) {
        onSubmit(values);
      }
    };
  }, [values, validate]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    reset
  };
};

const UseFormExample = () => {
  const validate = (values) => {
    const errors = {};
    
    if (!values.name) errors.name = 'Name is required';
    if (!values.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(values.email)) errors.email = 'Email is invalid';
    if (!values.message) errors.message = 'Message is required';
    
    return errors;
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    reset
  } = useForm({
    name: '',
    email: '',
    message: ''
  }, validate);

  const onSubmit = (formValues) => {
    alert(`Form submitted!\n${JSON.stringify(formValues, null, 2)}`);
  };

  return (
    <div className="example-container">
      <h2 className="example-title">8. useForm Hook</h2>
      <p className="example-description">
        Complete form handling with validation, error states, and touch tracking.
      </p>
      
      <div className="demo-section">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={values.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
            />
            {touched.name && errors.name && (
              <div className="error">{errors.name}</div>
            )}
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={values.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
            />
            {touched.email && errors.email && (
              <div className="error">{errors.email}</div>
            )}
          </div>

          <div className="form-group">
            <label>Message:</label>
            <textarea
              value={values.message}
              onChange={(e) => handleChange('message', e.target.value)}
              onBlur={() => handleBlur('message')}
              rows="4"
            />
            {touched.message && errors.message && (
              <div className="error">{errors.message}</div>
            )}
          </div>

          <div className="flex">
            <button type="submit">Submit</button>
            <button type="button" onClick={reset} className="secondary">
              Reset
            </button>
          </div>
        </form>

        <div className="card" style={{ marginTop: '1rem' }}>
          <h4>Form State:</h4>
          <pre>{JSON.stringify({ values, errors, touched }, null, 2)}</pre>
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">Custom Hook Code (simplified):</h4>
        <pre><code>{`const useForm = (initialValues, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const handleSubmit = useCallback((onSubmit) => {
    return (e) => {
      e.preventDefault();
      const formErrors = validate ? validate(values) : {};
      setErrors(formErrors);
      
      if (Object.keys(formErrors).length === 0) {
        onSubmit(values);
      }
    };
  }, [values, validate]);

  return { values, errors, handleChange, handleSubmit };
};

// Usage
const { values, errors, handleChange, handleSubmit } = useForm(
  { name: '', email: '' },
  (values) => {
    const errors = {};
    if (!values.name) errors.name = 'Required';
    return errors;
  }
);`}</code></pre>
      </div>
    </div>
  );
};

export default CustomHooksExamples;
