# TypeScript Examples for React Custom Hooks

This document provides comprehensive TypeScript examples for all custom hooks in the React Hooks Complete collection.

## Table of Contents
- [Setup and Installation](#setup-and-installation)
- [Basic Hook Usage with TypeScript](#basic-hook-usage-with-typescript)
- [Advanced Hook Patterns](#advanced-hook-patterns)
- [Custom Hook Creation](#custom-hook-creation)
- [Type-Safe Form Handling](#type-safe-form-handling)
- [Generic Hooks](#generic-hooks)
- [Testing with TypeScript](#testing-with-typescript)

## Setup and Installation

### Installing TypeScript Dependencies

```bash
npm install --save-dev typescript @types/react @types/react-dom
```

### TypeScript Configuration (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
```

## Basic Hook Usage with TypeScript

### State Management Hooks

```typescript
import React, { useState } from 'react';
import { useToggle, useCounter, useArray } from './hooks';
import type { UseToggleReturn, UseCounterReturn, UseArrayReturn } from './hooks/types';

// useToggle with TypeScript
const ToggleExample: React.FC = () => {
  const [isVisible, { toggle, setTrue, setFalse }]: UseToggleReturn = useToggle(false);

  return (
    <div>
      <p>Visible: {isVisible.toString()}</p>
      <button onClick={toggle}>Toggle</button>
      <button onClick={setTrue}>Show</button>
      <button onClick={setFalse}>Hide</button>
    </div>
  );
};

// useCounter with TypeScript
const CounterExample: React.FC = () => {
  const { count, increment, decrement, reset, setValue }: UseCounterReturn = useCounter(0, 2);

  const handleSetValue = () => {
    setValue(100); // Type-safe: only accepts numbers
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+2</button>
      <button onClick={decrement}>-2</button>
      <button onClick={reset}>Reset</button>
      <button onClick={handleSetValue}>Set to 100</button>
    </div>
  );
};

// useArray with TypeScript
interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

const TodoList: React.FC = () => {
  const { array: todos, push, filter, update, remove }: UseArrayReturn<TodoItem> = useArray<TodoItem>([]);
  const [inputText, setInputText] = useState<string>('');

  const addTodo = () => {
    if (inputText.trim()) {
      const newTodo: TodoItem = {
        id: Date.now().toString(),
        text: inputText,
        completed: false
      };
      push(newTodo);
      setInputText('');
    }
  };

  const toggleTodo = (index: number) => {
    const todo = todos[index];
    update(index, { ...todo, completed: !todo.completed });
  };

  const removeTodo = (index: number) => {
    remove(index);
  };

  const filterCompleted = () => {
    filter((todo: TodoItem) => !todo.completed);
  };

  return (
    <div>
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Add a todo..."
      />
      <button onClick={addTodo}>Add</button>
      <button onClick={filterCompleted}>Remove Completed</button>
      
      <ul>
        {todos.map((todo: TodoItem, index: number) => (
          <li key={todo.id}>
            <span 
              style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
              onClick={() => toggleTodo(index)}
            >
              {todo.text}
            </span>
            <button onClick={() => removeTodo(index)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
```

### Storage Hooks with TypeScript

```typescript
import { useLocalStorage, useSessionStorage } from './hooks';
import type { UseStorageReturn } from './hooks/types';

interface UserPreferences {
  theme: 'light' | 'dark';
  language: 'en' | 'es' | 'fr';
  notifications: boolean;
  fontSize: number;
}

const UserSettings: React.FC = () => {
  const [preferences, setPreferences]: UseStorageReturn<UserPreferences> = useLocalStorage<UserPreferences>('userPrefs', {
    theme: 'light',
    language: 'en',
    notifications: true,
    fontSize: 16
  });

  const [sessionData, setSessionData]: UseStorageReturn<string> = useSessionStorage<string>('sessionData', '');

  const updateTheme = (theme: UserPreferences['theme']) => {
    setPreferences(prev => ({ ...prev, theme }));
  };

  const updateLanguage = (language: UserPreferences['language']) => {
    setPreferences(prev => ({ ...prev, language }));
  };

  const toggleNotifications = () => {
    setPreferences(prev => ({ ...prev, notifications: !prev.notifications }));
  };

  const updateFontSize = (fontSize: number) => {
    setPreferences(prev => ({ ...prev, fontSize }));
  };

  return (
    <div>
      <h3>User Preferences</h3>
      
      <div>
        <label>Theme:</label>
        <select value={preferences.theme} onChange={(e) => updateTheme(e.target.value as UserPreferences['theme'])}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      <div>
        <label>Language:</label>
        <select value={preferences.language} onChange={(e) => updateLanguage(e.target.value as UserPreferences['language'])}>
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
        </select>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={preferences.notifications}
            onChange={toggleNotifications}
          />
          Enable Notifications
        </label>
      </div>

      <div>
        <label>Font Size:</label>
        <input
          type="range"
          min="12"
          max="24"
          value={preferences.fontSize}
          onChange={(e) => updateFontSize(Number(e.target.value))}
        />
        <span>{preferences.fontSize}px</span>
      </div>

      <div>
        <label>Session Data:</label>
        <input
          type="text"
          value={sessionData}
          onChange={(e) => setSessionData(e.target.value)}
          placeholder="Enter session data..."
        />
      </div>
    </div>
  );
};
```

### Async Hooks with TypeScript

```typescript
import { useAsync, useFetch } from './hooks';
import type { UseAsyncReturn, UseFetchReturn } from './hooks/types';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
  company: {
    name: string;
  };
}

interface ApiError {
  message: string;
  status: number;
}

// useAsync with proper typing
const UserProfile: React.FC<{ userId: number }> = ({ userId }) => {
  const fetchUser = async (id: number): Promise<User> => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
    if (!response.ok) {
      throw new ApiError({
        message: `Failed to fetch user: ${response.statusText}`,
        status: response.status
      });
    }
    return response.json();
  };

  const { data: user, loading, error, execute, reset }: UseAsyncReturn<User, ApiError> = useAsync<User, ApiError>(
    fetchUser,
    []
  );

  const handleFetchUser = () => {
    execute(userId);
  };

  if (loading) return <div>Loading user...</div>;
  if (error) return <div>Error: {error.message} (Status: {error.status})</div>;

  return (
    <div>
      <button onClick={handleFetchUser}>Fetch User {userId}</button>
      <button onClick={reset}>Reset</button>
      
      {user && (
        <div>
          <h3>{user.name}</h3>
          <p>Email: {user.email}</p>
          <p>Phone: {user.phone}</p>
          <p>Website: {user.website}</p>
          <p>Company: {user.company.name}</p>
        </div>
      )}
    </div>
  );
};

// useFetch with proper typing
const PostsList: React.FC = () => {
  interface Post {
    id: number;
    title: string;
    body: string;
    userId: number;
  }

  const { data: posts, loading, error }: UseFetchReturn<Post[]> = useFetch<Post[]>(
    'https://jsonplaceholder.typicode.com/posts'
  );

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h3>Posts</h3>
      {posts?.map((post: Post) => (
        <div key={post.id}>
          <h4>{post.title}</h4>
          <p>{post.body}</p>
          <small>User ID: {post.userId}</small>
        </div>
      ))}
    </div>
  );
};
```

## Advanced Hook Patterns

### Generic Custom Hooks

```typescript
import { useState, useCallback } from 'react';

// Generic API hook with TypeScript
interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface ApiActions<T> {
  setData: (data: T) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

function useApiState<T>(): [ApiState<T>, ApiActions<T>] {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const actions: ApiActions<T> = {
    setData: useCallback((newData: T) => setData(newData), []),
    setLoading: useCallback((isLoading: boolean) => setLoading(isLoading), []),
    setError: useCallback((errorMessage: string | null) => setError(errorMessage), []),
    reset: useCallback(() => {
      setData(null);
      setLoading(false);
      setError(null);
    }, [])
  };

  return [{ data, loading, error }, actions];
}

// Usage with specific types
const DataFetcher: React.FC = () => {
  interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
  }

  const [productState, productActions] = useApiState<Product[]>();
  const [userState, userActions] = useApiState<User>();

  const fetchProducts = async () => {
    productActions.setLoading(true);
    productActions.setError(null);
    
    try {
      const response = await fetch('/api/products');
      const products: Product[] = await response.json();
      productActions.setData(products);
    } catch (err) {
      productActions.setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      productActions.setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={fetchProducts}>Fetch Products</button>
      <button onClick={productActions.reset}>Reset</button>
      
      {productState.loading && <div>Loading products...</div>}
      {productState.error && <div>Error: {productState.error}</div>}
      {productState.data && (
        <ul>
          {productState.data.map((product: Product) => (
            <li key={product.id}>
              {product.name} - ${product.price} ({product.category})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
```

## Type-Safe Form Handling

```typescript
import { useForm } from './hooks';
import type { UseFormReturn, ValidationSchema } from './hooks/types';

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  newsletter: boolean;
  preferredContact: 'email' | 'phone' | 'either';
}

const ContactForm: React.FC = () => {
  const validationSchema: ValidationSchema<ContactFormData> = {
    firstName: { required: true, minLength: 2, message: 'First name must be at least 2 characters' },
    lastName: { required: true, minLength: 2, message: 'Last name must be at least 2 characters' },
    email: { 
      required: true, 
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
      message: 'Please enter a valid email address' 
    },
    phone: (value: string) => {
      if (value && !/^\+?[\d\s-()]+$/.test(value)) {
        return 'Please enter a valid phone number';
      }
      return '';
    },
    message: { required: true, minLength: 10, message: 'Message must be at least 10 characters' },
    newsletter: undefined, // No validation needed for boolean
    preferredContact: { required: true, message: 'Please select a preferred contact method' }
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset
  }: UseFormReturn<ContactFormData> = useForm<ContactFormData>({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      message: '',
      newsletter: false,
      preferredContact: 'email'
    },
    validationSchema
  });

  const onSubmit = async (formData: ContactFormData) => {
    console.log('Submitting form:', formData);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    alert('Form submitted successfully!');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="firstName">First Name:</label>
        <input
          id="firstName"
          type="text"
          value={values.firstName}
          onChange={(e) => handleChange('firstName', e.target.value)}
          onBlur={() => handleBlur('firstName')}
        />
        {touched.firstName && errors.firstName && (
          <span style={{ color: 'red' }}>{errors.firstName}</span>
        )}
      </div>

      <div>
        <label htmlFor="lastName">Last Name:</label>
        <input
          id="lastName"
          type="text"
          value={values.lastName}
          onChange={(e) => handleChange('lastName', e.target.value)}
          onBlur={() => handleBlur('lastName')}
        />
        {touched.lastName && errors.lastName && (
          <span style={{ color: 'red' }}>{errors.lastName}</span>
        )}
      </div>

      <div>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          value={values.email}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={() => handleBlur('email')}
        />
        {touched.email && errors.email && (
          <span style={{ color: 'red' }}>{errors.email}</span>
        )}
      </div>

      <div>
        <label htmlFor="phone">Phone (optional):</label>
        <input
          id="phone"
          type="tel"
          value={values.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          onBlur={() => handleBlur('phone')}
        />
        {touched.phone && errors.phone && (
          <span style={{ color: 'red' }}>{errors.phone}</span>
        )}
      </div>

      <div>
        <label htmlFor="preferredContact">Preferred Contact Method:</label>
        <select
          id="preferredContact"
          value={values.preferredContact}
          onChange={(e) => handleChange('preferredContact', e.target.value as ContactFormData['preferredContact'])}
          onBlur={() => handleBlur('preferredContact')}
        >
          <option value="email">Email</option>
          <option value="phone">Phone</option>
          <option value="either">Either</option>
        </select>
        {touched.preferredContact && errors.preferredContact && (
          <span style={{ color: 'red' }}>{errors.preferredContact}</span>
        )}
      </div>

      <div>
        <label htmlFor="message">Message:</label>
        <textarea
          id="message"
          value={values.message}
          onChange={(e) => handleChange('message', e.target.value)}
          onBlur={() => handleBlur('message')}
          rows={4}
        />
        {touched.message && errors.message && (
          <span style={{ color: 'red' }}>{errors.message}</span>
        )}
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={values.newsletter}
            onChange={(e) => handleChange('newsletter', e.target.checked)}
          />
          Subscribe to newsletter
        </label>
      </div>

      <div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
        <button type="button" onClick={reset}>
          Reset
        </button>
      </div>
    </form>
  );
};
```

## Custom Hook Creation with TypeScript

```typescript
import { useState, useEffect, useCallback, useRef } from 'react';

// Custom hook with proper TypeScript typing
interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  execute: () => Promise<void>;
  reset: () => void;
}

function useApi<T>(
  url: string,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  const { immediate = false, onSuccess, onError } = options;
  const cancelRef = useRef<boolean>(false);

  const execute = useCallback(async (): Promise<void> => {
    cancelRef.current = false;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: T = await response.json();
      
      if (!cancelRef.current) {
        setData(result);
        onSuccess?.(result);
      }
    } catch (err) {
      if (!cancelRef.current) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        onError?.(error);
      }
    } finally {
      if (!cancelRef.current) {
        setLoading(false);
      }
    }
  }, [url, onSuccess, onError]);

  const reset = useCallback((): void => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }

    return () => {
      cancelRef.current = true;
    };
  }, [execute, immediate]);

  return { data, loading, error, execute, reset };
}

// Usage of the custom hook
interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

const PostViewer: React.FC<{ postId: number }> = ({ postId }) => {
  const { data: post, loading, error, execute } = useApi<Post>(
    `https://jsonplaceholder.typicode.com/posts/${postId}`,
    {
      immediate: true,
      onSuccess: (data) => console.log('Post loaded:', data.title),
      onError: (error) => console.error('Failed to load post:', error.message)
    }
  );

  if (loading) return <div>Loading post...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!post) return <div>No post found</div>;

  return (
    <article>
      <h2>{post.title}</h2>
      <p>{post.body}</p>
      <small>Post ID: {post.id}, User ID: {post.userId}</small>
      <button onClick={execute}>Refresh</button>
    </article>
  );
};
```

## Testing with TypeScript

```typescript
import { renderHook, act } from '@testing-library/react';
import { useCounter, useToggle, useLocalStorage } from '../hooks';
import type { UseCounterReturn, UseToggleReturn, UseStorageReturn } from '../hooks/types';

// Testing useCounter
describe('useCounter', () => {
  test('should initialize with default value', () => {
    const { result } = renderHook(() => useCounter());
    
    expect(result.current.count).toBe(0);
  });

  test('should initialize with custom value and step', () => {
    const { result } = renderHook(() => useCounter(10, 5));
    
    expect(result.current.count).toBe(10);
  });

  test('should increment correctly', () => {
    const { result } = renderHook(() => useCounter(0, 3));
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(3);
  });

  test('should have correct return type', () => {
    const { result } = renderHook(() => useCounter());
    
    // TypeScript will catch if the return type doesn't match UseCounterReturn
    const counter: UseCounterReturn = result.current;
    
    expect(typeof counter.count).toBe('number');
    expect(typeof counter.increment).toBe('function');
    expect(typeof counter.decrement).toBe('function');
    expect(typeof counter.reset).toBe('function');
    expect(typeof counter.setValue).toBe('function');
  });
});

// Testing useToggle
describe('useToggle', () => {
  test('should toggle boolean value', () => {
    const { result } = renderHook(() => useToggle(false));
    
    expect(result.current[0]).toBe(false);
    
    act(() => {
      result.current[1].toggle();
    });
    
    expect(result.current[0]).toBe(true);
  });

  test('should have correct return type', () => {
    const { result } = renderHook(() => useToggle());
    
    // TypeScript ensures the return type matches UseToggleReturn
    const [value, actions]: UseToggleReturn = result.current;
    
    expect(typeof value).toBe('boolean');
    expect(typeof actions.toggle).toBe('function');
    expect(typeof actions.setTrue).toBe('function');
    expect(typeof actions.setFalse).toBe('function');
  });
});

// Testing useLocalStorage with types
describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('should work with different types', () => {
    interface TestObject {
      name: string;
      age: number;
      active: boolean;
    }

    const initialValue: TestObject = {
      name: 'John',
      age: 30,
      active: true
    };

    const { result } = renderHook(() => useLocalStorage<TestObject>('testObject', initialValue));
    
    expect(result.current[0]).toEqual(initialValue);
    
    act(() => {
      result.current[1]({ name: 'Jane', age: 25, active: false });
    });
    
    expect(result.current[0]).toEqual({ name: 'Jane', age: 25, active: false });
  });

  test('should have correct return type', () => {
    const { result } = renderHook(() => useLocalStorage<string>('test', 'initial'));
    
    // TypeScript ensures the return type matches UseStorageReturn<string>
    const [value, setValue]: UseStorageReturn<string> = result.current;
    
    expect(typeof value).toBe('string');
    expect(typeof setValue).toBe('function');
  });
});

// Testing with mock functions and proper typing
describe('useApi hook', () => {
  interface MockUser {
    id: number;
    name: string;
    email: string;
  }

  const mockUser: MockUser = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com'
  };

  beforeEach(() => {
    // Mock fetch with proper typing
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUser),
      })
    ) as jest.MockedFunction<typeof fetch>;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should fetch data with correct types', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useApi<MockUser>('https://api.example.com/users/1', { immediate: true })
    );

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual(mockUser);
    expect(result.current.error).toBeNull();
  });
});
```

## Best Practices

### 1. Always Define Interfaces for Complex Data

```typescript
// ❌ Bad: Using any or no typing
const { data } = useFetch('/api/users');

// ✅ Good: Define proper interfaces
interface User {
  id: number;
  name: string;
  email: string;
}

const { data } = useFetch<User[]>('/api/users');
```

### 2. Use Generic Constraints

```typescript
// ❌ Bad: Too permissive
function useStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // implementation
}

// ✅ Good: Constrain the generic type
function useStorage<T extends string | number | boolean | object>(
  key: string, 
  initialValue: T
): [T, (value: T) => void] {
  // implementation
}
```

### 3. Provide Default Generic Types

```typescript
// ✅ Good: Provide sensible defaults
function useAsync<T = any, E = Error>(
  asyncFn: () => Promise<T>,
  deps?: React.DependencyList
): UseAsyncReturn<T, E> {
  // implementation
}
```

### 4. Use Discriminated Unions for State

```typescript
// ✅ Good: Use discriminated unions for complex state
type AsyncState<T> = 
  | { status: 'idle'; data: null; error: null }
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: T; error: null }
  | { status: 'error'; data: null; error: Error };

function useAsyncState<T>(): [AsyncState<T>, (state: AsyncState<T>) => void] {
  // implementation
}
```

This comprehensive TypeScript guide provides type-safe patterns for all custom hooks, ensuring better development experience and runtime safety.
