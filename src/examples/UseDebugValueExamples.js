import React, { useState, useDebugValue, useEffect, useMemo } from 'react';

const UseDebugValueExamples = () => {
  return (
    <div>
      <h1>useDebugValue Hook Examples</h1>
      <p>The useDebugValue hook is used to display a label for custom hooks in React DevTools. It helps with debugging by providing meaningful information about hook state.</p>
      
      <BasicExample />
      <FormattedExample />
      <ConditionalExample />
      <MultipleHooksExample />
    </div>
  );
};

// Custom hook with useDebugValue
const useCounter = (initialValue = 0, step = 1) => {
  const [count, setCount] = useState(initialValue);
  
  // Basic debug value
  useDebugValue(count);

  const increment = () => setCount(prev => prev + step);
  const decrement = () => setCount(prev => prev - step);
  const reset = () => setCount(initialValue);

  return { count, increment, decrement, reset };
};

const BasicExample = () => {
  const counter = useCounter(0, 1);

  return (
    <div className="example-container">
      <h2 className="example-title">1. Basic useDebugValue</h2>
      <p className="example-description">
        Custom hook with basic debug value showing the current count.
      </p>
      
      <div className="demo-section">
        <div className="card">
          <h4>Counter: {counter.count}</h4>
          <div className="flex">
            <button onClick={counter.increment}>Increment</button>
            <button onClick={counter.decrement}>Decrement</button>
            <button onClick={counter.reset} className="secondary">Reset</button>
          </div>
        </div>
        
        <div className="alert info">
          Open React DevTools and inspect this component to see the debug value for the useCounter hook.
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">Code:</h4>
        <pre><code>{`const useCounter = (initialValue = 0, step = 1) => {
  const [count, setCount] = useState(initialValue);
  
  // Basic debug value - shows current count
  useDebugValue(count);

  const increment = () => setCount(prev => prev + step);
  const decrement = () => setCount(prev => prev - step);
  const reset = () => setCount(initialValue);

  return { count, increment, decrement, reset };
};

const BasicExample = () => {
  const counter = useCounter(0, 1);

  return (
    <div>
      <h4>Counter: {counter.count}</h4>
      <button onClick={counter.increment}>Increment</button>
      <button onClick={counter.decrement}>Decrement</button>
    </div>
  );
};`}</code></pre>
      </div>
    </div>
  );
};

// Custom hook with formatted debug value
const useFormattedCounter = (initialValue = 0, step = 1) => {
  const [count, setCount] = useState(initialValue);
  
  // Formatted debug value with additional context
  useDebugValue(count, (value) => \`Count: \${value} (step: \${step})\`);

  const increment = () => setCount(prev => prev + step);
  const decrement = () => setCount(prev => prev - step);
  const reset = () => setCount(initialValue);

  return { count, increment, decrement, reset, step };
};

const FormattedExample = () => {
  const counter1 = useFormattedCounter(0, 1);
  const counter2 = useFormattedCounter(100, 5);

  return (
    <div className="example-container">
      <h2 className="example-title">2. Formatted Debug Value</h2>
      <p className="example-description">
        Custom hook with formatted debug value showing additional context.
      </p>
      
      <div className="demo-section">
        <div className="grid grid-2">
          <div className="card">
            <h4>Counter 1: {counter1.count}</h4>
            <p>Step: {counter1.step}</p>
            <div className="flex">
              <button onClick={counter1.increment}>+{counter1.step}</button>
              <button onClick={counter1.decrement}>-{counter1.step}</button>
              <button onClick={counter1.reset} className="secondary">Reset</button>
            </div>
          </div>
          
          <div className="card">
            <h4>Counter 2: {counter2.count}</h4>
            <p>Step: {counter2.step}</p>
            <div className="flex">
              <button onClick={counter2.increment}>+{counter2.step}</button>
              <button onClick={counter2.decrement}>-{counter2.step}</button>
              <button onClick={counter2.reset} className="secondary">Reset</button>
            </div>
          </div>
        </div>
        
        <div className="alert info">
          In React DevTools, you'll see formatted debug values showing both count and step for each hook instance.
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">Code:</h4>
        <pre><code>{`const useFormattedCounter = (initialValue = 0, step = 1) => {
  const [count, setCount] = useState(initialValue);
  
  // Formatted debug value with additional context
  useDebugValue(count, (value) => \`Count: \${value} (step: \${step})\`);

  const increment = () => setCount(prev => prev + step);
  const decrement = () => setCount(prev => prev - step);
  const reset = () => setCount(initialValue);

  return { count, increment, decrement, reset, step };
};

const FormattedExample = () => {
  const counter1 = useFormattedCounter(0, 1);
  const counter2 = useFormattedCounter(100, 5);

  return (
    <div>
      <div>Counter 1: {counter1.count}</div>
      <div>Counter 2: {counter2.count}</div>
    </div>
  );
};`}</code></pre>
      </div>
    </div>
  );
};

// Custom hook with conditional debug value
const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);
  
  // Conditional debug value - only shows when true
  useDebugValue(value ? 'ON' : 'OFF');

  const toggle = () => setValue(prev => !prev);
  const setTrue = () => setValue(true);
  const setFalse = () => setValue(false);

  return { value, toggle, setTrue, setFalse };
};

