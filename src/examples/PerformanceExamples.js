import React, { useState, useMemo, useCallback, memo, useRef, useEffect } from 'react';

const PerformanceExamples = () => {
  return (
    <div>
      <h1>Performance Optimization Examples</h1>
      <p>Learn how to optimize React applications using various hooks and techniques to prevent unnecessary re-renders and improve performance.</p>
      
      <MemoizationExample />
      <ExpensiveCalculationExample />
      <ListOptimizationExample />
      <ChildComponentOptimizationExample />
      <RenderCountExample />
    </div>
  );
};

// Heavy computation simulation
const heavyComputation = (num) => {
  console.log('Heavy computation running...');
  let result = 0;
  for (let i = 0; i < 1000000; i++) {
    result += Math.sin(num + i) * Math.cos(num + i);
  }
  return result.toFixed(2);
};

const MemoizationExample = () => {
  const [count, setCount] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [unrelatedState, setUnrelatedState] = useState('');

  // Without useMemo - recalculates every render
  const expensiveValueBad = heavyComputation(count * multiplier);

  // With useMemo - only recalculates when dependencies change
  const expensiveValueGood = useMemo(() => {
    return heavyComputation(count * multiplier);
  }, [count, multiplier]);

  return (
    <div className="example-container">
      <h2 className="example-title">1. Memoization Comparison</h2>
      <p className="example-description">
        Compare performance with and without useMemo for expensive calculations.
      </p>
      
      <div className="demo-section">
        <div className="alert warning">
          <strong>Open the console</strong> to see when heavy computations run. Type in the text field to trigger re-renders.
        </div>
        
        <div className="grid grid-2">
          <div className="card">
            <h4>Without useMemo</h4>
            <p><strong>Result:</strong> {expensiveValueBad}</p>
            <p><small>Recalculates on every render</small></p>
          </div>
          
          <div className="card">
            <h4>With useMemo</h4>
            <p><strong>Result:</strong> {expensiveValueGood}</p>
            <p><small>Only recalculates when count or multiplier changes</small></p>
          </div>
        </div>
        
        <div className="grid grid-3">
          <div className="form-group">
            <label>Count: {count}</label>
            <button onClick={() => setCount(count + 1)}>Increment</button>
          </div>
          
          <div className="form-group">
            <label>Multiplier: {multiplier}</label>
            <input
              type="number"
              value={multiplier}
              onChange={(e) => setMultiplier(parseInt(e.target.value) || 1)}
              min="1"
            />
          </div>
          
          <div className="form-group">
            <label>Unrelated Input:</label>
            <input
              type="text"
              value={unrelatedState}
              onChange={(e) => setUnrelatedState(e.target.value)}
              placeholder="Type to trigger re-render"
            />
          </div>
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">Code:</h4>
        <pre><code>{`const MemoizationExample = () => {
  const [count, setCount] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [unrelatedState, setUnrelatedState] = useState('');

  // Without useMemo - recalculates every render
  const expensiveValueBad = heavyComputation(count * multiplier);

  // With useMemo - only recalculates when dependencies change
  const expensiveValueGood = useMemo(() => {
    return heavyComputation(count * multiplier);
  }, [count, multiplier]); // Only recalc when these change

  return (
    <div>
      <p>Without useMemo: {expensiveValueBad}</p>
      <p>With useMemo: {expensiveValueGood}</p>
      <input
        value={unrelatedState}
        onChange={(e) => setUnrelatedState(e.target.value)}
        placeholder="Triggers re-render but not recalculation"
      />
    </div>
  );
};`}</code></pre>
      </div>
    </div>
  );
};

