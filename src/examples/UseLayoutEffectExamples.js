import React, { useState, useLayoutEffect, useEffect, useRef } from 'react';

const UseLayoutEffectExamples = () => {
  return (
    <div>
      <h1>useLayoutEffect Hook Examples</h1>
      <p>The useLayoutEffect hook is identical to useEffect, but it fires synchronously after all DOM mutations. Use it when you need to make DOM measurements or mutations before the browser paints.</p>
      
      <ComparisonExample />
      <DOMMeasurementExample />
      <ScrollPositionExample />
      <TooltipExample />
    </div>
  );
};

// Comparison between useEffect and useLayoutEffect
const ComparisonExample = () => {
  const [count, setCount] = useState(0);
  const [layoutCount, setLayoutCount] = useState(0);
  const [effectLogs, setEffectLogs] = useState([]);

  // useEffect - runs asynchronously after paint
  useEffect(() => {
    const log = `useEffect: count = ${count}, time = ${Date.now()}`;
    console.log(log);
    setEffectLogs(prev => [...prev.slice(-4), log]);
  }, [count]);

  // useLayoutEffect - runs synchronously before paint
  useLayoutEffect(() => {
    const log = `useLayoutEffect: layoutCount = ${layoutCount}, time = ${Date.now()}`;
    console.log(log);
    setEffectLogs(prev => [...prev.slice(-4), log]);
  }, [layoutCount]);

  return (
    <div className="example-container">
      <h2 className="example-title">1. useEffect vs useLayoutEffect Timing</h2>
      <p className="example-description">
        Compare the execution timing of useEffect and useLayoutEffect.
      </p>
      
      <div className="demo-section">
        <div className="alert info">
          Check the console to see the execution order. useLayoutEffect runs before useEffect.
        </div>
        
        <div className="grid grid-2">
          <div className="card">
            <h4>useEffect (Async)</h4>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>
              Increment useEffect Count
            </button>
            <p><small>Runs asynchronously after paint</small></p>
          </div>
          
          <div className="card">
            <h4>useLayoutEffect (Sync)</h4>
            <p>Count: {layoutCount}</p>
            <button onClick={() => setLayoutCount(layoutCount + 1)}>
              Increment useLayoutEffect Count
            </button>
            <p><small>Runs synchronously before paint</small></p>
          </div>
        </div>
        
        <div className="card">
          <h4>Execution Logs (Last 5):</h4>
          <div style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
            {effectLogs.map((log, index) => (
              <div key={index}>{log}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">Code:</h4>
        <pre><code>{`const ComparisonExample = () => {
  const [count, setCount] = useState(0);

  // useEffect - runs asynchronously after paint
  useEffect(() => {
    console.log('useEffect: count =', count);
  }, [count]);

  // useLayoutEffect - runs synchronously before paint
  useLayoutEffect(() => {
    console.log('useLayoutEffect: count =', count);
  }, [count]);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
};`}</code></pre>
      </div>
    </div>
  );
};

// DOM measurement example
const DOMMeasurementExample = () => {
  const [text, setText] = useState('Short text');
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const textRef = useRef(null);

  // useLayoutEffect to measure DOM before paint
  useLayoutEffect(() => {
    if (textRef.current) {
      const rect = textRef.current.getBoundingClientRect();
      setDimensions({
        width: Math.round(rect.width),
        height: Math.round(rect.height)
      });
      setPosition({
        x: Math.round(rect.left),
        y: Math.round(rect.top)
      });
    }
  }, [text]);

  const textOptions = [
    'Short text',
    'This is a medium length text that should be wider',
    'This is a very long text that will definitely take up more space and might even wrap to multiple lines depending on the container width and the text length itself'
  ];

  return (
    <div className="example-container">
      <h2 className="example-title">2. DOM Measurements</h2>
      <p className="example-description">
        Use useLayoutEffect to measure DOM elements before the browser paints.
      </p>
      
      <div className="demo-section">
        <div className="form-group">
          <label>Select text length:</label>
          <select value={text} onChange={(e) => setText(e.target.value)}>
            {textOptions.map((option, index) => (
              <option key={index} value={option}>
                Option {index + 1}
              </option>
            ))}
          </select>
        </div>
        
        <div className="card">
          <p 
            ref={textRef}
            style={{ 
              border: '2px solid #007bff',
              padding: '1rem',
              borderRadius: '4px',
              backgroundColor: '#f8f9fa'
            }}
          >
            {text}
          </p>
        </div>
        
        <div className="grid grid-2">
          <div className="card">
            <h4>Dimensions</h4>
            <p><strong>Width:</strong> {dimensions.width}px</p>
            <p><strong>Height:</strong> {dimensions.height}px</p>
          </div>
          
          <div className="card">
            <h4>Position</h4>
            <p><strong>X:</strong> {position.x}px</p>
            <p><strong>Y:</strong> {position.y}px</p>
          </div>
        </div>
        
        <div className="alert info">
          The measurements update synchronously before the browser paints, preventing visual flicker.
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">Code:</h4>
        <pre><code>{`const DOMMeasurementExample = () => {
  const [text, setText] = useState('Short text');
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const textRef = useRef(null);

  // useLayoutEffect to measure DOM before paint
  useLayoutEffect(() => {
    if (textRef.current) {
      const rect = textRef.current.getBoundingClientRect();
      setDimensions({
        width: Math.round(rect.width),
        height: Math.round(rect.height)
      });
    }
  }, [text]);

  return (
    <div>
      <p ref={textRef}>{text}</p>
      <p>Width: {dimensions.width}px</p>
      <p>Height: {dimensions.height}px</p>
      <select value={text} onChange={(e) => setText(e.target.value)}>
        <option value="Short">Short</option>
        <option value="Long text here">Long</option>
      </select>
    </div>
  );
};`}</code></pre>
      </div>
    </div>
  );
};

// Scroll position example
const ScrollPositionExample = () => {
  const [items] = useState(() => 
    Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`)
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef(null);
  const itemRefs = useRef([]);

  // useLayoutEffect to scroll to selected item before paint
  useLayoutEffect(() => {
    if (containerRef.current && itemRefs.current[selectedIndex]) {
      const container = containerRef.current;
      const selectedItem = itemRefs.current[selectedIndex];
      
      const containerRect = container.getBoundingClientRect();
      const itemRect = selectedItem.getBoundingClientRect();
      
      // Calculate if item is visible
      const isItemVisible = 
        itemRect.top >= containerRect.top &&
        itemRect.bottom <= containerRect.bottom;
      
      if (!isItemVisible) {
        // Scroll to center the selected item
        const containerCenter = container.clientHeight / 2;
        const itemCenter = selectedItem.offsetTop + selectedItem.clientHeight / 2;
        container.scrollTop = itemCenter - containerCenter;
      }
    }
  }, [selectedIndex]);

  return (
    <div className="example-container">
      <h2 className="example-title">3. Scroll Position Management</h2>
      <p className="example-description">
        Use useLayoutEffect to manage scroll position before the browser paints.
      </p>
      
      <div className="demo-section">
        <div className="flex">
          <button 
            onClick={() => setSelectedIndex(Math.max(0, selectedIndex - 1))}
            disabled={selectedIndex === 0}
          >
            Previous
          </button>
          <span>Selected: {items[selectedIndex]} (Index: {selectedIndex})</span>
          <button 
            onClick={() => setSelectedIndex(Math.min(items.length - 1, selectedIndex + 1))}
            disabled={selectedIndex === items.length - 1}
          >
            Next
          </button>
        </div>
        
        <div className="flex">
          <button onClick={() => setSelectedIndex(0)}>First</button>
          <button onClick={() => setSelectedIndex(Math.floor(items.length / 2))}>Middle</button>
          <button onClick={() => setSelectedIndex(items.length - 1)}>Last</button>
        </div>
        
        <div 
          ref={containerRef}
          style={{
            height: '300px',
            overflowY: 'auto',
            border: '1px solid #ccc',
            borderRadius: '4px',
            marginTop: '1rem'
          }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              ref={(el) => itemRefs.current[index] = el}
              style={{
                padding: '1rem',
                borderBottom: '1px solid #eee',
                backgroundColor: index === selectedIndex ? '#007bff' : 'white',
                color: index === selectedIndex ? 'white' : 'black',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedIndex(index)}
            >
              {item}
            </div>
          ))}
        </div>
        
        <div className="alert info">
          The scroll position updates immediately without visual flicker when you navigate.
        </div>
      </div>
    </div>
  );
};

// Tooltip positioning example
const TooltipExample = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [tooltipText, setTooltipText] = useState('');
  const buttonRef = useRef(null);
  const tooltipRef = useRef(null);

  // useLayoutEffect to position tooltip before paint
  useLayoutEffect(() => {
    if (showTooltip && buttonRef.current && tooltipRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      let top = buttonRect.top - tooltipRect.height - 10;
      let left = buttonRect.left + (buttonRect.width / 2) - (tooltipRect.width / 2);
      
      // Adjust if tooltip goes off screen
      if (top < 0) {
        top = buttonRect.bottom + 10;
      }
      
      if (left < 0) {
        left = 10;
      } else if (left + tooltipRect.width > window.innerWidth) {
        left = window.innerWidth - tooltipRect.width - 10;
      }
      
      setTooltipPosition({ top, left });
    }
  }, [showTooltip, tooltipText]);

  const showTooltipHandler = (text, event) => {
    buttonRef.current = event.target;
    setTooltipText(text);
    setShowTooltip(true);
  };

  const hideTooltipHandler = () => {
    setShowTooltip(false);
  };

  return (
    <div className="example-container">
      <h2 className="example-title">4. Tooltip Positioning</h2>
      <p className="example-description">
        Use useLayoutEffect to position tooltips accurately before the browser paints.
      </p>
      
      <div className="demo-section">
        <div className="grid grid-3">
          <button
            onMouseEnter={(e) => showTooltipHandler('This is the first button tooltip', e)}
            onMouseLeave={hideTooltipHandler}
          >
            Hover me (1)
          </button>
          
          <button
            onMouseEnter={(e) => showTooltipHandler('This is a longer tooltip text that might need repositioning', e)}
            onMouseLeave={hideTooltipHandler}
          >
            Hover me (2)
          </button>
          
          <button
            onMouseEnter={(e) => showTooltipHandler('Short tip', e)}
            onMouseLeave={hideTooltipHandler}
          >
            Hover me (3)
          </button>
        </div>
        
        <div style={{ height: '100px', margin: '2rem 0' }}>
          <div className="grid grid-3">
            <button
              onMouseEnter={(e) => showTooltipHandler('Bottom left tooltip', e)}
              onMouseLeave={hideTooltipHandler}
            >
              Bottom Left
            </button>
            
            <button
              onMouseEnter={(e) => showTooltipHandler('Bottom center tooltip with more text', e)}
              onMouseLeave={hideTooltipHandler}
            >
              Bottom Center
            </button>
            
            <button
              onMouseEnter={(e) => showTooltipHandler('Bottom right', e)}
              onMouseLeave={hideTooltipHandler}
            >
              Bottom Right
            </button>
          </div>
        </div>
        
        {showTooltip && (
          <div
            ref={tooltipRef}
            style={{
              position: 'fixed',
              top: tooltipPosition.top,
              left: tooltipPosition.left,
              backgroundColor: '#333',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              fontSize: '0.875rem',
              zIndex: 1000,
              maxWidth: '200px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
            }}
          >
            {tooltipText}
          </div>
        )}
        
        <div className="alert info">
          Tooltips are positioned accurately without flicker, even when they need to be repositioned to stay on screen.
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">Code:</h4>
        <pre><code>{`const TooltipExample = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const tooltipRef = useRef(null);

  // useLayoutEffect to position tooltip before paint
  useLayoutEffect(() => {
    if (showTooltip && buttonRef.current && tooltipRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      let top = buttonRect.top - tooltipRect.height - 10;
      let left = buttonRect.left + (buttonRect.width / 2) - (tooltipRect.width / 2);
      
      // Adjust if tooltip goes off screen
      if (top < 0) {
        top = buttonRect.bottom + 10;
      }
      
      setTooltipPosition({ top, left });
    }
  }, [showTooltip]);

  return (
    <div>
      <button
        ref={buttonRef}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        Hover me
      </button>
      
      {showTooltip && (
        <div
          ref={tooltipRef}
          style={{
            position: 'fixed',
            top: tooltipPosition.top,
            left: tooltipPosition.left,
            backgroundColor: '#333',
            color: 'white',
            padding: '0.5rem',
            borderRadius: '4px'
          }}
        >
          Tooltip text
        </div>
      )}
    </div>
  );
};`}</code></pre>
      </div>
    </div>
  );
};

export default UseLayoutEffectExamples;
