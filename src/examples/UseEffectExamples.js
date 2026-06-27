import React, { useState, useEffect } from 'react';

const UseEffectExamples = () => {
  return (
    <div>
      <h1>useEffect Hook Examples</h1>
      <p>The useEffect hook lets you perform side effects in functional components. It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount combined.</p>
      
      <BasicEffect />
      <EffectWithDependencies />
      <EffectWithCleanup />
      <DataFetchingExample />
      <TimerExample />
      <WindowSizeTracker />
      <MultipleEffects />
      <ConditionalEffect />
    </div>
  );
};

// Basic effect example
const BasicEffect = () => {
  const [count, setCount] = useState(0);

  // Effect runs after every render
  useEffect(() => {
    document.title = `Count: ${count}`;
    console.log('Effect ran, count is:', count);
  });

  return (
    <div className="example-container">
      <h2 className="example-title">1. Basic Effect (No Dependencies)</h2>
      <p className="example-description">
        Effect runs after every render. Check the browser tab title and console.
      </p>
      
      <div className="demo-section">
        <h3>Count: {count}</h3>
        <button onClick={() => setCount(count + 1)}>Increment</button>
        <button onClick={() => setCount(count - 1)}>Decrement</button>
        <p className="alert info">
          Check the browser tab title - it updates with the count!
        </p>
      </div>

      <div className="code-section">
        <h4 className="code-title">Code:</h4>
        <pre><code>{`const BasicEffect = () => {
  const [count, setCount] = useState(0);

  // Effect runs after every render
  useEffect(() => {
    document.title = \`Count: \${count}\`;
    console.log('Effect ran, count is:', count);
  });

  return (
    <div>
      <h3>Count: {count}</h3>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};`}</code></pre>
      </div>
    </div>
  );
};

// Effect with dependencies
const EffectWithDependencies = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  const [effectRuns, setEffectRuns] = useState(0);

  // Effect only runs when count changes
  useEffect(() => {
    console.log('Count effect ran:', count);
    setEffectRuns(prev => prev + 1);
  }, [count]); // Only re-run when count changes

  // Effect runs only once (empty dependency array)
  useEffect(() => {
    console.log('Component mounted');
  }, []); // Empty array means run once on mount

  return (
    <div className="example-container">
      <h2 className="example-title">2. Effect with Dependencies</h2>
      <p className="example-description">
        Control when effects run by specifying dependencies. Empty array means run once on mount.
      </p>
      
      <div className="demo-section">
        <div className="grid grid-2">
          <div>
            <h4>Count: {count}</h4>
            <button onClick={() => setCount(count + 1)}>Increment Count</button>
            <button onClick={() => setCount(count - 1)}>Decrement Count</button>
            
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Type your name"
              />
            </div>
          </div>
          
          <div className="card">
            <h4>Effect Information:</h4>
            <p><strong>Count:</strong> {count}</p>
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Count effect runs:</strong> {effectRuns}</p>
            <p className="alert info">
              The effect only runs when count changes, not when name changes!
            </p>
          </div>
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">Code:</h4>
        <pre><code>{`const EffectWithDependencies = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  // Effect only runs when count changes
  useEffect(() => {
    console.log('Count effect ran:', count);
  }, [count]); // Dependency array

  // Effect runs only once on mount
  useEffect(() => {
    console.log('Component mounted');
  }, []); // Empty dependency array

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name (won't trigger count effect)"
      />
    </div>
  );
};`}</code></pre>
      </div>
    </div>
  );
};

// Effect with cleanup
const EffectWithCleanup = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let intervalId;

    if (isRunning) {
      intervalId = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }

    // Cleanup function
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        console.log('Timer cleaned up');
      }
    };
  }, [isRunning]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  return (
    <div className="example-container">
      <h2 className="example-title">3. Effect with Cleanup</h2>
      <p className="example-description">
        Return a cleanup function from useEffect to prevent memory leaks and cancel subscriptions.
      </p>
      
      <div className="demo-section">
        <div className="card">
          <h3>Timer: {seconds}s</h3>
          <div className="flex">
            <button onClick={toggleTimer}>
              {isRunning ? 'Stop' : 'Start'} Timer
            </button>
            <button onClick={resetTimer} className="secondary">Reset</button>
          </div>
          <p className="alert info">
            Check console to see cleanup messages when stopping the timer.
          </p>
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">Code:</h4>
        <pre><code>{`const EffectWithCleanup = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let intervalId;

    if (isRunning) {
      intervalId = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }

    // Cleanup function - runs when effect is cleaned up
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        console.log('Timer cleaned up');
      }
    };
  }, [isRunning]); // Re-run when isRunning changes

  return (
    <div>
      <h3>Timer: {seconds}s</h3>
      <button onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? 'Stop' : 'Start'} Timer
      </button>
    </div>
  );
};`}</code></pre>
      </div>
    </div>
  );
};

