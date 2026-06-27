import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

const AdvancedCustomHooks = () => {
  return (
    <div>
      <h1>Advanced Custom Hooks Examples</h1>
      <p>Explore sophisticated custom hooks for complex use cases in modern React applications.</p>
      
      <UseAsyncExample />
      <UseIntersectionObserverExample />
      <UseWebSocketExample />
      <UseMediaQueryExample />
      <UseKeyPressExample />
      <UseScrollPositionExample />
      <UsePreviousExample />
      <UseThrottleExample />
      <UseWindowSizeExample />
      <UseClipboardExample />
    </div>
  );
};

// Advanced Custom Hook 1: useAsync for complex async operations
const useAsync = (asyncFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastCallId, setLastCallId] = useState(0);

  const execute = useCallback(async (...args) => {
    const callId = Date.now();
    setLastCallId(callId);
    setLoading(true);
    setError(null);
    
    try {
      const result = await asyncFunction(...args);
      
      // Only update state if this is the most recent call
      if (callId >= lastCallId) {
        setData(result);
      }
      return result;
    } catch (err) {
      if (callId >= lastCallId) {
        setError(err);
      }
      throw err;
    } finally {
      if (callId >= lastCallId) {
        setLoading(false);
      }
    }
  }, [...dependencies, lastCallId]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
};

const UseAsyncExample = () => {
  const [userId, setUserId] = useState(1);
  const [delay, setDelay] = useState(1000);

  const fetchUser = useCallback(async (id, delayMs) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, delayMs));
    
    if (Math.random() < 0.2) {
      throw new Error('Random network error occurred');
    }
    
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }, []);

  const { data: user, loading, error, execute, reset } = useAsync(fetchUser, [fetchUser]);

  const handleFetchUser = () => {
    execute(userId, delay);
  };

  return (
    <div className="example-container">
      <h2 className="example-title">1. useAsync Hook - Advanced Async Operations</h2>
      <p className="example-description">
        Advanced async hook with race condition prevention, error handling, and manual execution control.
      </p>
      
      <div className="demo-section">
        <div className="form-group">
          <label>User ID (1-10):</label>
          <input
            type="number"
            min="1"
            max="10"
            value={userId}
            onChange={(e) => setUserId(parseInt(e.target.value) || 1)}
          />
        </div>

        <div className="form-group">
          <label>Simulated Delay (ms):</label>
          <input
            type="number"
            min="0"
            max="5000"
            step="500"
            value={delay}
            onChange={(e) => setDelay(parseInt(e.target.value) || 1000)}
          />
        </div>

        <div className="flex">
          <button onClick={handleFetchUser} disabled={loading}>
            {loading ? 'Loading...' : 'Fetch User'}
          </button>
          <button onClick={reset} className="secondary">
            Reset
          </button>
        </div>

        {loading && (
          <div className="loading">
            Fetching user {userId} with {delay}ms delay...
          </div>
        )}

        {error && (
          <div className="alert danger">
            <strong>Error:</strong> {error.message}
            <br />
            <small>Try again or change the user ID</small>
          </div>
        )}

        {user && !loading && (
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
        <h4 className="code-title">Advanced useAsync Hook:</h4>
        <pre><code>{`const useAsync = (asyncFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastCallId, setLastCallId] = useState(0);

  const execute = useCallback(async (...args) => {
    const callId = Date.now();
    setLastCallId(callId);
    setLoading(true);
    setError(null);
    
    try {
      const result = await asyncFunction(...args);
      
      // Prevent race conditions
      if (callId >= lastCallId) {
        setData(result);
      }
      return result;
    } catch (err) {
      if (callId >= lastCallId) {
        setError(err);
      }
      throw err;
    } finally {
      if (callId >= lastCallId) {
        setLoading(false);
      }
    }
  }, [...dependencies, lastCallId]);

  return { data, loading, error, execute };
};`}</code></pre>
      </div>
    </div>
  );
};

// Advanced Custom Hook 2: useIntersectionObserver
const useIntersectionObserver = (
  elementRef,
  options = {
    threshold: 0,
    root: null,
    rootMargin: '0%'
  }
) => {
  const [entry, setEntry] = useState(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = elementRef?.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setEntry(entry);
        setIsIntersecting(entry.isIntersecting);
      },
      options
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [elementRef, options.threshold, options.root, options.rootMargin]);

  return { entry, isIntersecting };
};

