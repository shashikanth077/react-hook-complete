import React, { useState, useEffect, useContext, createContext, useReducer, useRef, useCallback } from 'react';

const AdvancedPatternsExamples = () => {
  return (
    <div>
      <h1>Advanced React Patterns with Hooks</h1>
      <p>Explore advanced React patterns implemented with hooks, including compound components, render props alternatives, and state machines.</p>
      
      <CompoundComponentExample />
      <RenderPropsAlternativeExample />
      <StateReducerPatternExample />
      <ControlledUncontrolledExample />
      <DataFetchingPatternExample />
    </div>
  );
};

// Compound Component Pattern
const AccordionContext = createContext();

const Accordion = ({ children, allowMultiple = false }) => {
  const [openItems, setOpenItems] = useState(new Set());

  const toggleItem = useCallback((itemId) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        if (!allowMultiple) {
          newSet.clear();
        }
        newSet.add(itemId);
      }
      return newSet;
    });
  }, [allowMultiple]);

  const isOpen = useCallback((itemId) => openItems.has(itemId), [openItems]);

  return (
    <AccordionContext.Provider value={{ toggleItem, isOpen }}>
      <div className="accordion">
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

const AccordionItem = ({ children, id }) => {
  return (
    <div className="accordion-item">
      {React.Children.map(children, child =>
        React.cloneElement(child, { itemId: id })
      )}
    </div>
  );
};

const AccordionHeader = ({ children, itemId }) => {
  const { toggleItem, isOpen } = useContext(AccordionContext);
  
  return (
    <button
      className="accordion-header"
      onClick={() => toggleItem(itemId)}
      style={{
        width: '100%',
        padding: '1rem',
        border: '1px solid #ccc',
        backgroundColor: isOpen(itemId) ? '#f0f0f0' : 'white',
        textAlign: 'left',
        cursor: 'pointer'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {children}
        <span>{isOpen(itemId) ? '−' : '+'}</span>
      </div>
    </button>
  );
};

const AccordionPanel = ({ children, itemId }) => {
  const { isOpen } = useContext(AccordionContext);
  
  if (!isOpen(itemId)) return null;
  
  return (
    <div 
      className="accordion-panel"
      style={{
        padding: '1rem',
        border: '1px solid #ccc',
        borderTop: 'none',
        backgroundColor: '#fafafa'
      }}
    >
      {children}
    </div>
  );
};

// Add compound component methods
Accordion.Item = AccordionItem;
Accordion.Header = AccordionHeader;
Accordion.Panel = AccordionPanel;

const CompoundComponentExample = () => {
  return (
    <div className="example-container">
      <h2 className="example-title">1. Compound Component Pattern</h2>
      <p className="example-description">
        Create flexible, composable components that work together seamlessly.
      </p>
      
      <div className="demo-section">
        <div className="grid grid-2">
          <div>
            <h4>Single Open (Default)</h4>
            <Accordion>
              <Accordion.Item id="item1">
                <Accordion.Header>
                  What are React Hooks?
                </Accordion.Header>
                <Accordion.Panel>
                  React Hooks are functions that let you use state and other React features 
                  in functional components.
                </Accordion.Panel>
              </Accordion.Item>
              
              <Accordion.Item id="item2">
                <Accordion.Header>
                  Why use Hooks?
                </Accordion.Header>
                <Accordion.Panel>
                  Hooks provide a more direct API to React concepts and enable better 
                  code reuse between components.
                </Accordion.Panel>
              </Accordion.Item>
              
              <Accordion.Item id="item3">
                <Accordion.Header>
                  Hook Rules
                </Accordion.Header>
                <Accordion.Panel>
                  Only call Hooks at the top level and only call Hooks from React functions.
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </div>
          
          <div>
            <h4>Multiple Open Allowed</h4>
            <Accordion allowMultiple>
              <Accordion.Item id="multi1">
                <Accordion.Header>
                  useState
                </Accordion.Header>
                <Accordion.Panel>
                  Manages local state in functional components.
                </Accordion.Panel>
              </Accordion.Item>
              
              <Accordion.Item id="multi2">
                <Accordion.Header>
                  useEffect
                </Accordion.Header>
                <Accordion.Panel>
                  Handles side effects in functional components.
                </Accordion.Panel>
              </Accordion.Item>
              
              <Accordion.Item id="multi3">
                <Accordion.Header>
                  useContext
                </Accordion.Header>
                <Accordion.Panel>
                  Consumes context values without wrapper components.
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </div>
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">Code:</h4>
        <pre><code>{`const AccordionContext = createContext();

const Accordion = ({ children, allowMultiple = false }) => {
  const [openItems, setOpenItems] = useState(new Set());

  const toggleItem = useCallback((itemId) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        if (!allowMultiple) newSet.clear();
        newSet.add(itemId);
      }
      return newSet;
    });
  }, [allowMultiple]);

  return (
    <AccordionContext.Provider value={{ toggleItem, isOpen }}>
      {children}
    </AccordionContext.Provider>
  );
};

const AccordionItem = ({ children, id }) => (
  <div>{React.Children.map(children, child =>
    React.cloneElement(child, { itemId: id })
  )}</div>
);

const AccordionHeader = ({ children, itemId }) => {
  const { toggleItem, isOpen } = useContext(AccordionContext);
  return (
    <button onClick={() => toggleItem(itemId)}>
      {children} {isOpen(itemId) ? '−' : '+'}
    </button>
  );
};

// Usage
<Accordion allowMultiple>
  <Accordion.Item id="item1">
    <Accordion.Header>Title</Accordion.Header>
    <Accordion.Panel>Content</Accordion.Panel>
  </Accordion.Item>
</Accordion>`}</code></pre>
      </div>
    </div>
  );
};

// Render Props Alternative with Hooks
const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);
  
  const toggle = useCallback(() => setValue(prev => !prev), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  
  return { value, toggle, setTrue, setFalse };
};

const useCounter = (initialValue = 0, step = 1) => {
  const [count, setCount] = useState(initialValue);
  
  const increment = useCallback(() => setCount(prev => prev + step), [step]);
  const decrement = useCallback(() => setCount(prev => prev - step), [step]);
  const reset = useCallback(() => setCount(initialValue), [initialValue]);
  const set = useCallback((value) => setCount(value), []);
  
  return { count, increment, decrement, reset, set };
};

const Modal = ({ children, isOpen, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '2rem',
          maxWidth: '500px',
          width: '90%'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

const RenderPropsAlternativeExample = () => {
  const modal1 = useToggle(false);
  const modal2 = useToggle(false);
  const counter = useCounter(0, 1);

  return (
    <div className="example-container">
      <h2 className="example-title">2. Custom Hooks as Render Props Alternative</h2>
      <p className="example-description">
        Replace render props pattern with custom hooks for cleaner, more reusable logic.
      </p>
      
      <div className="demo-section">
        <div className="grid grid-2">
          <div className="card">
            <h4>Toggle Hook</h4>
            <p><strong>Modal 1 is:</strong> {modal1.value ? 'Open' : 'Closed'}</p>
            <p><strong>Modal 2 is:</strong> {modal2.value ? 'Open' : 'Closed'}</p>
            <div className="flex">
              <button onClick={modal1.toggle}>Toggle Modal 1</button>
              <button onClick={modal2.toggle}>Toggle Modal 2</button>
            </div>
          </div>
          
          <div className="card">
            <h4>Counter Hook</h4>
            <p><strong>Count:</strong> {counter.count}</p>
            <div className="flex">
              <button onClick={counter.increment}>+</button>
              <button onClick={counter.decrement}>-</button>
              <button onClick={counter.reset} className="secondary">Reset</button>
              <button onClick={() => counter.set(100)}>Set 100</button>
            </div>
          </div>
        </div>
        
        <Modal isOpen={modal1.value} onClose={modal1.setFalse}>
          <h3>Modal 1</h3>
          <p>This is the first modal. Press Escape or click outside to close.</p>
          <button onClick={modal1.setFalse}>Close</button>
        </Modal>
        
        <Modal isOpen={modal2.value} onClose={modal2.setFalse}>
          <h3>Modal 2</h3>
          <p>This is the second modal with different content.</p>
          <p>Current counter value: {counter.count}</p>
          <div className="flex">
            <button onClick={counter.increment}>Increment Counter</button>
            <button onClick={modal2.setFalse}>Close Modal</button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

// State Reducer Pattern
const counterReducer = (state, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + (action.step || 1) };
    case 'DECREMENT':
      return { ...state, count: state.count - (action.step || 1) };
    case 'RESET':
      return { ...state, count: action.initialValue || 0 };
    case 'SET_STEP':
      return { ...state, step: action.step };
    case 'SET_MAX':
      return { ...state, max: action.max };
    default:
      return state;
  }
};

const useCounterReducer = (initialValue = 0, initialStep = 1) => {
  const [state, dispatch] = useReducer(counterReducer, {
    count: initialValue,
    step: initialStep,
    max: null
  });

  const increment = useCallback(() => {
    if (state.max === null || state.count < state.max) {
      dispatch({ type: 'INCREMENT', step: state.step });
    }
  }, [state.count, state.step, state.max]);

  const decrement = useCallback(() => {
    dispatch({ type: 'DECREMENT', step: state.step });
  }, [state.step]);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET', initialValue });
  }, [initialValue]);

  const setStep = useCallback((step) => {
    dispatch({ type: 'SET_STEP', step });
  }, []);

  const setMax = useCallback((max) => {
    dispatch({ type: 'SET_MAX', max });
  }, []);

  return {
    ...state,
    increment,
    decrement,
    reset,
    setStep,
    setMax,
    canIncrement: state.max === null || state.count < state.max
  };
};

const StateReducerPatternExample = () => {
  const counter1 = useCounterReducer(0, 1);
  const counter2 = useCounterReducer(50, 5);

  useEffect(() => {
    counter2.setMax(100);
  }, [counter2.setMax]);

  return (
    <div className="example-container">
      <h2 className="example-title">3. State Reducer Pattern</h2>
      <p className="example-description">
        Manage complex state logic with useReducer for predictable state updates.
      </p>
      
      <div className="demo-section">
        <div className="grid grid-2">
          <div className="card">
            <h4>Counter 1 (No Limits)</h4>
            <p><strong>Count:</strong> {counter1.count}</p>
            <p><strong>Step:</strong> {counter1.step}</p>
            
            <div className="form-group">
              <label>Step Size:</label>
              <input
                type="number"
                value={counter1.step}
                onChange={(e) => counter1.setStep(parseInt(e.target.value) || 1)}
                min="1"
              />
            </div>
            
            <div className="flex">
              <button onClick={counter1.increment}>+{counter1.step}</button>
              <button onClick={counter1.decrement}>-{counter1.step}</button>
              <button onClick={counter1.reset} className="secondary">Reset</button>
            </div>
          </div>
          
          <div className="card">
            <h4>Counter 2 (Max: 100)</h4>
            <p><strong>Count:</strong> {counter2.count}</p>
            <p><strong>Step:</strong> {counter2.step}</p>
            <p><strong>Max:</strong> {counter2.max}</p>
            <p><strong>Can Increment:</strong> {counter2.canIncrement ? 'Yes' : 'No'}</p>
            
            <div className="flex">
              <input
                type="number"
                value={counter2.step}
                onChange={(e) => counter2.setStep(parseInt(e.target.value) || 1)}
                min="1"
                style={{ width: '80px' }}
              />
              <input
                type="number"
                value={counter2.max || ''}
                onChange={(e) => counter2.setMax(parseInt(e.target.value) || null)}
                placeholder="Max"
                style={{ width: '80px' }}
              />
            </div>
            
            <div className="flex">
              <button 
                onClick={counter2.increment} 
                disabled={!counter2.canIncrement}
              >
                +{counter2.step}
              </button>
              <button onClick={counter2.decrement}>-{counter2.step}</button>
              <button onClick={counter2.reset} className="secondary">Reset</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Controlled/Uncontrolled Pattern
const useControllableState = (controlledValue, defaultValue, onChange) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const setValue = useCallback((newValue) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  }, [isControlled, onChange]);

  return [value, setValue];
};

const ControllableInput = ({ value: controlledValue, defaultValue, onChange, ...props }) => {
  const [value, setValue] = useControllableState(controlledValue, defaultValue, onChange);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

const ControlledUncontrolledExample = () => {
  const [controlledValue, setControlledValue] = useState('Controlled');
  const [log, setLog] = useState([]);

  const addToLog = (message) => {
    setLog(prev => [...prev.slice(-4), `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  return (
    <div className="example-container">
      <h2 className="example-title">4. Controlled/Uncontrolled Pattern</h2>
      <p className="example-description">
        Create components that can work in both controlled and uncontrolled modes.
      </p>
      
      <div className="demo-section">
        <div className="grid grid-2">
          <div className="card">
            <h4>Controlled Input</h4>
            <p>Value is controlled by parent component</p>
            <ControllableInput
              value={controlledValue}
              onChange={(newValue) => {
                setControlledValue(newValue);
                addToLog(`Controlled changed to: ${newValue}`);
              }}
              placeholder="Controlled input"
            />
            <p><strong>Current value:</strong> {controlledValue}</p>
            <button onClick={() => setControlledValue('Reset')}>
              Reset Controlled
            </button>
          </div>
          
          <div className="card">
            <h4>Uncontrolled Input</h4>
            <p>Value is managed internally</p>
            <ControllableInput
              defaultValue="Uncontrolled"
              onChange={(newValue) => {
                addToLog(`Uncontrolled changed to: ${newValue}`);
              }}
              placeholder="Uncontrolled input"
            />
            <p><small>
              This input manages its own state internally but still reports changes.
            </small></p>
          </div>
        </div>
        
        <div className="card">
          <h4>Change Log</h4>
          <div style={{ 
            fontFamily: 'monospace', 
            fontSize: '0.8rem',
            maxHeight: '150px',
            overflowY: 'auto'
          }}>
            {log.map((entry, index) => (
              <div key={index}>{entry}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Data Fetching Pattern
const useAsyncData = (asyncFunction, dependencies = []) => {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null
  });

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await asyncFunction();
      setState({ data: result, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error });
    }
  }, dependencies);

  useEffect(() => {
    execute();
  }, [execute]);

  return { ...state, refetch: execute };
};

// Mock API functions
const fetchUsers = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.8) {
        reject(new Error('Failed to fetch users'));
      } else {
        resolve([
          { id: 1, name: 'John Doe', email: 'john@example.com' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
          { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
        ]);
      }
    }, 1000 + Math.random() * 1000);
  });
};

const fetchPosts = (userId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.7) {
        reject(new Error('Failed to fetch posts'));
      } else {
        resolve([
          { id: 1, title: `Post 1 by User ${userId}`, body: 'This is the first post' },
          { id: 2, title: `Post 2 by User ${userId}`, body: 'This is the second post' },
          { id: 3, title: `Post 3 by User ${userId}`, body: 'This is the third post' }
        ]);
      }
    }, 800 + Math.random() * 800);
  });
};

const DataFetchingPatternExample = () => {
  const [selectedUserId, setSelectedUserId] = useState(1);
  
  const users = useAsyncData(fetchUsers);
  const posts = useAsyncData(() => fetchPosts(selectedUserId), [selectedUserId]);

  return (
    <div className="example-container">
      <h2 className="example-title">5. Data Fetching Pattern</h2>
      <p className="example-description">
        Reusable async data fetching hook with loading states and error handling.
      </p>
      
      <div className="demo-section">
        <div className="grid grid-2">
          <div className="card">
            <div className="flex">
              <h4>Users</h4>
              <button onClick={users.refetch} disabled={users.loading}>
                {users.loading ? 'Loading...' : 'Refetch'}
              </button>
            </div>
            
            {users.loading && <p className="loading">Loading users...</p>}
            {users.error && <p className="error">Error: {users.error.message}</p>}
            {users.data && (
              <div>
                {users.data.map(user => (
                  <div 
                    key={user.id} 
                    className="card"
                    style={{
                      cursor: 'pointer',
                      backgroundColor: selectedUserId === user.id ? '#e3f2fd' : 'white'
                    }}
                    onClick={() => setSelectedUserId(user.id)}
                  >
                    <strong>{user.name}</strong>
                    <p>{user.email}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="card">
            <div className="flex">
              <h4>Posts by User {selectedUserId}</h4>
              <button onClick={posts.refetch} disabled={posts.loading}>
                {posts.loading ? 'Loading...' : 'Refetch'}
              </button>
            </div>
            
            {posts.loading && <p className="loading">Loading posts...</p>}
            {posts.error && <p className="error">Error: {posts.error.message}</p>}
            {posts.data && (
              <div>
                {posts.data.map(post => (
                  <div key={post.id} className="card">
                    <h5>{post.title}</h5>
                    <p>{post.body}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">Code:</h4>
        <pre><code>{`const useAsyncData = (asyncFunction, dependencies = []) => {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null
  });

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await asyncFunction();
      setState({ data: result, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error });
    }
  }, dependencies);

  useEffect(() => {
    execute();
  }, [execute]);

  return { ...state, refetch: execute };
};

// Usage
const DataComponent = () => {
  const [userId, setUserId] = useState(1);
  const { data, loading, error, refetch } = useAsyncData(
    () => fetchUserData(userId),
    [userId]
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {data && <UserDisplay user={data} />}
      <button onClick={refetch}>Refetch</button>
    </div>
  );
};`}</code></pre>
      </div>
    </div>
  );
};

export default AdvancedPatternsExamples;
