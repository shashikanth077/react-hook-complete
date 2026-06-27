import React, { useState, useDeferredValue, useMemo } from 'react';

const UseDeferredValueExamples = () => {
  return (
    <div>
      <h1>useDeferredValue Hook Examples (React 18)</h1>
      <p>The useDeferredValue hook defers updates to a value, allowing more urgent updates to be processed first. It's useful for keeping expensive computations from blocking the UI.</p>
      
      <BasicExample />
      <SearchExample />
      <ChartExample />
      <ListExample />
    </div>
  );
};

// Basic useDeferredValue example
const BasicExample = () => {
  const [input, setInput] = useState('');
  const deferredInput = useDeferredValue(input);

  return (
    <div className="example-container">
      <h2 className="example-title">1. Basic useDeferredValue</h2>
      <p className="example-description">
        Compare immediate vs deferred values to see how deferring can improve responsiveness.
      </p>
      
      <div className="demo-section">
        <div className="form-group">
          <label>Type something:</label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Start typing..."
          />
        </div>
        
        <div className="grid grid-2">
          <div className="card">
            <h4>Immediate Value</h4>
            <p>"{input}"</p>
            <p><small>Updates immediately as you type</small></p>
          </div>
          
          <div className="card">
            <h4>Deferred Value</h4>
            <p>"{deferredInput}"</p>
            <p><small>Updates after urgent updates are processed</small></p>
            {input !== deferredInput && (
              <p className="alert warning">Value is deferred...</p>
            )}
          </div>
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">Code:</h4>
        <pre><code>{`const BasicExample = () => {
  const [input, setInput] = useState('');
  const deferredInput = useDeferredValue(input);

  return (
    <div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type something..."
      />
      
      <div>
        <p>Immediate: "{input}"</p>
        <p>Deferred: "{deferredInput}"</p>
        {input !== deferredInput && <p>Value is deferred...</p>}
      </div>
    </div>
  );
};`}</code></pre>
      </div>
    </div>
  );
};