const UseIntersectionObserverExample = () => {
  const [threshold, setThreshold] = useState(0.5);
  const [rootMargin, setRootMargin] = useState('0px');
  const targetRef = useRef();
  
  const { entry, isIntersecting } = useIntersectionObserver(targetRef, {
    threshold,
    rootMargin
  });

  return (
    <div className="example-container">
      <h2 className="example-title">2. useIntersectionObserver Hook</h2>
      <p className="example-description">
        Detect when elements enter or leave the viewport, perfect for lazy loading and animations.
      </p>
      
      <div className="demo-section">
        <div className="form-group">
          <label>Threshold (0-1):</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={threshold}
            onChange={(e) => setThreshold(parseFloat(e.target.value))}
          />
          <span>{threshold}</span>
        </div>

        <div className="form-group">
          <label>Root Margin:</label>
          <select value={rootMargin} onChange={(e) => setRootMargin(e.target.value)}>
            <option value="0px">0px</option>
            <option value="50px">50px</option>
            <option value="100px">100px</option>
            <option value="-50px">-50px</option>
          </select>
        </div>

        <div className="alert info">
          <strong>Status:</strong> Target is {isIntersecting ? 'VISIBLE' : 'HIDDEN'}
          {entry && (
            <>
              <br />
              <strong>Intersection Ratio:</strong> {(entry.intersectionRatio * 100).toFixed(1)}%
            </>
          )}
        </div>

        <div style={{ height: '300px', overflow: 'auto', border: '2px solid #ddd', padding: '1rem' }}>
          <div style={{ height: '200px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            Scroll down to see the target element
          </div>
          
          <div 
            ref={targetRef}
            style={{
              height: '150px',
              background: isIntersecting ? '#4CAF50' : '#f44336',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '20px 0',
              transition: 'all 0.3s ease',
              transform: isIntersecting ? 'scale(1.05)' : 'scale(1)'
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <h3>Target Element</h3>
              <p>{isIntersecting ? 'I am visible!' : 'I am hidden!'}</p>
            </div>
          </div>
          
          <div style={{ height: '200px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            More content below
          </div>
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">useIntersectionObserver Hook:</h4>
        <pre><code>{`const useIntersectionObserver = (elementRef, options = {}) => {
  const [entry, setEntry] = useState(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = elementRef?.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setEntry(entry);
        setIsIntersecting(entry.isIntersecting);
      },
      options
    );

    observer.observe(element);
    return () => observer.unobserve(element);
  }, [elementRef, options.threshold, options.root, options.rootMargin]);

  return { entry, isIntersecting };
};

// Usage
const targetRef = useRef();
const { isIntersecting } = useIntersectionObserver(targetRef, {
  threshold: 0.5,
  rootMargin: '50px'
});`}</code></pre>
      </div>
    </div>
  );
};

// Advanced Custom Hook 3: useWebSocket
const useWebSocket = (url, options = {}) => {
  const [socket, setSocket] = useState(null);
  const [lastMessage, setLastMessage] = useState(null);
  const [readyState, setReadyState] = useState(WebSocket.CONNECTING);
  const [messageHistory, setMessageHistory] = useState([]);

  const {
    onOpen,
    onClose,
    onMessage,
    onError,
    shouldReconnect = false,
    reconnectAttempts = 3,
    reconnectInterval = 3000
  } = options;

  const reconnectCount = useRef(0);
  const reconnectTimeout = useRef(null);

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(url);
      
      ws.onopen = (event) => {
        setReadyState(WebSocket.OPEN);
        reconnectCount.current = 0;
        onOpen?.(event);
      };

      ws.onclose = (event) => {
        setReadyState(WebSocket.CLOSED);
        onClose?.(event);

        if (shouldReconnect && reconnectCount.current < reconnectAttempts) {
          reconnectTimeout.current = setTimeout(() => {
            reconnectCount.current += 1;
            connect();
          }, reconnectInterval);
        }
      };

      ws.onmessage = (event) => {
        const message = {
          data: event.data,
          timestamp: new Date().toISOString()
        };
        setLastMessage(message);
        setMessageHistory(prev => [...prev.slice(-9), message]); // Keep last 10 messages
        onMessage?.(message);
      };

      ws.onerror = (event) => {
        onError?.(event);
      };

      setSocket(ws);
    } catch (err) {
      console.error('WebSocket connection error:', err);
    }
  }, [url, onOpen, onClose, onMessage, onError, shouldReconnect, reconnectAttempts, reconnectInterval]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      socket?.close();
    };
  }, [connect]);

  const sendMessage = useCallback((message) => {
    if (socket && readyState === WebSocket.OPEN) {
      socket.send(typeof message === 'string' ? message : JSON.stringify(message));
    }
  }, [socket, readyState]);

  const disconnect = useCallback(() => {
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
    }
    socket?.close();
  }, [socket]);

  return {
    socket,
    lastMessage,
    messageHistory,
    readyState,
    sendMessage,
    disconnect,
    reconnectCount: reconnectCount.current
  };
};

