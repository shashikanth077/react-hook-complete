import React, { useState, useCallback, memo } from 'react';

const UseCallbackExamples = () => {
  return (
    <div>
      <h1>useCallback Hook Examples</h1>
      <p>The useCallback hook returns a memoized callback function. It's useful for optimizing child components that rely on reference equality to prevent unnecessary renders.</p>
      
      <BasicExample />
      <OptimizationExample />
      <EventHandlerExample />
      <DependencyExample />
    </div>
  );
};

// Basic useCallback example
const BasicExample = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  // Without useCallback - creates new function on every render
  const handleClickBad = () => {
    setCount(prev => prev + 1);
  };

  // With useCallback - function is memoized
  const handleClickGood = useCallback(() => {
    setCount(prev => prev + 1);
  }, []); // Empty dependency array means function never changes

  return (
    <div className="example-container">
      <h2 className="example-title">1. Basic useCallback</h2>
      <p className="example-description">
        Compare memoized vs non-memoized callback functions.
      </p>
      
      <div className="demo-section">
        <div className="grid grid-2">
          <div className="card">
            <h4>Without useCallback</h4>
            <p>Count: {count}</p>
            <button onClick={handleClickBad}>Increment (New Function)</button>
            <p><small>Creates new function on every render</small></p>
          </div>
          
          <div className="card">
            <h4>With useCallback</h4>
            <p>Count: {count}</p>
            <button onClick={handleClickGood}>Increment (Memoized)</button>
            <p><small>Function reference stays the same</small></p>
          </div>
        </div>
        
        <div className="form-group">
          <label>Name (to trigger re-renders):</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Type to cause re-renders"
          />
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">Code:</h4>
        <pre><code>{`const BasicExample = () => {
  const [count, setCount] = useState(0);

  // Without useCallback - new function every render
  const handleClickBad = () => {
    setCount(prev => prev + 1);
  };

  // With useCallback - memoized function
  const handleClickGood = useCallback(() => {
    setCount(prev => prev + 1);
  }, []); // Empty deps = never changes

  return (
    <div>
      <button onClick={handleClickBad}>Bad</button>
      <button onClick={handleClickGood}>Good</button>
    </div>
  );
};`}</code></pre>
      </div>
    </div>
  );
};

// Child component that uses memo
const ExpensiveChild = memo(({ onClick, label }) => {
  console.log(`ExpensiveChild "${label}" rendered`);
  
  return (
    <div className="card">
      <h4>{label}</h4>
      <button onClick={onClick}>Click me</button>
      <p><small>Check console for render logs</small></p>
    </div>
  );
});

const OptimizationExample = () => {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [name, setName] = useState('');

  // Without useCallback - child re-renders unnecessarily
  const handleClick1 = () => {
    setCount1(prev => prev + 1);
  };

  // With useCallback - child only re-renders when needed
  const handleClick2 = useCallback(() => {
    setCount2(prev => prev + 1);
  }, []);

  return (
    <div className="example-container">
      <h2 className="example-title">2. Performance Optimization</h2>
      <p className="example-description">
        useCallback prevents unnecessary re-renders of memoized child components.
      </p>
      
      <div className="demo-section">
        <div className="alert info">
          <strong>Open the console</strong> to see render logs. Type in the name field to trigger parent re-renders.
        </div>
        
        <div className="form-group">
          <label>Name (triggers parent re-render):</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Type here to see the difference"
          />
        </div>

        <div className="grid grid-2">
          <ExpensiveChild
            onClick={handleClick1}
            label={`Without useCallback (Count: ${count1})`}
          />
          <ExpensiveChild
            onClick={handleClick2}
            label={`With useCallback (Count: ${count2})`}
          />
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">Code:</h4>
        <pre><code>{`const ExpensiveChild = memo(({ onClick, label }) => {
  console.log(\`ExpensiveChild "\${label}" rendered\`);
  return <button onClick={onClick}>{label}</button>;
});

const Parent = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  // Without useCallback - child re-renders on every parent render
  const handleClickBad = () => {
    setCount(prev => prev + 1);
  };

  // With useCallback - child only re-renders when callback changes
  const handleClickGood = useCallback(() => {
    setCount(prev => prev + 1);
  }, []); // Empty deps = callback never changes

  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <ExpensiveChild onClick={handleClickBad} label="Bad" />
      <ExpensiveChild onClick={handleClickGood} label="Good" />
    </div>
  );
};`}</code></pre>
      </div>
    </div>
  );
};