// Data fetching example
const DataFetchingExample = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(1);

  useEffect(() => {
    let cancelled = false;

    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        
        const data = await response.json();
        
        // Only update state if component is still mounted
        if (!cancelled) {
          setPosts(data);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    fetchPosts();

    // Cleanup function to prevent state updates if component unmounts
    return () => {
      cancelled = true;
    };
  }, [userId]); // Re-fetch when userId changes

  return (
    <div className="example-container">
      <h2 className="example-title">4. Data Fetching</h2>
      <p className="example-description">
        Fetch data when component mounts or when dependencies change. Handle loading states and cleanup.
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

        {loading && <div className="loading">Loading posts...</div>}
        
        {error && (
          <div className="alert danger">
            Error: {error}
          </div>
        )}

        {!loading && !error && (
          <div>
            <h4>Posts by User {userId} ({posts.length} posts):</h4>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {posts.map(post => (
                <div key={post.id} className="card">
                  <h5>{post.title}</h5>
                  <p>{post.body.substring(0, 100)}...</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="code-section">
        <h4 className="code-title">Code:</h4>
        <pre><code>{`const DataFetchingExample = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(1);

  useEffect(() => {
    let cancelled = false;

    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(\`/api/posts?userId=\${userId}\`);
        const data = await response.json();
        
        // Only update if component is still mounted
        if (!cancelled) {
          setPosts(data);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    fetchPosts();

    // Cleanup to prevent memory leaks
    return () => {
      cancelled = true;
    };
  }, [userId]); // Re-fetch when userId changes

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {posts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
};`}</code></pre>
      </div>
    </div>
  );
};

// Timer example with multiple intervals
const TimerExample = () => {
  const [time, setTime] = useState(new Date());
  const [isActive, setIsActive] = useState(true);

  // Update time every second
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  // Log when component mounts and unmounts
  useEffect(() => {
    console.log('Timer component mounted');
    
    return () => {
      console.log('Timer component will unmount');
    };
  }, []);

  return (
    <div className="example-container">
      <h2 className="example-title">5. Timer with Multiple Effects</h2>
      <p className="example-description">
        Multiple useEffect hooks for different concerns: time updates and lifecycle logging.
      </p>
      
      <div className="demo-section">
        <div className="card">
          <h3>Current Time:</h3>
          <h2 style={{ fontFamily: 'monospace', color: isActive ? '#28a745' : '#6c757d' }}>
            {time.toLocaleTimeString()}
          </h2>
          <button onClick={() => setIsActive(!isActive)}>
            {isActive ? 'Stop' : 'Start'} Clock
          </button>
          <p className="alert info">
            Check console for mount/unmount messages.
          </p>
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">Code:</h4>
        <pre><code>{`const TimerExample = () => {
  const [time, setTime] = useState(new Date());
  const [isActive, setIsActive] = useState(true);

  // Effect for updating time
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  // Effect for lifecycle logging
  useEffect(() => {
    console.log('Timer component mounted');
    
    return () => {
      console.log('Timer component will unmount');
    };
  }, []); // Empty array = run once

  return (
    <div>
      <h2>{time.toLocaleTimeString()}</h2>
      <button onClick={() => setIsActive(!isActive)}>
        {isActive ? 'Stop' : 'Start'} Clock
      </button>
    </div>
  );
};`}</code></pre>
      </div>
    </div>
  );
};

// Window size tracker
const WindowSizeTracker = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty dependency array - set up listener once

  return (
    <div className="example-container">
      <h2 className="example-title">6. Window Size Tracker</h2>
      <p className="example-description">
        Track window resize events with proper cleanup to prevent memory leaks.
      </p>
      
      <div className="demo-section">
        <div className="card">
          <h4>Current Window Size:</h4>
          <p><strong>Width:</strong> {windowSize.width}px</p>
          <p><strong>Height:</strong> {windowSize.height}px</p>
          <p><strong>Aspect Ratio:</strong> {(windowSize.width / windowSize.height).toFixed(2)}</p>
          <p className="alert info">
            Try resizing your browser window to see the values update!
          </p>
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">Code:</h4>
        <pre><code>{`const WindowSizeTracker = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup function removes the listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty array - run once on mount

  return (
    <div>
      <p>Width: {windowSize.width}px</p>
      <p>Height: {windowSize.height}px</p>
    </div>
  );
};`}</code></pre>
      </div>
    </div>
  );
};

// Multiple effects example
const MultipleEffects = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  const [posts, setPosts] = useState([]);

  // Effect 1: Update document title
  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);

  // Effect 2: Log name changes
  useEffect(() => {
    if (name) {
      console.log(`Name changed to: ${name}`);
    }
  }, [name]);

  // Effect 3: Fetch posts on mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=3');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      }
    };

    fetchPosts();
  }, []);

  // Effect 4: Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('Component is unmounting');
    };
  }, []);

  return (
    <div className="example-container">
      <h2 className="example-title">7. Multiple Effects</h2>
      <p className="example-description">
        Separate concerns by using multiple useEffect hooks for different side effects.
      </p>
      
      <div className="demo-section">
        <div className="grid grid-2">
          <div>
            <div className="form-group">
              <label>Count: {count}</label>
              <button onClick={() => setCount(count + 1)}>Increment</button>
            </div>
            
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
          </div>
          
          <div>
            <h4>Sample Posts:</h4>
            {posts.map(post => (
              <div key={post.id} className="card">
                <strong>{post.title}</strong>
              </div>
            ))}
          </div>
        </div>
        
        <div className="alert info">
          Each interaction triggers different effects. Check console and browser title!
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">Code:</h4>
        <pre><code>{`const MultipleEffects = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  const [posts, setPosts] = useState([]);

  // Effect 1: Update document title when count changes
  useEffect(() => {
    document.title = \`Count: \${count}\`;
  }, [count]);

  // Effect 2: Log name changes
  useEffect(() => {
    if (name) {
      console.log(\`Name changed to: \${name}\`);
    }
  }, [name]);

  // Effect 3: Fetch data on mount only
  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(setPosts);
  }, []);

  // Effect 4: Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('Component is unmounting');
    };
  }, []);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
      <input
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

// Conditional effect example
const ConditionalEffect = () => {
  const [shouldFetch, setShouldFetch] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!shouldFetch) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setData({ message: 'Data loaded!', timestamp: new Date().toISOString() });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [shouldFetch]);

  return (
    <div className="example-container">
      <h2 className="example-title">8. Conditional Effects</h2>
      <p className="example-description">
        Use early returns in effects to conditionally run side effects based on state or props.
      </p>
      
      <div className="demo-section">
        <div className="flex flex-column">
          <button onClick={() => setShouldFetch(!shouldFetch)}>
            {shouldFetch ? 'Stop Fetching' : 'Start Fetching'}
          </button>
          
          {loading && <div className="loading">Loading data...</div>}
          
          {data && (
            <div className="card">
              <h4>Fetched Data:</h4>
              <p><strong>Message:</strong> {data.message}</p>
              <p><strong>Timestamp:</strong> {data.timestamp}</p>
            </div>
          )}
          
          <div className="alert info">
            The effect only runs when shouldFetch is true. Toggle it to see the conditional behavior.
          </div>
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">Code:</h4>
        <pre><code>{`const ConditionalEffect = () => {
  const [shouldFetch, setShouldFetch] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Early return if condition not met
    if (!shouldFetch) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/data');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [shouldFetch]); // Effect runs when shouldFetch changes

  return (
    <div>
      <button onClick={() => setShouldFetch(!shouldFetch)}>
        {shouldFetch ? 'Stop' : 'Start'} Fetching
      </button>
      {loading && <div>Loading...</div>}
      {data && <div>{data.message}</div>}
    </div>
  );
};`}</code></pre>
      </div>
    </div>
  );
};

export default UseEffectExamples;