const UseWebSocketExample = () => {
  const [url, setUrl] = useState('wss://echo.websocket.org');
  const [message, setMessage] = useState('');
  const [shouldReconnect, setShouldReconnect] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const {
    lastMessage,
    messageHistory,
    readyState,
    sendMessage,
    disconnect,
    reconnectCount
  } = useWebSocket(url, {
    onOpen: () => setIsConnected(true),
    onClose: () => setIsConnected(false),
    shouldReconnect,
    reconnectAttempts: 3,
    reconnectInterval: 2000
  });

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };

  const getReadyStateString = (state) => {
    switch (state) {
      case WebSocket.CONNECTING: return 'CONNECTING';
      case WebSocket.OPEN: return 'OPEN';
      case WebSocket.CLOSING: return 'CLOSING';
      case WebSocket.CLOSED: return 'CLOSED';
      default: return 'UNKNOWN';
    }
  };

  return (
    <div className="example-container">
      <h2 className="example-title">3. useWebSocket Hook</h2>
      <p className="example-description">
        Real-time WebSocket connection management with reconnection logic and message history.
      </p>
      
      <div className="demo-section">
        <div className="form-group">
          <label>WebSocket URL:</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="wss://echo.websocket.org"
          />
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={shouldReconnect}
              onChange={(e) => setShouldReconnect(e.target.checked)}
            />
            Enable Auto-Reconnect
          </label>
        </div>

        <div className="alert info">
          <strong>Status:</strong> {getReadyStateString(readyState)}
          {shouldReconnect && reconnectCount > 0 && (
            <span> (Reconnect attempts: {reconnectCount})</span>
          )}
        </div>

        <div className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={readyState !== WebSocket.OPEN}
          />
          <button 
            onClick={handleSendMessage} 
            disabled={readyState !== WebSocket.OPEN || !message.trim()}
          >
            Send
          </button>
          <button onClick={disconnect} className="secondary">
            Disconnect
          </button>
        </div>

        {messageHistory.length > 0 && (
          <div>
            <h4>Message History:</h4>
            <div style={{ 
              maxHeight: '200px', 
              overflow: 'auto', 
              border: '1px solid #ddd', 
              padding: '0.5rem',
              background: '#f9f9f9'
            }}>
              {messageHistory.map((msg, index) => (
                <div key={index} style={{ padding: '0.25rem 0', borderBottom: '1px solid #eee' }}>
                  <small style={{ color: '#666' }}>{msg.timestamp}</small>
                  <div>{msg.data}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="code-section">
        <h4 className="code-title">useWebSocket Hook:</h4>
        <pre><code>{`const useWebSocket = (url, options = {}) => {
  const [socket, setSocket] = useState(null);
  const [lastMessage, setLastMessage] = useState(null);
  const [readyState, setReadyState] = useState(WebSocket.CONNECTING);
  const [messageHistory, setMessageHistory] = useState([]);

  const connect = useCallback(() => {
    const ws = new WebSocket(url);
    
    ws.onopen = (event) => {
      setReadyState(WebSocket.OPEN);
      options.onOpen?.(event);
    };

    ws.onmessage = (event) => {
      const message = {
        data: event.data,
        timestamp: new Date().toISOString()
      };
      setLastMessage(message);
      setMessageHistory(prev => [...prev.slice(-9), message]);
    };

    setSocket(ws);
  }, [url, options]);

  const sendMessage = useCallback((message) => {
    if (socket && readyState === WebSocket.OPEN) {
      socket.send(typeof message === 'string' ? message : JSON.stringify(message));
    }
  }, [socket, readyState]);

  return { lastMessage, messageHistory, readyState, sendMessage };
};`}</code></pre>
      </div>
    </div>
  );
};

// Advanced Custom Hook 4: useMediaQuery
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    const handler = (event) => setMatches(event.matches);

    mediaQuery.addListener(handler);
    setMatches(mediaQuery.matches);

    return () => mediaQuery.removeListener(handler);
  }, [query]);

  return matches;
};

const UseMediaQueryExample = () => {
  const isSmall = useMediaQuery('(max-width: 768px)');
  const isMedium = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  const isLarge = useMediaQuery('(min-width: 1025px)');
  const isDark = useMediaQuery('(prefers-color-scheme: dark)');
  const isReduced = useMediaQuery('(prefers-reduced-motion: reduce)');

  const getCurrentBreakpoint = () => {
    if (isSmall) return 'Small (≤768px)';
    if (isMedium) return 'Medium (769px-1024px)';
    if (isLarge) return 'Large (≥1025px)';
    return 'Unknown';
  };

  return (
    <div className="example-container">
      <h2 className="example-title">4. useMediaQuery Hook</h2>
      <p className="example-description">
        Responsive design made easy with CSS media query detection in JavaScript.
      </p>
      
      <div className="demo-section">
        <div className="grid grid-2">
          <div className="card">
            <h4>Screen Size Detection</h4>
            <p><strong>Current Breakpoint:</strong> {getCurrentBreakpoint()}</p>
            <div style={{ fontSize: isSmall ? '14px' : isMedium ? '16px' : '18px' }}>
              This text size changes based on screen size!
            </div>
          </div>

          <div className="card">
            <h4>System Preferences</h4>
            <p><strong>Dark Mode:</strong> {isDark ? 'Enabled' : 'Disabled'}</p>
            <p><strong>Reduced Motion:</strong> {isReduced ? 'Enabled' : 'Disabled'}</p>
          </div>
        </div>

        <div 
          className="card"
          style={{
            background: isDark ? '#2d3748' : '#f7fafc',
            color: isDark ? 'white' : 'black',
            transform: isSmall ? 'scale(0.9)' : 'scale(1)',
            transition: isReduced ? 'none' : 'all 0.3s ease'
          }}
        >
          <h4>Responsive Component</h4>
          <p>This component adapts to:</p>
          <ul>
            <li>Screen size (scaling and layout)</li>
            <li>Color scheme preference (background/text color)</li>
            <li>Motion preference (animations)</li>
          </ul>
          <p>Resize your window or change system preferences to see the changes!</p>
        </div>

        <div className="alert info">
          <strong>Current Media Queries:</strong>
          <br />• Small: {isSmall ? '✅' : '❌'} <code>(max-width: 768px)</code>
          <br />• Medium: {isMedium ? '✅' : '❌'} <code>(min-width: 769px) and (max-width: 1024px)</code>
          <br />• Large: {isLarge ? '✅' : '❌'} <code>(min-width: 1025px)</code>
          <br />• Dark Mode: {isDark ? '✅' : '❌'} <code>(prefers-color-scheme: dark)</code>
          <br />• Reduced Motion: {isReduced ? '✅' : '❌'} <code>(prefers-reduced-motion: reduce)</code>
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">useMediaQuery Hook:</h4>
        <pre><code>{`const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    const handler = (event) => setMatches(event.matches);

    mediaQuery.addListener(handler);
    setMatches(mediaQuery.matches);

    return () => mediaQuery.removeListener(handler);
  }, [query]);

  return matches;
};

// Usage
const isSmall = useMediaQuery('(max-width: 768px)');
const isDark = useMediaQuery('(prefers-color-scheme: dark)');`}</code></pre>
      </div>
    </div>
  );
};

// Advanced Custom Hook 5: useKeyPress
const useKeyPress = (targetKey, options = {}) => {
  const [keyPressed, setKeyPressed] = useState(false);
  const { 
    event = 'keydown',
    target = window,
    preventDefault = false,
    stopPropagation = false 
  } = options;

  useEffect(() => {
    const downHandler = (e) => {
      if (e.key === targetKey) {
        if (preventDefault) e.preventDefault();
        if (stopPropagation) e.stopPropagation();
        setKeyPressed(true);
      }
    };

    const upHandler = (e) => {
      if (e.key === targetKey) {
        setKeyPressed(false);
      }
    };

    if (event === 'keydown' || event === 'both') {
      target.addEventListener('keydown', downHandler);
    }
    if (event === 'keyup' || event === 'both') {
      target.addEventListener('keyup', upHandler);
    }

    return () => {
      if (event === 'keydown' || event === 'both') {
        target.removeEventListener('keydown', downHandler);
      }
      if (event === 'keyup' || event === 'both') {
        target.removeEventListener('keyup', upHandler);
      }
    };
  }, [targetKey, event, target, preventDefault, stopPropagation]);

  return keyPressed;
};

const UseKeyPressExample = () => {
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);

  const spacePressed = useKeyPress(' ', { preventDefault: true });
  const enterPressed = useKeyPress('Enter');
  const escapePressed = useKeyPress('Escape');
  const arrowUpPressed = useKeyPress('ArrowUp');
  const arrowDownPressed = useKeyPress('ArrowDown');
  const arrowLeftPressed = useKeyPress('ArrowLeft');
  const arrowRightPressed = useKeyPress('ArrowRight');

  useEffect(() => {
    if (spacePressed && gameActive) {
      setScore(s => s + 1);
    }
  }, [spacePressed, gameActive]);

  useEffect(() => {
    if (enterPressed) {
      setGameActive(true);
      setScore(0);
    }
  }, [enterPressed]);

  useEffect(() => {
    if (escapePressed) {
      setGameActive(false);
    }
  }, [escapePressed]);

  const getArrowStatus = () => {
    const arrows = [];
    if (arrowUpPressed) arrows.push('↑');
    if (arrowDownPressed) arrows.push('↓');
    if (arrowLeftPressed) arrows.push('←');
    if (arrowRightPressed) arrows.push('→');
    return arrows.length > 0 ? arrows.join(' ') : 'None';
  };

  return (
    <div className="example-container">
      <h2 className="example-title">5. useKeyPress Hook</h2>
      <p className="example-description">
        Detect and respond to keyboard input with customizable options and multiple key support.
      </p>
      
      <div className="demo-section">
        <div className="card">
          <h4>Simple Space Bar Game</h4>
          <p>Press <kbd>Enter</kbd> to start, <kbd>Space</kbd> to score, <kbd>Escape</kbd> to stop</p>
          
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>
              Score: {score}
            </div>
            
            <div style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
              Game Status: {gameActive ? '🎮 ACTIVE' : '⏸️ PAUSED'}
            </div>

            {!gameActive && (
              <div className="alert info">
                Press <kbd>Enter</kbd> to start the game!
              </div>
            )}

            {gameActive && spacePressed && (
              <div style={{ 
                fontSize: '1.5rem', 
                color: '#4CAF50',
                animation: 'pulse 0.3s ease'
              }}>
                🎯 HIT!
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-2">
          <div className="card">
            <h4>Key Status Monitor</h4>
            <div style={{ fontFamily: 'monospace' }}>
              <div>Space: {spacePressed ? '🟢 PRESSED' : '🔴 RELEASED'}</div>
              <div>Enter: {enterPressed ? '🟢 PRESSED' : '🔴 RELEASED'}</div>
              <div>Escape: {escapePressed ? '🟢 PRESSED' : '🔴 RELEASED'}</div>
            </div>
          </div>

          <div className="card">
            <h4>Arrow Keys</h4>
            <div style={{ textAlign: 'center' }}>
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ 
                  padding: '0.5rem',
                  background: arrowUpPressed ? '#4CAF50' : '#f0f0f0',
                  color: arrowUpPressed ? 'white' : 'black',
                  borderRadius: '4px'
                }}>
                  ↑
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <span style={{ 
                  padding: '0.5rem',
                  background: arrowLeftPressed ? '#4CAF50' : '#f0f0f0',
                  color: arrowLeftPressed ? 'white' : 'black',
                  borderRadius: '4px'
                }}>
                  ←
                </span>
                <span style={{ 
                  padding: '0.5rem',
                  background: arrowDownPressed ? '#4CAF50' : '#f0f0f0',
                  color: arrowDownPressed ? 'white' : 'black',
                  borderRadius: '4px'
                }}>
                  ↓
                </span>
                <span style={{ 
                  padding: '0.5rem',
                  background: arrowRightPressed ? '#4CAF50' : '#f0f0f0',
                  color: arrowRightPressed ? 'white' : 'black',
                  borderRadius: '4px'
                }}>
                  →
                </span>
              </div>
              <div>Currently pressed: {getArrowStatus()}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">useKeyPress Hook:</h4>
        <pre><code>{`const useKeyPress = (targetKey, options = {}) => {
  const [keyPressed, setKeyPressed] = useState(false);
  const { 
    event = 'keydown',
    target = window,
    preventDefault = false,
    stopPropagation = false 
  } = options;

  useEffect(() => {
    const downHandler = (e) => {
      if (e.key === targetKey) {
        if (preventDefault) e.preventDefault();
        if (stopPropagation) e.stopPropagation();
        setKeyPressed(true);
      }
    };

    const upHandler = (e) => {
      if (e.key === targetKey) {
        setKeyPressed(false);
      }
    };

    target.addEventListener('keydown', downHandler);
    target.addEventListener('keyup', upHandler);

    return () => {
      target.removeEventListener('keydown', downHandler);
      target.removeEventListener('keyup', upHandler);
    };
  }, [targetKey, event, target, preventDefault, stopPropagation]);

  return keyPressed;
};

// Usage
const spacePressed = useKeyPress(' ', { preventDefault: true });
const enterPressed = useKeyPress('Enter');`}</code></pre>
      </div>
    </div>
  );
};

