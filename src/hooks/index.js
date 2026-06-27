/**
 * React Hooks Utility Collection
 * 
 * A comprehensive collection of reusable custom hooks for React applications.
 * These hooks encapsulate common patterns and provide clean APIs for complex functionality.
 */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

// ==================== STATE MANAGEMENT HOOKS ====================

/**
 * useToggle - Manage boolean state with convenient toggle functions
 * @param {boolean} initialValue - Initial boolean value
 * @returns {[boolean, object]} - [value, { toggle, setTrue, setFalse }]
 */
export const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);
  
  const toggle = useCallback(() => setValue(v => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  
  return [value, { toggle, setTrue, setFalse }];
};

/**
 * useCounter - Counter logic with increment, decrement, and reset
 * @param {number} initialValue - Initial count value
 * @param {number} step - Step size for increment/decrement
 * @returns {object} - { count, increment, decrement, reset, setValue }
 */
export const useCounter = (initialValue = 0, step = 1) => {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => setCount(prev => prev + step), [step]);
  const decrement = useCallback(() => setCount(prev => prev - step), [step]);
  const reset = useCallback(() => setCount(initialValue), [initialValue]);
  const setValue = useCallback((value) => setCount(value), []);

  return { count, increment, decrement, reset, setValue };
};

/**
 * useArray - Array manipulation utilities
 * @param {array} initialValue - Initial array value
 * @returns {object} - Array with manipulation methods
 */
export const useArray = (initialValue = []) => {
  const [array, setArray] = useState(initialValue);

  const push = useCallback((element) => {
    setArray(prev => [...prev, element]);
  }, []);

  const filter = useCallback((callback) => {
    setArray(prev => prev.filter(callback));
  }, []);

  const update = useCallback((index, newElement) => {
    setArray(prev => prev.map((item, i) => i === index ? newElement : item));
  }, []);

  const remove = useCallback((index) => {
    setArray(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clear = useCallback(() => setArray([]), []);

  const reset = useCallback(() => setArray(initialValue), [initialValue]);

  return {
    array,
    set: setArray,
    push,
    filter,
    update,
    remove,
    clear,
    reset
  };
};

// ==================== STORAGE HOOKS ====================

/**
 * useLocalStorage - Persistent state with localStorage
 * @param {string} key - localStorage key
 * @param {any} initialValue - Initial value if key doesn't exist
 * @returns {[any, function]} - [storedValue, setValue]
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
};

/**
 * useSessionStorage - Persistent state with sessionStorage
 * @param {string} key - sessionStorage key
 * @param {any} initialValue - Initial value if key doesn't exist
 * @returns {[any, function]} - [storedValue, setValue]
 */
export const useSessionStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting sessionStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
};

// ==================== ASYNC HOOKS ====================

/**
 * useAsync - Advanced async operation management
 * @param {function} asyncFunction - Async function to execute
 * @param {array} dependencies - Dependencies for the async function
 * @returns {object} - { data, loading, error, execute, reset }
 */
export const useAsync = (asyncFunction, dependencies = []) => {
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

/**
 * useFetch - Simple data fetching hook
 * @param {string} url - URL to fetch from
 * @param {object} options - Fetch options
 * @returns {object} - { data, loading, error }
 */
export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(url, options);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [url, JSON.stringify(options)]);

  return { data, loading, error };
};

// ==================== TIMING HOOKS ====================

/**
 * useDebounce - Debounce a value
 * @param {any} value - Value to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {any} - Debounced value
 */
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * useThrottle - Throttle a value
 * @param {any} value - Value to throttle
 * @param {number} delay - Delay in milliseconds
 * @returns {any} - Throttled value
 */
export const useThrottle = (value, delay) => {
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

/**
 * useInterval - Declarative interval hook
 * @param {function} callback - Function to call on interval
 * @param {number} delay - Delay in milliseconds (null to pause)
 */
export const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

/**
 * useTimeout - Declarative timeout hook
 * @param {function} callback - Function to call after timeout
 * @param {number} delay - Delay in milliseconds
 */
export const useTimeout = (callback, delay) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay !== null) {
      const id = setTimeout(() => savedCallback.current(), delay);
      return () => clearTimeout(id);
    }
  }, [delay]);
};

// ==================== DOM/EVENT HOOKS ====================

