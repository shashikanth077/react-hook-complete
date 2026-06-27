import React, { useState, useMemo, memo } from 'react';

const UseMemoExamples = () => {
  return (
    <div>
      <h1>useMemo Hook Examples</h1>
      <p>The useMemo hook memoizes expensive calculations and only recalculates when dependencies change. It's useful for performance optimization.</p>
      
      <ExpensiveCalculationExample />
      <FilteringExample />
      <ObjectMemoizationExample />
      <DependencyExample />
    </div>
  );
};

// Expensive calculation example
const ExpensiveCalculationExample = () => {
  const [count, setCount] = useState(0);
  const [input, setInput] = useState('');

  // Simulate expensive calculation
  const expensiveValue = useMemo(() => {
    console.log('Calculating expensive value...');
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += Math.random();
    }
    return result + count;
  }, [count]); // Only recalculate when count changes

  // Without useMemo - calculates every render
  const expensiveValueBad = (() => {
    console.log('Calculating expensive value (bad)...');
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += Math.random();
    }
    return result + count;
  })();

  return (
    <div className="example-container">
      <h2 className="example-title">1. Expensive Calculation</h2>
      <p className="example-description">
        Memoize expensive calculations to avoid unnecessary recalculations.
      </p>
      
      <div className="demo-section">
        <div className="alert info">
          Open the console to see when calculations run. Type in the input to trigger re-renders.
        </div>
        
        <div className="grid grid-2">
          <div className="card">
            <h4>With useMemo</h4>
            <p>Result: {expensiveValue.toFixed(2)}</p>
            <p><small>Only recalculates when count changes</small></p>
          </div>
          
          <div className="card">
            <h4>Without useMemo</h4>
            <p>Result: {expensiveValueBad.toFixed(2)}</p>
            <p><small>Calculates on every render</small></p>
          </div>
        </div>
        
        <div className="flex">
          <button onClick={() => setCount(count + 1)}>
            Count: {count}
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type to trigger re-renders"
          />
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">Code:</h4>
        <pre><code>{`const ExpensiveCalculationExample = () => {
  const [count, setCount] = useState(0);
  const [input, setInput] = useState('');

  // With useMemo - only recalculates when count changes
  const expensiveValue = useMemo(() => {
    console.log('Calculating...');
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += Math.random();
    }
    return result + count;
  }, [count]); // Dependency array

  return (
    <div>
      <p>Result: {expensiveValue}</p>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
    </div>
  );
};`}</code></pre>
      </div>
    </div>
  );
};