// Continue with more advanced hooks...
const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState({
    x: 0,
    y: 0
  });

  useEffect(() => {
    const updatePosition = () => {
      setScrollPosition({
        x: window.pageXOffset,
        y: window.pageYOffset
      });
    };

    window.addEventListener('scroll', updatePosition);
    updatePosition();

    return () => window.removeEventListener('scroll', updatePosition);
  }, []);

  return scrollPosition;
};

const UseScrollPositionExample = () => {
  const { x, y } = useScrollPosition();
  const [isVisible, setIsVisible] = useState(true);

  // Hide/show based on scroll direction
  useEffect(() => {
    let lastScrollY = y;
    
    const handleScroll = () => {
      const currentScrollY = window.pageYOffset;
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 10);
      lastScrollY = currentScrollY;
    };

    const timeoutId = setTimeout(handleScroll, 100);
    return () => clearTimeout(timeoutId);
  }, [y]);

  return (
    <div className="example-container">
      <h2 className="example-title">6. useScrollPosition Hook</h2>
      <p className="example-description">
        Track scroll position and create scroll-based interactions and animations.
      </p>
      
      <div className="demo-section">
        <div 
          style={{
            position: 'fixed',
            top: isVisible ? '10px' : '-60px',
            right: '10px',
            background: '#007bff',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            transition: 'top 0.3s ease',
            zIndex: 1000,
            fontSize: '0.9rem'
          }}
        >
          Scroll: X={x}, Y={y}
        </div>

        <div className="card">
          <h4>Scroll Progress</h4>
          <div style={{
            width: '100%',
            height: '20px',
            background: '#f0f0f0',
            borderRadius: '10px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${Math.min((y / (document.body.scrollHeight - window.innerHeight)) * 100, 100)}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #4CAF50, #45a049)',
              transition: 'width 0.1s ease'
            }} />
          </div>
          <p>Scroll progress: {Math.round(Math.min((y / (document.body.scrollHeight - window.innerHeight)) * 100, 100))}%</p>
        </div>

        <div style={{ height: '150vh', background: 'linear-gradient(to bottom, #f0f0f0, #d0d0d0)', padding: '2rem', borderRadius: '8px' }}>
          <h4>Scroll down to see the hook in action!</h4>
          <p>The scroll position is being tracked in real-time.</p>
          <p>Notice how the position indicator in the top-right corner updates as you scroll.</p>
          <p>The progress bar above shows how far you've scrolled through this tall content.</p>
          
          <div style={{ marginTop: '50vh' }}>
            <h4>Middle of the content</h4>
            <p>You're halfway through! Keep scrolling to see more.</p>
          </div>
          
          <div style={{ marginTop: '50vh' }}>
            <h4>End of the content</h4>
            <p>You've reached the bottom! The scroll position tracking works perfectly.</p>
          </div>
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">useScrollPosition Hook:</h4>
        <pre><code>{`const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState({
    x: 0,
    y: 0
  });

  useEffect(() => {
    const updatePosition = () => {
      setScrollPosition({
        x: window.pageXOffset,
        y: window.pageYOffset
      });
    };

    window.addEventListener('scroll', updatePosition);
    updatePosition();

    return () => window.removeEventListener('scroll', updatePosition);
  }, []);

  return scrollPosition;
};

// Usage
const { x, y } = useScrollPosition();

// Calculate scroll progress
const scrollProgress = (y / (document.body.scrollHeight - window.innerHeight)) * 100;`}</code></pre>
      </div>
    </div>
  );
};