// Expensive calculation with different scenarios
const ExpensiveCalculationExample = () => {
  const [numbers, setNumbers] = useState([1, 2, 3, 4, 5]);
  const [filter, setFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('asc');

  // Expensive filtering
  const filteredNumbers = useMemo(() => {
    console.log('Filtering numbers...');
    return numbers.filter(num => {
      if (filter === 'even') return num % 2 === 0;
      if (filter === 'odd') return num % 2 === 1;
      return true;
    });
  }, [numbers, filter]);

  // Expensive sorting
  const sortedNumbers = useMemo(() => {
    console.log('Sorting numbers...');
    return [...filteredNumbers].sort((a, b) => {
      return sortOrder === 'asc' ? a - b : b - a;
    });
  }, [filteredNumbers, sortOrder]);

  // Expensive calculation based on sorted numbers
  const statistics = useMemo(() => {
    console.log('Calculating statistics...');
    const sum = sortedNumbers.reduce((acc, num) => acc + num, 0);
    const avg = sortedNumbers.length > 0 ? sum / sortedNumbers.length : 0;
    const max = Math.max(...sortedNumbers);
    const min = Math.min(...sortedNumbers);
    
    return { sum, avg: avg.toFixed(2), max, min, count: sortedNumbers.length };
  }, [sortedNumbers]);

  const addRandomNumber = () => {
    const newNumber = Math.floor(Math.random() * 100) + 1;
    setNumbers(prev => [...prev, newNumber]);
  };

  const removeLastNumber = () => {
    setNumbers(prev => prev.slice(0, -1));
  };

  return (
    <div className="example-container">
      <h2 className="example-title">2. Chained Expensive Calculations</h2>
      <p className="example-description">
        Multiple expensive operations chained together with optimal memoization.
      </p>
      
      <div className="demo-section">
        <div className="alert info">
          Each operation is memoized separately. Check console to see which operations run when you make changes.
        </div>
        
        <div className="grid grid-3">
          <div className="form-group">
            <label>Filter:</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="even">Even</option>
              <option value="odd">Odd</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Sort:</label>
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
          
          <div className="flex">
            <button onClick={addRandomNumber}>Add Random</button>
            <button onClick={removeLastNumber} disabled={numbers.length === 0}>
              Remove Last
            </button>
          </div>
        </div>
        
        <div className="grid grid-2">
          <div className="card">
            <h4>Numbers & Results</h4>
            <p><strong>Original:</strong> [{numbers.join(', ')}]</p>
            <p><strong>Filtered ({filter}):</strong> [{filteredNumbers.join(', ')}]</p>
            <p><strong>Sorted ({sortOrder}):</strong> [{sortedNumbers.join(', ')}]</p>
          </div>
          
          <div className="card">
            <h4>Statistics</h4>
            <p><strong>Count:</strong> {statistics.count}</p>
            <p><strong>Sum:</strong> {statistics.sum}</p>
            <p><strong>Average:</strong> {statistics.avg}</p>
            <p><strong>Min:</strong> {statistics.min}</p>
            <p><strong>Max:</strong> {statistics.max}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Optimized list component
const ListItem = memo(({ item, onToggle, onDelete }) => {
  console.log(`ListItem ${item.id} rendered`);
  
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
            {item.text}
          </span>
        </label>
        <button onClick={() => onDelete(item.id)} className="danger">
          Delete
        </button>
      </div>
    </div>
  );
});

const ListOptimizationExample = () => {
  const [items, setItems] = useState([
    { id: 1, text: 'Learn React Hooks', completed: false },
    { id: 2, text: 'Optimize performance', completed: false },
    { id: 3, text: 'Build awesome apps', completed: true }
  ]);
  const [newItemText, setNewItemText] = useState('');
  const [filter, setFilter] = useState('all');

  // Memoized filtered items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (filter === 'completed') return item.completed;
      if (filter === 'active') return !item.completed;
      return true;
    });
  }, [items, filter]);

  // Memoized event handlers to prevent unnecessary re-renders
  const handleToggle = useCallback((id) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  }, []);

  const handleDelete = useCallback((id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const addItem = () => {
    if (newItemText.trim()) {
      setItems(prev => [...prev, {
        id: Date.now(),
        text: newItemText.trim(),
        completed: false
      }]);
      setNewItemText('');
    }
  };

  return (
    <div className="example-container">
      <h2 className="example-title">3. Optimized List Rendering</h2>
      <p className="example-description">
        Optimized list with memoized components and callbacks to prevent unnecessary re-renders.
      </p>
      
      <div className="demo-section">
        <div className="alert info">
          List items are memoized with React.memo and use memoized callbacks. Check console to see which items re-render.
        </div>
        
        <div className="grid grid-2">
          <div className="form-group">
            <label>Add new item:</label>
            <div className="flex">
              <input
                type="text"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                placeholder="Enter item text"
                onKeyPress={(e) => e.key === 'Enter' && addItem()}
              />
              <button onClick={addItem} disabled={!newItemText.trim()}>
                Add
              </button>
            </div>
          </div>
          
          <div className="form-group">
            <label>Filter:</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All ({items.length})</option>
              <option value="active">Active ({items.filter(i => !i.completed).length})</option>
              <option value="completed">Completed ({items.filter(i => i.completed).length})</option>
            </select>
          </div>
        </div>
        
        <div>
          <h4>Items ({filteredItems.length})</h4>
          {filteredItems.map(item => (
            <ListItem
              key={item.id}
              item={item}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))}
          
          {filteredItems.length === 0 && (
            <p className="alert info">
              No {filter === 'all' ? '' : filter} items found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Child component optimization
const ExpensiveChild = memo(({ value, onUpdate }) => {
  console.log('ExpensiveChild rendered with value:', value);
  
  // Simulate expensive rendering
  const expensiveValue = useMemo(() => {
    let result = 0;
    for (let i = 0; i < 100000; i++) {
      result += Math.sin(value + i);
    }
    return result.toFixed(2);
  }, [value]);

  return (
    <div className="card">
      <h4>Expensive Child Component</h4>
      <p><strong>Input Value:</strong> {value}</p>
      <p><strong>Expensive Calculation:</strong> {expensiveValue}</p>
      <button onClick={() => onUpdate(value + 1)}>
        Update Value
      </button>
    </div>
  );
});

const ChildComponentOptimizationExample = () => {
  const [childValue, setChildValue] = useState(1);
  const [parentCounter, setParentCounter] = useState(0);
  const [unrelatedState, setUnrelatedState] = useState('');

  // Memoized callback to prevent child re-renders
  const handleChildUpdate = useCallback((newValue) => {
    setChildValue(newValue);
  }, []);

  return (
    <div className="example-container">
      <h2 className="example-title">4. Child Component Optimization</h2>
      <p className="example-description">
        Prevent unnecessary child component re-renders using React.memo and useCallback.
      </p>
      
      <div className="demo-section">
        <div className="alert info">
          The child component only re-renders when its props actually change, not when parent state changes.
        </div>
        
        <div className="grid grid-2">
          <div className="card">
            <h4>Parent Controls</h4>
            <p><strong>Parent Counter:</strong> {parentCounter}</p>
            <button onClick={() => setParentCounter(parentCounter + 1)}>
              Increment Parent Counter
            </button>
            
            <div className="form-group">
              <label>Unrelated Input:</label>
              <input
                type="text"
                value={unrelatedState}
                onChange={(e) => setUnrelatedState(e.target.value)}
                placeholder="Type here (won't affect child)"
              />
            </div>
            
            <p><small>
              Changing parent counter or typing in input won't re-render the child component
              because its props haven't changed.
            </small></p>
          </div>
          
          <ExpensiveChild 
            value={childValue} 
            onUpdate={handleChildUpdate}
          />
        </div>
      </div>
    </div>
  );
};

// Render count tracker
const useRenderCount = (componentName) => {
  const renderCount = useRef(0);
  
  useEffect(() => {
    renderCount.current += 1;
  });

  return renderCount.current;
};

const RenderCountComponent = memo(({ name, value, onChange }) => {
  const renderCount = useRenderCount(`RenderCountComponent-${name}`);
  
  return (
    <div className="card">
      <h5>{name}</h5>
      <p><strong>Render count:</strong> {renderCount}</p>
      <p><strong>Value:</strong> {value}</p>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type here"
      />
    </div>
  );
});

const RenderCountExample = () => {
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  const [value3, setValue3] = useState('');
  const parentRenderCount = useRenderCount('Parent');

  // Memoized callbacks
  const handleValue1Change = useCallback((newValue) => setValue1(newValue), []);
  const handleValue2Change = useCallback((newValue) => setValue2(newValue), []);
  const handleValue3Change = useCallback((newValue) => setValue3(newValue), []);

  return (
    <div className="example-container">
      <h2 className="example-title">5. Render Count Tracking</h2>
      <p className="example-description">
        Track render counts to understand when components re-render and optimize accordingly.
      </p>
      
      <div className="demo-section">
        <div className="card">
          <h4>Parent Component</h4>
          <p><strong>Parent render count:</strong> {parentRenderCount}</p>
          <p><small>Parent re-renders when any child value changes</small></p>
        </div>
        
        <div className="grid grid-3">
          <RenderCountComponent
            name="Component 1"
            value={value1}
            onChange={handleValue1Change}
          />
          <RenderCountComponent
            name="Component 2"
            value={value2}
            onChange={handleValue2Change}
          />
          <RenderCountComponent
            name="Component 3"
            value={value3}
            onChange={handleValue3Change}
          />
        </div>
        
        <div className="alert info">
          Each child component only re-renders when its own value changes, not when other components' values change.
          This is achieved through React.memo and memoized callbacks.
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">Code:</h4>
        <pre><code>{`// Custom hook to track render counts
const useRenderCount = (componentName) => {
  const renderCount = useRef(0);
  
  useEffect(() => {
    renderCount.current += 1;
  });

  return renderCount.current;
};

// Memoized child component
const RenderCountComponent = memo(({ name, value, onChange }) => {
  const renderCount = useRenderCount(\`Component-\${name}\`);
  
  return (
    <div>
      <h5>{name}</h5>
      <p>Render count: {renderCount}</p>
      <input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
});

const Parent = () => {
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  const parentRenderCount = useRenderCount('Parent');

  // Memoized callbacks prevent unnecessary re-renders
  const handleValue1Change = useCallback((newValue) => {
    setValue1(newValue);
  }, []);

  const handleValue2Change = useCallback((newValue) => {
    setValue2(newValue);
  }, []);

  return (
    <div>
      <p>Parent renders: {parentRenderCount}</p>
      <RenderCountComponent 
        name="Child 1" 
        value={value1} 
        onChange={handleValue1Change} 
      />
      <RenderCountComponent 
        name="Child 2" 
        value={value2} 
        onChange={handleValue2Change} 
      />
    </div>
  );
};`}</code></pre>
      </div>
    </div>
  );
};

export default PerformanceExamples;