/**
 * useOnClickOutside - Detect clicks outside an element
 * @param {ref} ref - React ref to the element
 * @param {function} handler - Function to call on outside click
 */
export const useOnClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};

/**
 * useKeyPress - Detect key presses
 * @param {string} targetKey - Key to listen for
 * @param {object} options - Options object
 * @returns {boolean} - Whether the key is currently pressed
 */
export const useKeyPress = (targetKey, options = {}) => {
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

/**
 * useWindowSize - Track window dimensions
 * @returns {object} - { width, height }
 */
export const useWindowSize = () => {
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

/**
 * useScrollPosition - Track scroll position
 * @returns {object} - { x, y }
 */
export const useScrollPosition = () => {
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

/**
 * useMediaQuery - Match CSS media queries
 * @param {string} query - Media query string
 * @returns {boolean} - Whether the query matches
 */
export const useMediaQuery = (query) => {
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

// ==================== UTILITY HOOKS ====================

/**
 * usePrevious - Get the previous value of a variable
 * @param {any} value - Current value
 * @returns {any} - Previous value
 */
export const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

/**
 * useMount - Execute callback on component mount
 * @param {function} callback - Function to execute on mount
 */
export const useMount = (callback) => {
  useEffect(() => {
    callback();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
};

/**
 * useUnmount - Execute callback on component unmount
 * @param {function} callback - Function to execute on unmount
 */
export const useUnmount = (callback) => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    return () => callbackRef.current();
  }, []);
};

/**
 * useUpdateEffect - useEffect that skips the first render
 * @param {function} effect - Effect function
 * @param {array} deps - Dependencies array
 */
export const useUpdateEffect = (effect, deps) => {
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    return effect();
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
};

/**
 * useClipboard - Clipboard operations
 * @returns {object} - { copy, paste, copiedText, isCopied }
 */
export const useClipboard = () => {
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

/**
 * useIntersectionObserver - Observe element intersection
 * @param {ref} elementRef - React ref to the element to observe
 * @param {object} options - Intersection Observer options
 * @returns {object} - { entry, isIntersecting }
 */
export const useIntersectionObserver = (
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

// ==================== FORM HOOKS ====================

/**
 * useForm - Advanced form management
 * @param {object} initialValues - Initial form values
 * @param {object} validationSchema - Validation rules
 * @returns {object} - Form state and handlers
 */
export const useForm = (initialValues = {}, validationSchema = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = useCallback((fieldName, value) => {
    const validator = validationSchema[fieldName];
    if (!validator) return '';

    if (typeof validator === 'function') {
      return validator(value, values);
    }

    if (validator.required && (!value || value.trim() === '')) {
      return validator.message || `${fieldName} is required`;
    }

    if (validator.pattern && !validator.pattern.test(value)) {
      return validator.message || `${fieldName} is invalid`;
    }

    if (validator.minLength && value.length < validator.minLength) {
      return validator.message || `${fieldName} must be at least ${validator.minLength} characters`;
    }

    return '';
  }, [validationSchema, values]);

  const validateAll = useCallback(() => {
    const newErrors = {};
    Object.keys(validationSchema).forEach(fieldName => {
      const error = validate(fieldName, values[fieldName]);
      if (error) newErrors[fieldName] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [validate, validationSchema, values]);

  const handleChange = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const handleBlur = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validate(name, values[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [validate, values]);

  const handleSubmit = useCallback((onSubmit) => {
    return async (e) => {
      e.preventDefault();
      setIsSubmitting(true);

      const isValid = validateAll();
      setTouched(Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {}));

      if (isValid) {
        try {
          await onSubmit(values);
        } catch (error) {
          console.error('Form submission error:', error);
        }
      }

      setIsSubmitting(false);
    };
  }, [validateAll, values]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    validateAll
  };
};

// Export all hooks as default
export default {
  // State Management
  useToggle,
  useCounter,
  useArray,
  
  // Storage
  useLocalStorage,
  useSessionStorage,
  
  // Async
  useAsync,
  useFetch,
  
  // Timing
  useDebounce,
  useThrottle,
  useInterval,
  useTimeout,
  
  // DOM/Events
  useOnClickOutside,
  useKeyPress,
  useWindowSize,
  useScrollPosition,
  useMediaQuery,
  
  // Utilities
  usePrevious,
  useMount,
  useUnmount,
  useUpdateEffect,
  useClipboard,
  useIntersectionObserver,
  
  // Forms
  useForm
};