const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const UsePreviousExample = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  const previousCount = usePrevious(count);
  const previousName = usePrevious(name);

  return (
    <div className="example-container">
      <h2 className="example-title">7. usePrevious Hook</h2>
      <p className="example-description">
        Access the previous value of state or props, useful for comparisons and animations.
      </p>
      
      <div className="demo-section">
        <div className="grid grid-2">
          <div className="card">
            <h4>Counter with Previous Value</h4>
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                Current: {count}
              </div>
              <div style={{ fontSize: '1.5rem', color: '#666', marginBottom: '1rem' }}>
                Previous: {previousCount ?? 'None'}
              </div>
              <div style={{ marginBottom: '1rem' }}>
                {previousCount !== undefined && (
                  <span style={{ 
                    color: count > previousCount ? '#4CAF50' : count < previousCount ? '#f44336' : '#666' 
                  }}>
                    {count > previousCount ? '📈 Increased' : count < previousCount ? '📉 Decreased' : '➡️ Same'}
                  </span>
                )}
              </div>
              <div className="flex">
                <button onClick={() => setCount(c => c + 1)}>+1</button>
                <button onClick={() => setCount(c => c - 1)}>-1</button>
                <button onClick={() => setCount(0)} className="secondary">Reset</button>
              </div>
            </div>
          </div>

          <div className="card">
            <h4>Name with Previous Value</h4>
            <div className="form-group">
              <label>Enter your name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Type your name..."
              />
            </div>
            
            <div style={{ marginTop: '1rem' }}>
              <div><strong>Current:</strong> "{name}" {name.length > 0 && `(${name.length} chars)`}</div>
              <div><strong>Previous:</strong> "{previousName || ''}" {previousName && `(${previousName.length} chars)`}</div>
              
              {previousName && name !== previousName && (
                <div style={{ 
                  marginTop: '0.5rem', 
                  padding: '0.5rem', 
                  background: '#e3f2fd', 
                  borderRadius: '4px',
                  fontSize: '0.9rem'
                }}>
                  Changed from "{previousName}" to "{name}"
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="card">
          <h4>Animation Example</h4>
          <div 
            style={{
              width: '100px',
              height: '100px',
              background: count % 2 === 0 ? '#4CAF50' : '#2196F3',
              margin: '1rem auto',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.5rem',
              transform: `scale(${1 + (count - (previousCount || 0)) * 0.1})`,
              transition: 'all 0.3s ease'
            }}
          >
            {count}
          </div>
          <p style={{ textAlign: 'center' }}>
            This circle changes color and size based on current vs previous count values
          </p>
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">usePrevious Hook:</h4>
        <pre><code>{`const usePrevious = (value) => {
  const ref = useRef();
  
  useEffect(() => {
    ref.current = value;
  });
  
  return ref.current;
};

// Usage
const [count, setCount] = useState(0);
const previousCount = usePrevious(count);

// Compare current vs previous
if (previousCount !== undefined) {
  if (count > previousCount) {
    console.log('Count increased');
  } else if (count < previousCount) {
    console.log('Count decreased');
  }
}`}</code></pre>
      </div>
    </div>
  );
};

const useThrottle = (value, delay) => {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= delay) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, delay - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return throttledValue;
};