// Event handler example
const EventHandlerExample = () => {
  const [items, setItems] = useState([
    { id: 1, name: 'Item 1', completed: false },
    { id: 2, name: 'Item 2', completed: true },
    { id: 3, name: 'Item 3', completed: false }
  ]);

  const handleToggle = useCallback((id) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  }, []); // No dependencies needed since we use functional update

  const handleDelete = useCallback((id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      name: `Item ${items.length + 1}`,
      completed: false
    };
    setItems(prev => [...prev, newItem]);
  };

  return (
    <div className="example-container">
      <h2 className="example-title">3. Event Handlers with useCallback</h2>
      <p className="example-description">
        Optimize event handlers passed to list items to prevent unnecessary re-renders.
      </p>
      
      <div className="demo-section">
        <button onClick={addItem} style={{ marginBottom: '1rem' }}>
          Add Item
        </button>
        
        {items.map(item => (
          <TodoItem
            key={item.id}
            item={item}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <div className="code-section">
        <h4 className="code-title">Code:</h4>
        <pre><code>{`const EventHandlerExample = () => {
  const [items, setItems] = useState([...]);

  // Memoized event handlers
  const handleToggle = useCallback((id) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  }, []); // No dependencies - using functional update

  const handleDelete = useCallback((id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  return (
    <div>
      {items.map(item => (
        <TodoItem
          key={item.id}
          item={item}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};`}</code></pre>
      </div>
    </div>
  );
};

const TodoItem = memo(({ item, onToggle, onDelete }) => {
  console.log(`TodoItem ${item.id} rendered`);
  
  return (
    <div className="card">
      <div className="flex">
        <label style={{ flex: 1, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={item.completed}
            onChange={() => onToggle(item.id)}
          />
          <span style={{ 
            textDecoration: item.completed ? 'line-through' : 'none',
            marginLeft: '0.5rem'
          }}>
            {item.name}
          </span>
        </label>
        <button 
          onClick={() => onDelete(item.id)}
          className="danger"
        >
          Delete
        </button>
      </div>
    </div>
  );
});

// Dependencies example
const DependencyExample = () => {
  const [count, setCount] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [name, setName] = useState('');

  // Callback depends on multiplier
  const handleIncrement = useCallback(() => {
    setCount(prev => prev + multiplier);
  }, [multiplier]); // Recreated when multiplier changes

  // Callback with no dependencies
  const handleReset = useCallback(() => {
    setCount(0);
  }, []);

  // Callback that depends on current count (anti-pattern)
  const handleDouble = useCallback(() => {
    setCount(count * 2); // Don't do this!
  }, [count]); // Recreated on every count change

  // Better version using functional update
  const handleDoubleBetter = useCallback(() => {
    setCount(prev => prev * 2); // Better!
  }, []); // No dependencies needed

  return (
    <div className="example-container">
      <h2 className="example-title">4. Dependencies in useCallback</h2>
      <p className="example-description">
        Understanding when to include dependencies and how to avoid common pitfalls.
      </p>
      
      <div className="demo-section">
        <div className="grid grid-2">
          <div className="card">
            <h4>Current State</h4>
            <p><strong>Count:</strong> {count}</p>
            <p><strong>Multiplier:</strong> {multiplier}</p>
            <p><strong>Name:</strong> {name}</p>
          </div>
          
          <div className="card">
            <h4>Controls</h4>
            <div className="form-group">
              <label>Multiplier:</label>
              <input
                type="number"
                value={multiplier}
                onChange={(e) => setMultiplier(parseInt(e.target.value) || 1)}
                min="1"
              />
            </div>
            
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Won't affect callbacks"
              />
            </div>
          </div>
        </div>
        
        <div className="flex">
          <button onClick={handleIncrement}>
            Increment by {multiplier}
          </button>
          <button onClick={handleReset} className="secondary">
            Reset
          </button>
          <button onClick={handleDouble}>
            Double (Bad)
          </button>
          <button onClick={handleDoubleBetter}>
            Double (Good)
          </button>
        </div>
        
        <div className="alert warning">
          <strong>Note:</strong> The "Double (Bad)" button recreates its callback on every count change, 
          while "Double (Good)" uses functional update to avoid dependencies.
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">Code:</h4>
        <pre><code>{`const DependencyExample = () => {
  const [count, setCount] = useState(0);
  const [multiplier, setMultiplier] = useState(1);

  // Depends on multiplier - recreated when multiplier changes
  const handleIncrement = useCallback(() => {
    setCount(prev => prev + multiplier);
  }, [multiplier]);

  // No dependencies - never recreated
  const handleReset = useCallback(() => {
    setCount(0);
  }, []);

  // Anti-pattern: depends on count
  const handleDoubleBad = useCallback(() => {
    setCount(count * 2); // Recreated on every count change!
  }, [count]);

  // Better: use functional update to avoid dependencies
  const handleDoubleGood = useCallback(() => {
    setCount(prev => prev * 2); // No dependencies needed!
  }, []);

  return (
    <div>
      <button onClick={handleIncrement}>Increment by {multiplier}</button>
      <button onClick={handleReset}>Reset</button>
      <button onClick={handleDoubleGood}>Double</button>
    </div>
  );
};`}</code></pre>
      </div>
    </div>
  );
};

export default UseCallbackExamples;
