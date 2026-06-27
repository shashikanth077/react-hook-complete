import React, { useReducer, useState } from 'react';

const UseReducerExamples = () => {
  return (
    <div>
      <h1>useReducer Hook Examples</h1>
      <p>The useReducer hook is an alternative to useState for managing complex state logic. It's especially useful when state updates involve multiple sub-values or when the next state depends on the previous one.</p>
      
      <BasicCounterExample />
      <TodoListExample />
      <FormExample />
      <ShoppingCartExample />
    </div>
  );
};

// Basic counter with useReducer
const counterReducer = (state, action) => {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: 0 };
    case 'set':
      return { count: action.payload };
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};

const BasicCounterExample = () => {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });

  return (
    <div className="example-container">
      <h2 className="example-title">1. Basic Counter with useReducer</h2>
      <p className="example-description">
        Simple counter implementation showing the basic useReducer pattern.
      </p>
      
      <div className="demo-section">
        <div className="card">
          <h3>Count: {state.count}</h3>
          <div className="flex">
            <button onClick={() => dispatch({ type: 'increment' })}>
              +1
            </button>
            <button onClick={() => dispatch({ type: 'decrement' })}>
              -1
            </button>
            <button onClick={() => dispatch({ type: 'reset' })} className="secondary">
              Reset
            </button>
            <button onClick={() => dispatch({ type: 'set', payload: 10 })}>
              Set to 10
            </button>
          </div>
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">Code:</h4>
        <pre><code>{`const counterReducer = (state, action) => {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: 0 };
    case 'set':
      return { count: action.payload };
    default:
      throw new Error(\`Unknown action type: \${action.type}\`);
  }
};

const Counter = () => {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });

  return (
    <div>
      <h3>Count: {state.count}</h3>
      <button onClick={() => dispatch({ type: 'increment' })}>+1</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-1</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </div>
  );
};`}</code></pre>
      </div>
    </div>
  );
};

// Todo list with useReducer
const todoReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, {
          id: Date.now(),
          text: action.payload,
          completed: false
        }]
      };
    
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      };
    
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload)
      };
    
    case 'CLEAR_COMPLETED':
      return {
        ...state,
        todos: state.todos.filter(todo => !todo.completed)
      };
    
    case 'SET_FILTER':
      return {
        ...state,
        filter: action.payload
      };
    
    default:
      return state;
  }
};