const UseThrottleExample = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollPosition, setScrollPosition] = useState(0);
  
  const throttledMousePosition = useThrottle(mousePosition, 100);
  const throttledScrollPosition = useThrottle(scrollPosition, 50);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollPosition(window.pageYOffset);
    };

    document.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="example-container">
      <h2 className="example-title">8. useThrottle Hook</h2>
      <p className="example-description">
        Throttle rapidly changing values to improve performance and reduce unnecessary updates.
      </p>
      
      <div className="demo-section">
        <div className="grid grid-2">
          <div className="card">
            <h4>Mouse Position (Throttled: 100ms)</h4>
            <div style={{ fontFamily: 'monospace' }}>
              <div><strong>Real-time:</strong> X: {mousePosition.x}, Y: {mousePosition.y}</div>
              <div><strong>Throttled:</strong> X: {throttledMousePosition.x}, Y: {throttledMousePosition.y}</div>
            </div>
            <div style={{ 
              marginTop: '1rem',
              padding: '1rem',
              background: '#f0f0f0',
              borderRadius: '4px',
              minHeight: '100px',
              position: 'relative'
            }}>
              <div 
                style={{
                  position: 'absolute',
                  left: `${(throttledMousePosition.x / window.innerWidth) * 100}%`,
                  top: `${(throttledMousePosition.y / window.innerHeight) * 50}%`,
                  width: '10px',
                  height: '10px',
                  background: '#4CAF50',
                  borderRadius: '50%',
                  transform: 'translate(-50%, -50%)',
                  transition: 'all 0.1s ease'
                }}
              />
              <small>Move your mouse to see the throttled position indicator</small>
            </div>
          </div>

          <div className="card">
            <h4>Scroll Position (Throttled: 50ms)</h4>
            <div style={{ fontFamily: 'monospace' }}>
              <div><strong>Real-time:</strong> {scrollPosition}px</div>
              <div><strong>Throttled:</strong> {throttledScrollPosition}px</div>
            </div>
            <div style={{
              width: '100%',
              height: '20px',
              background: '#f0f0f0',
              borderRadius: '10px',
              overflow: 'hidden',
              marginTop: '1rem'
            }}>
              <div style={{
                width: `${Math.min((throttledScrollPosition / (document.body.scrollHeight - window.innerHeight)) * 100, 100)}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #2196F3, #1976D2)',
                transition: 'width 0.1s ease'
              }} />
            </div>
            <small>Scroll to see the throttled progress bar</small>
          </div>
        </div>

        <div className="card">
          <h4>Performance Comparison</h4>
          <div className="alert info">
            <strong>Without Throttling:</strong> Updates happen on every mouse move/scroll event (potentially hundreds of times per second)
            <br />
            <strong>With Throttling:</strong> Updates are limited to once every 50-100ms, significantly reducing computational load
          </div>
          
          <div style={{ height: '200vh', background: 'linear-gradient(to bottom, #e3f2fd, #bbdefb)', padding: '2rem', borderRadius: '8px', marginTop: '1rem' }}>
            <h4>Scroll through this tall content</h4>
            <p>Notice how the throttled scroll position updates smoothly but not frantically.</p>
            <p>This improves performance while maintaining a good user experience.</p>
            
            <div style={{ marginTop: '50vh' }}>
              <h4>Middle section</h4>
              <p>Throttling is especially important for expensive operations like:</p>
              <ul>
                <li>API calls triggered by scroll/mouse events</li>
                <li>Complex calculations</li>
                <li>DOM manipulations</li>
                <li>Canvas/WebGL rendering</li>
              </ul>
            </div>
            
            <div style={{ marginTop: '100vh' }}>
              <h4>Bottom section</h4>
              <p>The throttled values help prevent performance bottlenecks!</p>
            </div>
          </div>
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">useThrottle Hook:</h4>
        <pre><code>{`const useThrottle = (value, delay) => {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= delay) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, delay - (Date.now() - lastRan.current));

    return () => clearTimeout(handler);
  }, [value, delay]);

  return throttledValue;
};