const useTimer = (initialSeconds = 0) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  
  // Complex debug value with multiple pieces of information
  useDebugValue(
    { seconds, isRunning },
    ({ seconds, isRunning }) => {
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      const timeStr = \`\${minutes}:\${secs.toString().padStart(2, '0')}\`;
      return \`\${timeStr} (\${isRunning ? 'running' : 'stopped'})\`;
    }
  );

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const start = () => setIsRunning(true);
  const stop = () => setIsRunning(false);
  const reset = () => {
    setSeconds(initialSeconds);
    setIsRunning(false);
  };

  return { seconds, isRunning, start, stop, reset };
};

const ConditionalExample = () => {
  const toggle1 = useToggle(false);
  const toggle2 = useToggle(true);
  const timer = useTimer(0);

  return (
    <div className="example-container">
      <h2 className="example-title">3. Conditional & Complex Debug Values</h2>
      <p className="example-description">
        Custom hooks with conditional and complex debug value formatting.
      </p>
      
      <div className="demo-section">
        <div className="grid grid-3">
          <div className="card">
            <h4>Toggle 1</h4>
            <p>Status: {toggle1.value ? 'ON' : 'OFF'}</p>
            <div className="flex flex-column">
              <button onClick={toggle1.toggle}>Toggle</button>
              <button onClick={toggle1.setTrue} className="success">Set ON</button>
              <button onClick={toggle1.setFalse} className="danger">Set OFF</button>
            </div>
          </div>
          
          <div className="card">
            <h4>Toggle 2</h4>
            <p>Status: {toggle2.value ? 'ON' : 'OFF'}</p>
            <div className="flex flex-column">
              <button onClick={toggle2.toggle}>Toggle</button>
              <button onClick={toggle2.setTrue} className="success">Set ON</button>
              <button onClick={toggle2.setFalse} className="danger">Set OFF</button>
            </div>
          </div>
          
          <div className="card">
            <h4>Timer</h4>
            <p style={{ fontFamily: 'monospace', fontSize: '1.5rem' }}>
              {Math.floor(timer.seconds / 60)}:{(timer.seconds % 60).toString().padStart(2, '0')}
            </p>
            <p>Status: {timer.isRunning ? 'Running' : 'Stopped'}</p>
            <div className="flex flex-column">
              <button onClick={timer.start} disabled={timer.isRunning} className="success">
                Start
              </button>
              <button onClick={timer.stop} disabled={!timer.isRunning} className="danger">
                Stop
              </button>
              <button onClick={timer.reset} className="secondary">Reset</button>
            </div>
          </div>
        </div>
        
        <div className="alert info">
          Check React DevTools to see different debug value formats: simple ON/OFF for toggles and formatted time for the timer.
        </div>
      </div>
    </div>
  );
};

// Multiple custom hooks with debug values
const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debug value showing fetch status
  useDebugValue(
    { loading, error: !!error, hasData: !!data },
    (status) => {
      if (status.loading) return 'Loading...';
      if (status.error) return 'Error';
      if (status.hasData) return 'Success';
      return 'Idle';
    }
  );

  useEffect(() => {
    if (!url) return;

    setLoading(true);
    setError(null);

    // Simulate fetch with timeout
    const timeoutId = setTimeout(() => {
      if (Math.random() > 0.7) {
        setError(new Error('Simulated fetch error'));
      } else {
        setData({
          url,
          timestamp: new Date().toISOString(),
          data: \`Data for \${url}\`
        });
      }
      setLoading(false);
    }, 1000 + Math.random() * 2000);

    return () => clearTimeout(timeoutId);
  }, [url]);

  const refetch = () => {
    setData(null);
    setError(null);
    setLoading(true);
    
    const timeoutId = setTimeout(() => {
      if (Math.random() > 0.7) {
        setError(new Error('Simulated fetch error'));
      } else {
        setData({
          url,
          timestamp: new Date().toISOString(),
          data: \`Data for \${url}\`
        });
      }
      setLoading(false);
    }, 1000 + Math.random() * 2000);
  };

  return { data, loading, error, refetch };
};

const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Debug value showing localStorage key and value type
  useDebugValue(
    { key, value },
    ({ key, value }) => \`\${key}: \${typeof value} (\${JSON.stringify(value).length} chars)\`
  );

  const setStoredValue = (newValue) => {
    try {
      setValue(newValue);
      localStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.error('Error setting localStorage:', error);
    }
  };

  return [value, setStoredValue];
};

const MultipleHooksExample = () => {
  const fetchResult = useFetch('https://api.example.com/data');
  const [name, setName] = useLocalStorage('userName', '');
  const [preferences, setPreferences] = useLocalStorage('userPrefs', {
    theme: 'light',
    notifications: true
  });

  return (
    <div className="example-container">
      <h2 className="example-title">4. Multiple Custom Hooks</h2>
      <p className="example-description">
        Component using multiple custom hooks, each with their own debug values.
      </p>
      
      <div className="demo-section">
        <div className="grid grid-2">
          <div className="card">
            <h4>Fetch Data</h4>
            {fetchResult.loading && <p className="loading">Loading...</p>}
            {fetchResult.error && <p className="error">Error: {fetchResult.error.message}</p>}
            {fetchResult.data && (
              <div>
                <p><strong>URL:</strong> {fetchResult.data.url}</p>
                <p><strong>Timestamp:</strong> {fetchResult.data.timestamp}</p>
                <p><strong>Data:</strong> {fetchResult.data.data}</p>
              </div>
            )}
            <button onClick={fetchResult.refetch} disabled={fetchResult.loading}>
              {fetchResult.loading ? 'Loading...' : 'Refetch'}
            </button>
          </div>
          
          <div className="card">
            <h4>Local Storage</h4>
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
              <label>Theme:</label>
              <select
                value={preferences.theme}
                onChange={(e) => setPreferences({
                  ...preferences,
                  theme: e.target.value
                })}
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
                  onChange={(e) => setPreferences({
                    ...preferences,
                    notifications: e.target.checked
                  })}
                />
                Enable notifications
              </label>
            </div>
          </div>
        </div>
        
        <div className="alert info">
          This component uses multiple custom hooks. In React DevTools, you'll see debug values for:
          <ul>
            <li><strong>useFetch:</strong> Shows loading/error/success status</li>
            <li><strong>useLocalStorage:</strong> Shows key names and data size</li>
          </ul>
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">Code:</h4>
        <pre><code>{`const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debug value showing fetch status
  useDebugValue(
    { loading, error: !!error, hasData: !!data },
    (status) => {
      if (status.loading) return 'Loading...';
      if (status.error) return 'Error';
      if (status.hasData) return 'Success';
      return 'Idle';
    }
  );

  // ... fetch logic

  return { data, loading, error };
};

const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(initialValue);

  // Debug value showing key and value info
  useDebugValue(
    { key, value },
    ({ key, value }) => \`\${key}: \${typeof value}\`
  );

  // ... localStorage logic

  return [value, setValue];
};

const MultipleHooksExample = () => {
  const fetchResult = useFetch('https://api.example.com/data');
  const [name, setName] = useLocalStorage('userName', '');
  
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
};`}</code></pre>
      </div>
    </div>
  );
};

export default UseDebugValueExamples;
