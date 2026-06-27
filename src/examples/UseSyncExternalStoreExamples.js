import React, { useSyncExternalStore, useState } from 'react';

const UseSyncExternalStoreExamples = () => {
  return (
    <div>
      <h1>useSyncExternalStore Hook Examples (React 18)</h1>
      <p>The useSyncExternalStore hook lets you subscribe to external stores. It's useful for integrating with third-party state management libraries or browser APIs.</p>
      
      <WindowSizeExample />
      <OnlineStatusExample />
      <LocalStorageExample />
      <CustomStoreExample />
    </div>
  );
};

// Window size store
const createWindowSizeStore = () => {
  let listeners = [];
  let size = { width: window.innerWidth, height: window.innerHeight };

  const getSnapshot = () => size;

  const subscribe = (callback) => {
    listeners.push(callback);
    
    const handleResize = () => {
      size = { width: window.innerWidth, height: window.innerHeight };
      listeners.forEach(listener => listener());
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      listeners = listeners.filter(l => l !== callback);
      if (listeners.length === 0) {
        window.removeEventListener('resize', handleResize);
      }
    };
  };

  return { getSnapshot, subscribe };
};

const windowSizeStore = createWindowSizeStore();

const WindowSizeExample = () => {
  const windowSize = useSyncExternalStore(
    windowSizeStore.subscribe,
    windowSizeStore.getSnapshot
  );

  return (
    <div className="example-container">
      <h2 className="example-title">1. Window Size Store</h2>
      <p className="example-description">
        Subscribe to window resize events using an external store.
      </p>
      
      <div className="demo-section">
        <div className="card">
          <h4>Current Window Size</h4>
          <p><strong>Width:</strong> {windowSize.width}px</p>
          <p><strong>Height:</strong> {windowSize.height}px</p>
          <p><strong>Aspect Ratio:</strong> {(windowSize.width / windowSize.height).toFixed(2)}</p>
          
          <div className="alert info">
            Resize your browser window to see the values update automatically!
          </div>
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">Code:</h4>
        <pre><code>{`// Create external store
const createWindowSizeStore = () => {
  let listeners = [];
  let size = { width: window.innerWidth, height: window.innerHeight };

  const getSnapshot = () => size;

  const subscribe = (callback) => {
    listeners.push(callback);
    
    const handleResize = () => {
      size = { width: window.innerWidth, height: window.innerHeight };
      listeners.forEach(listener => listener());
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      listeners = listeners.filter(l => l !== callback);
      window.removeEventListener('resize', handleResize);
    };
  };

  return { getSnapshot, subscribe };
};

const windowSizeStore = createWindowSizeStore();

// Use in component
const WindowSizeExample = () => {
  const windowSize = useSyncExternalStore(
    windowSizeStore.subscribe,
    windowSizeStore.getSnapshot
  );

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

// Online status store
const createOnlineStatusStore = () => {
  let listeners = [];
  
  const getSnapshot = () => navigator.onLine;

  const subscribe = (callback) => {
    listeners.push(callback);
    
    const handleOnline = () => listeners.forEach(listener => listener());
    const handleOffline = () => listeners.forEach(listener => listener());

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      listeners = listeners.filter(l => l !== callback);
      if (listeners.length === 0) {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
    };
  };

  return { getSnapshot, subscribe };
};

const onlineStatusStore = createOnlineStatusStore();

const OnlineStatusExample = () => {
  const isOnline = useSyncExternalStore(
    onlineStatusStore.subscribe,
    onlineStatusStore.getSnapshot
  );

  return (
    <div className="example-container">
      <h2 className="example-title">2. Online Status Store</h2>
      <p className="example-description">
        Track the browser's online/offline status using an external store.
      </p>
      
      <div className="demo-section">
        <div className="card">
          <h4>Connection Status</h4>
          <div className="flex">
            <div 
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: isOnline ? '#28a745' : '#dc3545',
                marginRight: '10px'
              }}
            />
            <span style={{ 
              fontSize: '1.2rem',
              color: isOnline ? '#28a745' : '#dc3545',
              fontWeight: 'bold'
            }}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
          
          <div className="alert info" style={{ marginTop: '1rem' }}>
            Try disconnecting your internet connection to see the status change!
            (You can simulate this in Chrome DevTools → Network → Offline)
          </div>
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">Code:</h4>
        <pre><code>{`const createOnlineStatusStore = () => {
  let listeners = [];
  
  const getSnapshot = () => navigator.onLine;

  const subscribe = (callback) => {
    listeners.push(callback);
    
    const handleOnline = () => listeners.forEach(listener => listener());
    const handleOffline = () => listeners.forEach(listener => listener());

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      listeners = listeners.filter(l => l !== callback);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  };

  return { getSnapshot, subscribe };
};

const onlineStatusStore = createOnlineStatusStore();

const OnlineStatusExample = () => {
  const isOnline = useSyncExternalStore(
    onlineStatusStore.subscribe,
    onlineStatusStore.getSnapshot
  );

  return (
    <div>
      <p>Status: {isOnline ? 'Online' : 'Offline'}</p>
    </div>
  );
};`}</code></pre>
      </div>
    </div>
  );
};

// LocalStorage store
const createLocalStorageStore = (key, initialValue) => {
  let listeners = [];
  
  const getSnapshot = () => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  };

  const setValue = (value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      listeners.forEach(listener => listener());
    } catch (error) {
      console.error('Error setting localStorage:', error);
    }
  };

  const subscribe = (callback) => {
    listeners.push(callback);
    
    const handleStorageChange = (e) => {
      if (e.key === key) {
        listeners.forEach(listener => listener());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      listeners = listeners.filter(l => l !== callback);
      if (listeners.length === 0) {
        window.removeEventListener('storage', handleStorageChange);
      }
    };
  };

  return { getSnapshot, subscribe, setValue };
};

const LocalStorageExample = () => {
  const userPrefsStore = createLocalStorageStore('userPrefs', {
    theme: 'light',
    language: 'en',
    notifications: true
  });

  const userPrefs = useSyncExternalStore(
    userPrefsStore.subscribe,
    userPrefsStore.getSnapshot
  );

  const updatePreference = (key, value) => {
    const newPrefs = { ...userPrefs, [key]: value };
    userPrefsStore.setValue(newPrefs);
  };

  return (
    <div className="example-container">
      <h2 className="example-title">3. LocalStorage Store</h2>
      <p className="example-description">
        Sync component state with localStorage using an external store.
      </p>
      
      <div className="demo-section">
        <div className="grid grid-2">
          <div className="card">
            <h4>User Preferences</h4>
            
            <div className="form-group">
              <label>Theme:</label>
              <select 
                value={userPrefs.theme}
                onChange={(e) => updatePreference('theme', e.target.value)}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Language:</label>
              <select 
                value={userPrefs.language}
                onChange={(e) => updatePreference('language', e.target.value)}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={userPrefs.notifications}
                  onChange={(e) => updatePreference('notifications', e.target.checked)}
                />
                Enable notifications
              </label>
            </div>
          </div>
          
          <div className="card">
            <h4>Current Preferences</h4>
            <pre>{JSON.stringify(userPrefs, null, 2)}</pre>
            
            <div className="alert info">
              These preferences are stored in localStorage and will persist across page refreshes!
            </div>
          </div>
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">Code:</h4>
        <pre><code>{`const createLocalStorageStore = (key, initialValue) => {
  let listeners = [];
  
  const getSnapshot = () => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  };

  const setValue = (value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      listeners.forEach(listener => listener());
    } catch (error) {
      console.error('Error setting localStorage:', error);
    }
  };

  const subscribe = (callback) => {
    listeners.push(callback);
    
    const handleStorageChange = (e) => {
      if (e.key === key) {
        listeners.forEach(listener => listener());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      listeners = listeners.filter(l => l !== callback);
      window.removeEventListener('storage', handleStorageChange);
    };
  };

  return { getSnapshot, subscribe, setValue };
};

const LocalStorageExample = () => {
  const store = createLocalStorageStore('userPrefs', { theme: 'light' });
  
  const userPrefs = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot
  );

  return (
    <div>
      <p>Theme: {userPrefs.theme}</p>
      <button onClick={() => store.setValue({ 
        ...userPrefs, 
        theme: userPrefs.theme === 'light' ? 'dark' : 'light' 
      })}>
        Toggle Theme
      </button>
    </div>
  );
};`}</code></pre>
      </div>
    </div>
  );
};

// Custom store example
const createCounterStore = () => {
  let listeners = [];
  let state = { count: 0, step: 1 };

  const getSnapshot = () => state;

  const subscribe = (callback) => {
    listeners.push(callback);
    return () => {
      listeners = listeners.filter(l => l !== callback);
    };
  };

  const increment = () => {
    state = { ...state, count: state.count + state.step };
    listeners.forEach(listener => listener());
  };

  const decrement = () => {
    state = { ...state, count: state.count - state.step };
    listeners.forEach(listener => listener());
  };

  const setStep = (step) => {
    state = { ...state, step };
    listeners.forEach(listener => listener());
  };

  const reset = () => {
    state = { count: 0, step: 1 };
    listeners.forEach(listener => listener());
  };

  return { getSnapshot, subscribe, increment, decrement, setStep, reset };
};

const counterStore = createCounterStore();

// Multiple components using the same store
const CounterDisplay = () => {
  const { count, step } = useSyncExternalStore(
    counterStore.subscribe,
    counterStore.getSnapshot
  );

  return (
    <div className="card">
      <h4>Counter Display</h4>
      <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{count}</p>
      <p>Step size: {step}</p>
    </div>
  );
};

const CounterControls = () => {
  const { step } = useSyncExternalStore(
    counterStore.subscribe,
    counterStore.getSnapshot
  );

  return (
    <div className="card">
      <h4>Counter Controls</h4>
      <div className="flex">
        <button onClick={counterStore.increment}>
          +{step}
        </button>
        <button onClick={counterStore.decrement}>
          -{step}
        </button>
        <button onClick={counterStore.reset} className="secondary">
          Reset
        </button>
      </div>
      
      <div className="form-group">
        <label>Step size:</label>
        <input
          type="number"
          value={step}
          onChange={(e) => counterStore.setStep(parseInt(e.target.value) || 1)}
          min="1"
        />
      </div>
    </div>
  );
};

const CustomStoreExample = () => {
  return (
    <div className="example-container">
      <h2 className="example-title">4. Custom Store with Multiple Components</h2>
      <p className="example-description">
        Create a custom store that can be shared between multiple components.
      </p>
      
      <div className="demo-section">
        <div className="grid grid-2">
          <CounterDisplay />
          <CounterControls />
        </div>
        
        <div className="alert info">
          Both components are connected to the same external store. Changes in one component automatically update the other!
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">Code:</h4>
        <pre><code>{`const createCounterStore = () => {
  let listeners = [];
  let state = { count: 0, step: 1 };

  const getSnapshot = () => state;

  const subscribe = (callback) => {
    listeners.push(callback);
    return () => {
      listeners = listeners.filter(l => l !== callback);
    };
  };

  const increment = () => {
    state = { ...state, count: state.count + state.step };
    listeners.forEach(listener => listener());
  };

  const decrement = () => {
    state = { ...state, count: state.count - state.step };
    listeners.forEach(listener => listener());
  };

  return { getSnapshot, subscribe, increment, decrement };
};

const counterStore = createCounterStore();

// Component 1
const CounterDisplay = () => {
  const { count } = useSyncExternalStore(
    counterStore.subscribe,
    counterStore.getSnapshot
  );

  return <div>Count: {count}</div>;
};

// Component 2
const CounterControls = () => {
  return (
    <div>
      <button onClick={counterStore.increment}>+</button>
      <button onClick={counterStore.decrement}>-</button>
    </div>
  );
};`}</code></pre>
      </div>
    </div>
  );
};

export default UseSyncExternalStoreExamples;