// Usage
const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
const throttledMousePosition = useThrottle(mousePosition, 100);

useEffect(() => {
  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };
  document.addEventListener('mousemove', handleMouseMove);
  return () => document.removeEventListener('mousemove', handleMouseMove);
}, []);`}</code></pre>
      </div>
    </div>
  );
};

const useWindowSize = () => {
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
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

const UseWindowSizeExample = () => {
  const { width, height } = useWindowSize();

  const getDeviceType = () => {
    if (width < 768) return 'Mobile';
    if (width < 1024) return 'Tablet';
    return 'Desktop';
  };

  const getAspectRatio = () => {
    const ratio = width / height;
    return ratio.toFixed(2);
  };

  return (
    <div className="example-container">
      <h2 className="example-title">9. useWindowSize Hook</h2>
      <p className="example-description">
        Track window dimensions for responsive layouts and conditional rendering.
      </p>
      
      <div className="demo-section">
        <div className="grid grid-2">
          <div className="card">
            <h4>Window Dimensions</h4>
            <div style={{ fontSize: '1.2rem', fontFamily: 'monospace' }}>
              <div><strong>Width:</strong> {width}px</div>
              <div><strong>Height:</strong> {height}px</div>
              <div><strong>Aspect Ratio:</strong> {getAspectRatio()}</div>
            </div>
          </div>

          <div className="card">
            <h4>Device Information</h4>
            <div style={{ fontSize: '1.1rem' }}>
              <div><strong>Device Type:</strong> {getDeviceType()}</div>
              <div><strong>Orientation:</strong> {width > height ? 'Landscape' : 'Portrait'}</div>
              <div><strong>Area:</strong> {(width * height).toLocaleString()} pixels</div>
            </div>
          </div>
        </div>

        <div className="card">
          <h4>Responsive Layout Example</h4>
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: width < 768 
                ? '1fr' 
                : width < 1024 
                  ? 'repeat(2, 1fr)' 
                  : 'repeat(3, 1fr)',
              gap: '1rem',
              marginTop: '1rem'
            }}
          >
            {[1, 2, 3, 4, 5, 6].map(num => (
              <div 
                key={num}
                style={{
                  padding: '1rem',
                  background: `hsl(${num * 60}, 70%, 80%)`,
                  borderRadius: '8px',
                  textAlign: 'center',
                  minHeight: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                Item {num}
              </div>
            ))}
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
            This grid automatically adjusts: 1 column on mobile ({width < 768 ? '✅' : '❌'}), 
            2 columns on tablet ({width >= 768 && width < 1024 ? '✅' : '❌'}), 
            3 columns on desktop ({width >= 1024 ? '✅' : '❌'})
          </p>
        </div>

        <div className="card">
          <h4>Visual Size Indicator</h4>
          <div style={{ 
            width: '100%', 
            height: '200px', 
            background: 'linear-gradient(45deg, #f0f0f0, #d0d0d0)',
            borderRadius: '8px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div 
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: `${Math.min(width / 10, 300)}px`,
                height: `${Math.min(height / 10, 150)}px`,
                background: '#4CAF50',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '0.8rem',
                transition: 'all 0.3s ease'
              }}
            >
              {width}×{height}
            </div>
          </div>
          <p style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.9rem' }}>
            The green rectangle scales with your window size (1:10 ratio)
          </p>
        </div>

        <div className="alert info">
          <strong>Resize your browser window</strong> to see all the responsive changes in real-time!
          <br />Current breakpoints: Mobile (&lt;768px), Tablet (768px-1023px), Desktop (≥1024px)
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">useWindowSize Hook:</h4>
        <pre><code>{`const useWindowSize = () => {
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
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

// Usage
const { width, height } = useWindowSize();

// Responsive logic
const isMobile = width < 768;
const columns = isMobile ? 1 : width < 1024 ? 2 : 3;`}</code></pre>
      </div>
    </div>
  );
};

const useClipboard = () => {
  const [copiedText, setCopiedText] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  const copy = useCallback(async (text) => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported');
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setIsCopied(true);
      
      // Reset after 2 seconds
      setTimeout(() => setIsCopied(false), 2000);
      return true;
    } catch (error) {
      console.warn('Copy failed', error);
      setIsCopied(false);
      return false;
    }
  }, []);

  const paste = useCallback(async () => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported');
      return '';
    }

    try {
      const text = await navigator.clipboard.readText();
      return text;
    } catch (error) {
      console.warn('Paste failed', error);
      return '';
    }
  }, []);

  return { copy, paste, copiedText, isCopied };
};

const UseClipboardExample = () => {
  const { copy, paste, copiedText, isCopied } = useClipboard();
  const [inputText, setInputText] = useState('Hello, this is some sample text to copy!');
  const [pastedText, setPastedText] = useState('');

  const handleCopy = () => {
    copy(inputText);
  };

  const handlePaste = async () => {
    const text = await paste();
    setPastedText(text);
  };

  const codeSnippet = `const useClipboard = () => {
  const [copiedText, setCopiedText] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  const copy = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      return true;
    } catch (error) {
      console.warn('Copy failed', error);
      return false;
    }
  }, []);

  return { copy, paste, copiedText, isCopied };
};`;

  return (
    <div className="example-container">
      <h2 className="example-title">10. useClipboard Hook</h2>
      <p className="example-description">
        Easy clipboard operations with copy/paste functionality and status feedback.
      </p>
      
      <div className="demo-section">
        <div className="grid grid-2">
          <div className="card">
            <h4>Copy to Clipboard</h4>
            <div className="form-group">
              <label>Text to copy:</label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows="3"
                placeholder="Enter text to copy..."
              />
            </div>
            
            <button 
              onClick={handleCopy}
              style={{
                background: isCopied ? '#4CAF50' : '#007bff',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {isCopied ? '✅ Copied!' : '📋 Copy Text'}
            </button>
            
            {copiedText && (
              <div style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                <strong>Last copied:</strong>
                <div style={{ 
                  background: '#f0f0f0', 
                  padding: '0.5rem', 
                  borderRadius: '4px',
                  marginTop: '0.5rem',
                  fontFamily: 'monospace',
                  fontSize: '0.8rem'
                }}>
                  "{copiedText.substring(0, 50)}{copiedText.length > 50 ? '...' : ''}"
                </div>
              </div>
            )}
          </div>

          <div className="card">
            <h4>Paste from Clipboard</h4>
            <button onClick={handlePaste} className="secondary">
              📄 Paste from Clipboard
            </button>
            
            {pastedText && (
              <div style={{ marginTop: '1rem' }}>
                <strong>Pasted content:</strong>
                <div style={{ 
                  background: '#f9f9f9', 
                  padding: '1rem', 
                  borderRadius: '4px',
                  marginTop: '0.5rem',
                  border: '1px solid #ddd',
                  maxHeight: '150px',
                  overflow: 'auto',
                  whiteSpace: 'pre-wrap'
                }}>
                  {pastedText}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <h4>Copy Code Snippet</h4>
          <p>Try copying this code snippet:</p>
          <div style={{ position: 'relative' }}>
            <pre style={{ 
              background: '#f8f9fa', 
              padding: '1rem', 
              borderRadius: '4px',
              overflow: 'auto',
              fontSize: '0.8rem'
            }}>
              <code>{codeSnippet}</code>
            </pre>
            <button 
              onClick={() => copy(codeSnippet)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: isCopied ? '#4CAF50' : '#6c757d',
                color: 'white',
                border: 'none',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              {isCopied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="alert info">
          <strong>Note:</strong> The clipboard API requires HTTPS in production and may prompt for permissions.
          <br />Try copying the text above and then pasting it in a text editor to verify it works!
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">useClipboard Hook:</h4>
        <pre><code>{`const useClipboard = () => {
  const [copiedText, setCopiedText] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  const copy = useCallback(async (text) => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported');
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      return true;
    } catch (error) {
      console.warn('Copy failed', error);
      return false;
    }
  }, []);

  const paste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      return text;
    } catch (error) {
      console.warn('Paste failed', error);
      return '';
    }
  }, []);

  return { copy, paste, copiedText, isCopied };
};

// Usage
const { copy, paste, isCopied } = useClipboard();
const handleCopy = () => copy('Text to copy');`}</code></pre>
      </div>
    </div>
  );
};

export default AdvancedCustomHooks;