// Filtering example
const FilteringExample = () => {
  const [items] = useState(() => 
    Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      name: \`Item \${i + 1}\`,
      category: ['electronics', 'clothing', 'books', 'home'][Math.floor(Math.random() * 4)],
      price: Math.floor(Math.random() * 1000) + 10
    }))
  );
  
  const [filter, setFilter] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [renderCount, setRenderCount] = useState(0);

  // Memoized filtered and sorted items
  const filteredItems = useMemo(() => {
    console.log('Filtering and sorting items...');
    
    let result = items.filter(item => {
      const matchesFilter = item.name.toLowerCase().includes(filter.toLowerCase());
      const matchesCategory = category === 'all' || item.category === category;
      return matchesFilter && matchesCategory;
    });

    result.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'price') return a.price - b.price;
      return 0;
    });

    return result;
  }, [items, filter, category, sortBy]);

  return (
    <div className="example-container">
      <h2 className="example-title">2. Filtering and Sorting</h2>
      <p className="example-description">
        Memoize expensive filtering and sorting operations on large datasets.
      </p>
      
      <div className="demo-section">
        <div className="grid grid-3">
          <div className="form-group">
            <label>Filter by name:</label>
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search items..."
            />
          </div>
          
          <div className="form-group">
            <label>Category:</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="all">All</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="books">Books</option>
              <option value="home">Home</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="name">Name</option>
              <option value="price">Price</option>
            </select>
          </div>
        </div>
        
        <div className="flex">
          <p><strong>Showing {filteredItems.length} of {items.length} items</strong></p>
          <button onClick={() => setRenderCount(renderCount + 1)}>
            Force Re-render ({renderCount})
          </button>
        </div>
        
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {filteredItems.slice(0, 20).map(item => (
            <div key={item.id} className="card">
              <div className="flex">
                <div style={{ flex: 1 }}>
                  <strong>{item.name}</strong>
                  <p>{item.category} - ${item.price}</p>
                </div>
              </div>
            </div>
          ))}
          {filteredItems.length > 20 && (
            <p className="alert info">
              Showing first 20 items. {filteredItems.length - 20} more available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Object memoization example
const ObjectMemoizationExample = () => {
  const [user, setUser] = useState({ name: 'John', age: 30 });
  const [theme, setTheme] = useState('light');

  // Memoized user stats object
  const userStats = useMemo(() => {
    console.log('Computing user stats...');
    return {
      isAdult: user.age >= 18,
      category: user.age < 13 ? 'child' : user.age < 20 ? 'teen' : 'adult',
      nameLength: user.name.length,
      initials: user.name.split(' ').map(n => n[0]).join('')
    };
  }, [user]); // Only recalculate when user changes

  // Child component that uses the memoized object
  const UserStatsDisplay = memo(({ stats }) => {
    console.log('UserStatsDisplay rendered');
    return (
      <div className="card">
        <h4>User Stats</h4>
        <p><strong>Is Adult:</strong> {stats.isAdult ? 'Yes' : 'No'}</p>
        <p><strong>Category:</strong> {stats.category}</p>
        <p><strong>Name Length:</strong> {stats.nameLength}</p>
        <p><strong>Initials:</strong> {stats.initials}</p>
      </div>
    );
  });

  return (
    <div className="example-container">
      <h2 className="example-title">3. Object Memoization</h2>
      <p className="example-description">
        Memoize objects to prevent unnecessary re-renders of child components.
      </p>
      
      <div className="demo-section">
        <div className="alert info">
          Check console to see when computations and renders occur.
        </div>
        
        <div className="grid grid-2">
          <div>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                value={user.name}
                onChange={(e) => setUser(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div className="form-group">
              <label>Age:</label>
              <input
                type="number"
                value={user.age}
                onChange={(e) => setUser(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                min="0"
              />
            </div>
            
            <div className="form-group">
              <label>Theme (won't affect stats):</label>
              <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </div>
          
          <UserStatsDisplay stats={userStats} />
        </div>
      </div>
    </div>
  );
};

// Dependency example
const DependencyExample = () => {
  const [a, setA] = useState(1);
  const [b, setB] = useState(2);
  const [c, setC] = useState(3);

  // Depends only on a and b
  const sumAB = useMemo(() => {
    console.log('Computing A + B');
    return a + b;
  }, [a, b]);

  // Depends on all three
  const sumABC = useMemo(() => {
    console.log('Computing A + B + C');
    return a + b + c;
  }, [a, b, c]);

  // Complex calculation with multiple dependencies
  const complexCalc = useMemo(() => {
    console.log('Complex calculation');
    return {
      sum: a + b + c,
      product: a * b * c,
      average: (a + b + c) / 3,
      max: Math.max(a, b, c),
      min: Math.min(a, b, c)
    };
  }, [a, b, c]);

  return (
    <div className="example-container">
      <h2 className="example-title">4. Dependencies in useMemo</h2>
      <p className="example-description">
        Understanding how dependencies affect memoization and recalculation.
      </p>
      
      <div className="demo-section">
        <div className="alert info">
          Watch the console to see which calculations run when you change values.
        </div>
        
        <div className="grid grid-3">
          <div className="form-group">
            <label>A:</label>
            <input
              type="number"
              value={a}
              onChange={(e) => setA(parseInt(e.target.value) || 0)}
            />
          </div>
          
          <div className="form-group">
            <label>B:</label>
            <input
              type="number"
              value={b}
              onChange={(e) => setB(parseInt(e.target.value) || 0)}
            />
          </div>
          
          <div className="form-group">
            <label>C:</label>
            <input
              type="number"
              value={c}
              onChange={(e) => setC(parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
        
        <div className="grid grid-2">
          <div className="card">
            <h4>Partial Dependencies</h4>
            <p><strong>A + B:</strong> {sumAB}</p>
            <p><small>Only recalculates when A or B changes</small></p>
          </div>
          
          <div className="card">
            <h4>All Dependencies</h4>
            <p><strong>A + B + C:</strong> {sumABC}</p>
            <p><small>Recalculates when any value changes</small></p>
          </div>
        </div>
        
        <div className="card">
          <h4>Complex Calculation</h4>
          <p><strong>Sum:</strong> {complexCalc.sum}</p>
          <p><strong>Product:</strong> {complexCalc.product}</p>
          <p><strong>Average:</strong> {complexCalc.average.toFixed(2)}</p>
          <p><strong>Max:</strong> {complexCalc.max}</p>
          <p><strong>Min:</strong> {complexCalc.min}</p>
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">Code:</h4>
        <pre><code>{`const DependencyExample = () => {
  const [a, setA] = useState(1);
  const [b, setB] = useState(2);
  const [c, setC] = useState(3);

  // Only depends on a and b
  const sumAB = useMemo(() => {
    console.log('Computing A + B');
    return a + b;
  }, [a, b]); // Only recalculates when a or b changes

  // Depends on all three values
  const sumABC = useMemo(() => {
    console.log('Computing A + B + C');
    return a + b + c;
  }, [a, b, c]); // Recalculates when any value changes

  // Complex calculation
  const complexCalc = useMemo(() => {
    return {
      sum: a + b + c,
      product: a * b * c,
      average: (a + b + c) / 3
    };
  }, [a, b, c]);

  return (
    <div>
      <p>A + B: {sumAB}</p>
      <p>A + B + C: {sumABC}</p>
      <p>Complex: {JSON.stringify(complexCalc)}</p>
    </div>
  );
};`}</code></pre>
      </div>
    </div>
  );
};

export default UseMemoExamples;