const TodoListExample = () => {
  const [state, dispatch] = useReducer(todoReducer, {
    todos: [
      { id: 1, text: 'Learn React Hooks', completed: true },
      { id: 2, text: 'Build a todo app', completed: false },
      { id: 3, text: 'Master useReducer', completed: false }
    ],
    filter: 'all'
  });

  const [inputValue, setInputValue] = useState('');

  const addTodo = () => {
    if (inputValue.trim()) {
      dispatch({ type: 'ADD_TODO', payload: inputValue.trim() });
      setInputValue('');
    }
  };

  const filteredTodos = state.todos.filter(todo => {
    if (state.filter === 'completed') return todo.completed;
    if (state.filter === 'active') return !todo.completed;
    return true;
  });

  return (
    <div className="example-container">
      <h2 className="example-title">2. Todo List with useReducer</h2>
      <p className="example-description">
        Complex state management for a todo application with multiple actions.
      </p>
      
      <div className="demo-section">
        <div className="flex">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Add a new todo..."
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          />
          <button onClick={addTodo}>Add Todo</button>
        </div>

        <div className="flex" style={{ margin: '1rem 0' }}>
          <button 
            onClick={() => dispatch({ type: 'SET_FILTER', payload: 'all' })}
            className={state.filter === 'all' ? '' : 'secondary'}
          >
            All ({state.todos.length})
          </button>
          <button 
            onClick={() => dispatch({ type: 'SET_FILTER', payload: 'active' })}
            className={state.filter === 'active' ? '' : 'secondary'}
          >
            Active ({state.todos.filter(t => !t.completed).length})
          </button>
          <button 
            onClick={() => dispatch({ type: 'SET_FILTER', payload: 'completed' })}
            className={state.filter === 'completed' ? '' : 'secondary'}
          >
            Completed ({state.todos.filter(t => t.completed).length})
          </button>
          <button 
            onClick={() => dispatch({ type: 'CLEAR_COMPLETED' })}
            className="danger"
          >
            Clear Completed
          </button>
        </div>

        <div>
          {filteredTodos.map(todo => (
            <div key={todo.id} className="card">
              <div className="flex">
                <label style={{ flex: 1, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => dispatch({ type: 'TOGGLE_TODO', payload: todo.id })}
                  />
                  <span style={{ 
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    marginLeft: '0.5rem'
                  }}>
                    {todo.text}
                  </span>
                </label>
                <button 
                  onClick={() => dispatch({ type: 'DELETE_TODO', payload: todo.id })}
                  className="danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredTodos.length === 0 && (
          <p className="alert info">
            {state.filter === 'all' ? 'No todos yet!' : `No ${state.filter} todos!`}
          </p>
        )}
      </div>

      <div className="code-section">
        <h4 className="code-title">Code (simplified):</h4>
        <pre><code>{`const todoReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, {
          id: Date.now(),
          text: action.payload,
          completed: false
        }]
      };
    
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      };
    
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload)
      };
    
    default:
      return state;
  }
};

const TodoApp = () => {
  const [state, dispatch] = useReducer(todoReducer, {
    todos: [],
    filter: 'all'
  });

  return (
    <div>
      <button onClick={() => dispatch({ type: 'ADD_TODO', payload: 'New task' })}>
        Add Todo
      </button>
      {state.todos.map(todo => (
        <div key={todo.id}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => dispatch({ type: 'TOGGLE_TODO', payload: todo.id })}
          />
          {todo.text}
        </div>
      ))}
    </div>
  );
};`}</code></pre>
      </div>
    </div>
  );
};

// Form with useReducer
const formReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        values: {
          ...state.values,
          [action.field]: action.value
        },
        errors: {
          ...state.errors,
          [action.field]: ''
        }
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.field]: action.error
        }
      };
    
    case 'SET_ERRORS':
      return {
        ...state,
        errors: action.errors
      };
    
    case 'SET_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.value
      };
    
    case 'RESET_FORM':
      return {
        values: { name: '', email: '', message: '' },
        errors: {},
        isSubmitting: false
      };
    
    default:
      return state;
  }
};