// Search with deferred value
const SearchExample = () => {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  // Simulate expensive search operation
  const searchResults = useMemo(() => {
    if (!deferredQuery) return [];
    
    console.log('Performing search for:', deferredQuery);
    
    // Simulate large dataset
    const data = Array.from({ length: 10000 }, (_, i) => ({
      id: i,
      title: `Result ${i + 1}`,
      description: `This is result number ${i + 1} for your search`,
      category: ['tech', 'science', 'art', 'music'][Math.floor(Math.random() * 4)],
      relevance: Math.random()
    }));
    
    return data
      .filter(item => 
        item.title.toLowerCase().includes(deferredQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(deferredQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(deferredQuery.toLowerCase())
      )
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 100);
  }, [deferredQuery]);

  const isStale = query !== deferredQuery;

  return (
    <div className="example-container">
      <h2 className="example-title">2. Search with Deferred Value</h2>
      <p className="example-description">
        Keep the search input responsive while deferring expensive search operations.
      </p>
      
      <div className="demo-section">
        <div className="form-group">
          <label>Search (10,000 items):</label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search..."
          />
        </div>
        
        <div className="card">
          <div className="flex">
            <h4>Search Results ({searchResults.length} found)</h4>
            {isStale && <span className="loading">Updating...</span>}
          </div>
          
          {deferredQuery && (
            <p><strong>Searching for:</strong> "{deferredQuery}"</p>
          )}
          
          <div 
            style={{ 
              maxHeight: '400px', 
              overflowY: 'auto',
              opacity: isStale ? 0.6 : 1,
              transition: 'opacity 0.2s'
            }}
          >
            {searchResults.map(result => (
              <div key={result.id} className="card">
                <h5>{result.title}</h5>
                <p>{result.description}</p>
                <p><span className="badge">{result.category}</span></p>
              </div>
            ))}
            
            {deferredQuery && searchResults.length === 0 && (
              <p className="alert info">No results found for "{deferredQuery}"</p>
            )}
          </div>
        </div>
        
        <div className="alert info">
          Notice how the input stays responsive even during expensive searches. Check the console to see when searches are performed.
        </div>
      </div>
    </div>
  );
};

// Chart rendering example
const ChartExample = () => {
  const [dataPoints, setDataPoints] = useState(100);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const deferredDataPoints = useDeferredValue(dataPoints);
  const deferredAnimationSpeed = useDeferredValue(animationSpeed);

  // Generate chart data
  const chartData = useMemo(() => {
    console.log('Generating chart data for', deferredDataPoints, 'points');
    
    return Array.from({ length: deferredDataPoints }, (_, i) => ({
      x: i,
      y: Math.sin(i * 0.1) * 50 + Math.random() * 20 + 50,
      color: `hsl(${(i / deferredDataPoints) * 360}, 70%, 50%)`
    }));
  }, [deferredDataPoints]);

  const isStale = dataPoints !== deferredDataPoints || animationSpeed !== deferredAnimationSpeed;

  return (
    <div className="example-container">
      <h2 className="example-title">3. Chart Rendering</h2>
      <p className="example-description">
        Defer expensive chart rendering while keeping controls responsive.
      </p>
      
      <div className="demo-section">
        <div className="grid grid-2">
          <div className="form-group">
            <label>Data Points: {dataPoints}</label>
            <input
              type="range"
              min="50"
              max="2000"
              value={dataPoints}
              onChange={(e) => setDataPoints(parseInt(e.target.value))}
            />
          </div>
          
          <div className="form-group">
            <label>Animation Speed: {animationSpeed}x</label>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
            />
          </div>
        </div>
        
        <div className="card">
          <div className="flex">
            <h4>Chart ({chartData.length} points)</h4>
            {isStale && <span className="loading">Updating chart...</span>}
          </div>
          
          <div 
            style={{
              position: 'relative',
              height: '300px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              overflow: 'hidden',
              backgroundColor: '#f8f9fa',
              opacity: isStale ? 0.6 : 1,
              transition: 'opacity 0.2s'
            }}
          >
            <svg width="100%" height="100%" viewBox="0 0 800 300">
              {/* Grid lines */}
              {Array.from({ length: 11 }, (_, i) => (
                <line
                  key={`h-${i}`}
                  x1="0"
                  y1={i * 30}
                  x2="800"
                  y2={i * 30}
                  stroke="#e0e0e0"
                  strokeWidth="1"
                />
              ))}
              {Array.from({ length: 17 }, (_, i) => (
                <line
                  key={`v-${i}`}
                  x1={i * 50}
                  y1="0"
                  x2={i * 50}
                  y2="300"
                  stroke="#e0e0e0"
                  strokeWidth="1"
                />
              ))}
              
              {/* Data points */}
              {chartData.map((point, i) => (
                <circle
                  key={i}
                  cx={(point.x / Math.max(chartData.length - 1, 1)) * 800}
                  cy={300 - (point.y / 100) * 300}
                  r="3"
                  fill={point.color}
                  style={{
                    animation: `pulse ${2 / deferredAnimationSpeed}s infinite alternate`
                  }}
                />
              ))}
              
              {/* Connect points with lines */}
              {chartData.length > 1 && (
                <polyline
                  points={chartData.map((point, i) => 
                    `${(point.x / (chartData.length - 1)) * 800},${300 - (point.y / 100) * 300}`
                  ).join(' ')}
                  fill="none"
                  stroke="#007bff"
                  strokeWidth="2"
                  opacity="0.7"
                />
              )}
            </svg>
          </div>
        </div>
        
        <div className="alert info">
          The sliders remain responsive while the expensive chart rendering is deferred. Check the console to see when chart data is regenerated.
        </div>
        
        <style jsx>{`
          @keyframes pulse {
            from { opacity: 0.6; }
            to { opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
};

// Large list example
const ListExample = () => {
  const [filter, setFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const deferredFilter = useDeferredValue(filter);
  const deferredSortOrder = useDeferredValue(sortOrder);

  // Generate large dataset
  const rawData = useMemo(() => {
    return Array.from({ length: 5000 }, (_, i) => ({
      id: i,
      name: `Item ${i + 1}`,
      category: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
      value: Math.floor(Math.random() * 1000),
      description: `Description for item ${i + 1}`,
      tags: [`tag${i % 10}`, `category${i % 5}`]
    }));
  }, []);

  // Process data with deferred values
  const processedData = useMemo(() => {
    console.log('Processing data with filter:', deferredFilter, 'sort:', deferredSortOrder);
    
    let result = [...rawData];
    
    // Apply filter
    if (deferredFilter) {
      result = result.filter(item =>
        item.name.toLowerCase().includes(deferredFilter.toLowerCase()) ||
        item.category.toLowerCase().includes(deferredFilter.toLowerCase()) ||
        item.description.toLowerCase().includes(deferredFilter.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(deferredFilter.toLowerCase()))
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      const multiplier = deferredSortOrder === 'asc' ? 1 : -1;
      return (a.name.localeCompare(b.name)) * multiplier;
    });
    
    return result;
  }, [rawData, deferredFilter, deferredSortOrder]);

  const isStale = filter !== deferredFilter || sortOrder !== deferredSortOrder;

  return (
    <div className="example-container">
      <h2 className="example-title">4. Large List Processing</h2>
      <p className="example-description">
        Process large datasets without blocking the UI controls.
      </p>
      
      <div className="demo-section">
        <div className="grid grid-2">
          <div className="form-group">
            <label>Filter:</label>
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter 5000 items..."
            />
          </div>
          
          <div className="form-group">
            <label>Sort Order:</label>
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
        
        <div className="card">
          <div className="flex">
            <h4>Results ({processedData.length} of {rawData.length})</h4>
            {isStale && <span className="loading">Processing...</span>}
          </div>
          
          <div 
            style={{ 
              maxHeight: '400px', 
              overflowY: 'auto',
              opacity: isStale ? 0.6 : 1,
              transition: 'opacity 0.2s'
            }}
          >
            {processedData.slice(0, 100).map(item => (
              <div key={item.id} className="card">
                <div className="flex">
                  <div style={{ flex: 1 }}>
                    <strong>{item.name}</strong>
                    <p>Category: {item.category} | Value: {item.value}</p>
                    <p><small>{item.description}</small></p>
                    <div>
                      {item.tags.map(tag => (
                        <span key={tag} className="badge" style={{ marginRight: '0.25rem' }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {processedData.length > 100 && (
              <p className="alert info">
                Showing first 100 of {processedData.length} results
              </p>
            )}
            
            {processedData.length === 0 && deferredFilter && (
              <p className="alert info">
                No items match the filter "{deferredFilter}"
              </p>
            )}
          </div>
        </div>
        
        <div className="alert info">
          The controls stay responsive while the expensive filtering and sorting operations are deferred. Check the console to see when processing occurs.
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">Code:</h4>
        <pre><code>{`const ListExample = () => {
  const [filter, setFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const deferredFilter = useDeferredValue(filter);
  const deferredSortOrder = useDeferredValue(sortOrder);

  const rawData = useMemo(() => {
    return Array.from({ length: 5000 }, (_, i) => ({
      id: i,
      name: \`Item \${i + 1}\`,
      category: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
      value: Math.floor(Math.random() * 1000)
    }));
  }, []);

  const processedData = useMemo(() => {
    console.log('Processing data...');
    
    let result = [...rawData];
    
    // Apply filter with deferred value
    if (deferredFilter) {
      result = result.filter(item =>
        item.name.toLowerCase().includes(deferredFilter.toLowerCase())
      );
    }
    
    // Apply sorting with deferred value
    result.sort((a, b) => {
      const multiplier = deferredSortOrder === 'asc' ? 1 : -1;
      return (a.name.localeCompare(b.name)) * multiplier;
    });
    
    return result;
  }, [rawData, deferredFilter, deferredSortOrder]);

  const isStale = filter !== deferredFilter || sortOrder !== deferredSortOrder;

  return (
    <div>
      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter..."
      />
      
      <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
      
      {isStale && <div>Processing...</div>}
      
      <div style={{ opacity: isStale ? 0.6 : 1 }}>
        {processedData.map(item => (
          <div key={item.id}>{item.name}</div>
        ))}
      </div>
    </div>
  );
};`}</code></pre>
      </div>
    </div>
  );
};

export default UseDeferredValueExamples;
