import React, { useState, useContext, createContext } from 'react';

// Theme Context
const ThemeContext = createContext();

// User Context
const UserContext = createContext();

// Settings Context with Provider component
const SettingsContext = createContext();

const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    language: 'en',
    notifications: true,
    darkMode: false
  });

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting }}>
      {children}
    </SettingsContext.Provider>
  );
};

const UseContextExamples = () => {
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState({ name: 'John Doe', role: 'admin' });

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <UserContext.Provider value={{ user, setUser }}>
        <SettingsProvider>
          <div>
            <h1>useContext Hook Examples</h1>
            <p>The useContext hook allows you to consume context values without wrapping components in Consumer components.</p>
            
            <BasicContextExample />
            <NestedContextExample />
            <MultipleContextExample />
            <ContextWithReducerExample />
          </div>
        </SettingsProvider>
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
};

const BasicContextExample = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <div className="example-container">
      <h2 className="example-title">1. Basic Context Usage</h2>
      <p className="example-description">
        Access context values directly without Consumer components.
      </p>
      
      <div className="demo-section" style={{
        backgroundColor: theme === 'dark' ? '#2d3748' : '#f7fafc',
        color: theme === 'dark' ? 'white' : 'black',
        transition: 'all 0.3s'
      }}>
        <h3>Current Theme: {theme}</h3>
        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
        </button>
      </div>

      <div className="code-section">
        <h4 className="code-title">Code:</h4>
        <pre><code>{`// Create context
const ThemeContext = createContext();

// Provider component
<ThemeContext.Provider value={{ theme, setTheme }}>
  <ChildComponent />
</ThemeContext.Provider>

// Consumer component
const ChildComponent = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  
  return (
    <div style={{ backgroundColor: theme === 'dark' ? '#333' : '#fff' }}>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </button>
    </div>
  );
};`}</code></pre>
      </div>
    </div>
  );
};

const NestedContextExample = () => {
  const { user } = useContext(UserContext);
  const { settings, updateSetting } = useContext(SettingsContext);

  return (
    <div className="example-container">
      <h2 className="example-title">2. Nested Context Access</h2>
      <p className="example-description">
        Access multiple contexts in deeply nested components.
      </p>
      
      <div className="demo-section">
        <div className="grid grid-2">
          <div className="card">
            <h4>User Information</h4>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Role:</strong> {user.role}</p>
          </div>
          
          <div className="card">
            <h4>User Settings</h4>
            <div className="form-group">
              <label>Language:</label>
              <select 
                value={settings.language}
                onChange={(e) => updateSetting('language', e.target.value)}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={(e) => updateSetting('notifications', e.target.checked)}
                />
                Enable notifications
              </label>
            </div>
            
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={settings.darkMode}
                  onChange={(e) => updateSetting('darkMode', e.target.checked)}
                />
                Dark mode
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MultipleContextExample = () => {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(UserContext);
  const { settings } = useContext(SettingsContext);

  return (
    <div className="example-container">
      <h2 className="example-title">3. Multiple Context Consumer</h2>
      <p className="example-description">
        Component that consumes multiple contexts simultaneously.
      </p>
      
      <div className="demo-section">
        <div className="card" style={{
          backgroundColor: settings.darkMode ? '#2d3748' : '#f7fafc',
          color: settings.darkMode ? 'white' : 'black'
        }}>
          <h4>Combined Context Data</h4>
          <p><strong>Theme:</strong> {theme}</p>
          <p><strong>User:</strong> {user.name} ({user.role})</p>
          <p><strong>Language:</strong> {settings.language}</p>
          <p><strong>Notifications:</strong> {settings.notifications ? 'Enabled' : 'Disabled'}</p>
          <p><strong>Dark Mode:</strong> {settings.darkMode ? 'On' : 'Off'}</p>
        </div>
      </div>
    </div>
  );
};

// Shopping cart context example
const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }]
      };
    
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
    
    case 'CLEAR_CART':
      return { ...state, items: [] };
    
    default:
      return state;
  }
};

const CartProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(cartReducer, { items: [] });

  const addItem = (item) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      items: state.items,
      addItem,
      removeItem,
      clearCart,
      total
    }}>
      {children}
    </CartContext.Provider>
  );
};

const ContextWithReducerExample = () => {
  return (
    <CartProvider>
      <div className="example-container">
        <h2 className="example-title">4. Context with useReducer</h2>
        <p className="example-description">
          Complex state management using Context with useReducer for a shopping cart.
        </p>
        
        <ShoppingCart />
      </div>
    </CartProvider>
  );
};

const ShoppingCart = () => {
  const { items, addItem, removeItem, clearCart, total } = useContext(CartContext);

  const products = [
    { id: 1, name: 'Laptop', price: 999 },
    { id: 2, name: 'Mouse', price: 25 },
    { id: 3, name: 'Keyboard', price: 75 }
  ];

  return (
    <div className="demo-section">
      <div className="grid grid-2">
        <div>
          <h4>Products</h4>
          {products.map(product => (
            <div key={product.id} className="card">
              <div className="flex">
                <div>
                  <strong>{product.name}</strong>
                  <p>${product.price}</p>
                </div>
                <button onClick={() => addItem(product)}>
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div>
          <div className="flex">
            <h4>Shopping Cart</h4>
            <button onClick={clearCart} className="danger">Clear Cart</button>
          </div>
          
          {items.length === 0 ? (
            <p>Cart is empty</p>
          ) : (
            <>
              {items.map(item => (
                <div key={item.id} className="card">
                  <div className="flex">
                    <div>
                      <strong>{item.name}</strong>
                      <p>${item.price} x {item.quantity}</p>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="danger">
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <div className="card">
                <strong>Total: ${total.toFixed(2)}</strong>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">Code:</h4>
        <pre><code>{`// Context with reducer
const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      // Add item logic
      return { ...state, items: [...state.items, action.payload] };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
    default:
      return state;
  }
};

const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  const addItem = (item) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  return (
    <CartContext.Provider value={{ items: state.items, addItem }}>
      {children}
    </CartContext.Provider>
  );
};

// Usage
const ShoppingCart = () => {
  const { items, addItem } = useContext(CartContext);
  
  return (
    <div>
      {items.map(item => <div key={item.id}>{item.name}</div>)}
      <button onClick={() => addItem({ id: 1, name: 'Product' })}>
        Add Item
      </button>
    </div>
  );
};`}</code></pre>
      </div>
    </div>
  );
};

export default UseContextExamples;