const FormExample = () => {
  const [state, dispatch] = useReducer(formReducer, {
    values: { name: '', email: '', message: '' },
    errors: {},
    isSubmitting: false
  });

  const validateField = (field, value) => {
    let error = '';
    
    switch (field) {
      case 'name':
        if (!value.trim()) error = 'Name is required';
        break;
      case 'email':
        if (!value.trim()) error = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(value)) error = 'Email is invalid';
        break;
      case 'message':
        if (!value.trim()) error = 'Message is required';
        else if (value.length < 10) error = 'Message must be at least 10 characters';
        break;
      default:
        break;
    }
    
    return error;
  };

  const handleFieldChange = (field, value) => {
    dispatch({ type: 'SET_FIELD', field, value });
    
    const error = validateField(field, value);
    if (error) {
      dispatch({ type: 'SET_ERROR', field, error });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const errors = {};
    Object.keys(state.values).forEach(field => {
      const error = validateField(field, state.values[field]);
      if (error) errors[field] = error;
    });
    
    if (Object.keys(errors).length > 0) {
      dispatch({ type: 'SET_ERRORS', errors });
      return;
    }
    
    dispatch({ type: 'SET_SUBMITTING', value: true });
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Form submitted successfully!');
      dispatch({ type: 'RESET_FORM' });
    } catch (error) {
      alert('Submission failed!');
    } finally {
      dispatch({ type: 'SET_SUBMITTING', value: false });
    }
  };

  return (
    <div className="example-container">
      <h2 className="example-title">3. Form with useReducer</h2>
      <p className="example-description">
        Complex form state management with validation and submission handling.
      </p>
      
      <div className="demo-section">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={state.values.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              disabled={state.isSubmitting}
            />
            {state.errors.name && <div className="error">{state.errors.name}</div>}
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={state.values.email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              disabled={state.isSubmitting}
            />
            {state.errors.email && <div className="error">{state.errors.email}</div>}
          </div>

          <div className="form-group">
            <label>Message:</label>
            <textarea
              value={state.values.message}
              onChange={(e) => handleFieldChange('message', e.target.value)}
              disabled={state.isSubmitting}
              rows="4"
            />
            {state.errors.message && <div className="error">{state.errors.message}</div>}
          </div>

          <div className="flex">
            <button type="submit" disabled={state.isSubmitting}>
              {state.isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
            <button 
              type="button" 
              onClick={() => dispatch({ type: 'RESET_FORM' })}
              disabled={state.isSubmitting}
              className="secondary"
            >
              Reset
            </button>
          </div>
        </form>

        <div className="card" style={{ marginTop: '1rem' }}>
          <h4>Form State:</h4>
          <pre>{JSON.stringify(state, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};

// Shopping cart with useReducer
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
    
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
            : item
        ).filter(item => item.quantity > 0)
      };
    
    case 'CLEAR_CART':
      return { ...state, items: [] };
    
    case 'APPLY_DISCOUNT':
      return {
        ...state,
        discount: action.payload
      };
    
    default:
      return state;
  }
};

const ShoppingCartExample = () => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    discount: 0
  });

  const products = [
    { id: 1, name: 'Laptop', price: 999 },
    { id: 2, name: 'Mouse', price: 25 },
    { id: 3, name: 'Keyboard', price: 75 },
    { id: 4, name: 'Monitor', price: 299 }
  ];

  const subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = subtotal * (state.discount / 100);
  const total = subtotal - discountAmount;

  return (
    <div className="example-container">
      <h2 className="example-title">4. Shopping Cart with useReducer</h2>
      <p className="example-description">
        Complete shopping cart implementation with complex state logic.
      </p>
      
      <div className="demo-section">
        <div className="grid grid-2">
          <div>
            <h4>Products</h4>
            {products.map(product => (
              <div key={product.id} className="card">
                <div className="flex">
                  <div style={{ flex: 1 }}>
                    <strong>{product.name}</strong>
                    <p>${product.price}</p>
                  </div>
                  <button onClick={() => dispatch({ type: 'ADD_ITEM', payload: product })}>
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div>
            <div className="flex">
              <h4>Shopping Cart</h4>
              <button 
                onClick={() => dispatch({ type: 'CLEAR_CART' })}
                className="danger"
                disabled={state.items.length === 0}
              >
                Clear
              </button>
            </div>
            
            {state.items.length === 0 ? (
              <p className="alert info">Cart is empty</p>
            ) : (
              <>
                {state.items.map(item => (
                  <div key={item.id} className="card">
                    <div className="flex">
                      <div style={{ flex: 1 }}>
                        <strong>{item.name}</strong>
                        <p>${item.price} each</p>
                      </div>
                      <div className="flex">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => dispatch({
                            type: 'UPDATE_QUANTITY',
                            payload: { id: item.id, quantity: parseInt(e.target.value) || 0 }
                          })}
                          min="0"
                          style={{ width: '60px' }}
                        />
                        <button 
                          onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}
                          className="danger"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                    <p><strong>Subtotal: ${(item.price * item.quantity).toFixed(2)}</strong></p>
                  </div>
                ))}
                
                <div className="card">
                  <div className="form-group">
                    <label>Discount (%):</label>
                    <input
                      type="number"
                      value={state.discount}
                      onChange={(e) => dispatch({
                        type: 'APPLY_DISCOUNT',
                        payload: Math.max(0, Math.min(100, parseInt(e.target.value) || 0))
                      })}
                      min="0"
                      max="100"
                    />
                  </div>
                  
                  <div style={{ borderTop: '1px solid #ccc', paddingTop: '1rem' }}>
                    <p><strong>Subtotal: ${subtotal.toFixed(2)}</strong></p>
                    {state.discount > 0 && (
                      <p style={{ color: 'green' }}>
                        <strong>Discount ({state.discount}%): -${discountAmount.toFixed(2)}</strong>
                      </p>
                    )}
                    <p style={{ fontSize: '1.2em' }}>
                      <strong>Total: ${total.toFixed(2)}</strong>
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UseReducerExamples;
