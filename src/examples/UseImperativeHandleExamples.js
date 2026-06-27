import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';

const UseImperativeHandleExamples = () => {
  return (
    <div>
      <h1>useImperativeHandle Hook Examples</h1>
      <p>The useImperativeHandle hook customizes the instance value that is exposed to parent components when using ref. It should be used with forwardRef.</p>
      
      <BasicExample />
      <InputExample />
      <ModalExample />
      <CounterExample />
    </div>
  );
};

// Basic custom input component
const CustomInput = forwardRef((props, ref) => {
  const inputRef = useRef(null);
  const [value, setValue] = useState(props.defaultValue || '');

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
    blur: () => {
      inputRef.current?.blur();
    },
    clear: () => {
      setValue('');
      inputRef.current?.focus();
    },
    getValue: () => value,
    setValue: (newValue) => {
      setValue(newValue);
    },
    select: () => {
      inputRef.current?.select();
    }
  }));

  return (
    <input
      ref={inputRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      {...props}
    />
  );
});

const BasicExample = () => {
  const inputRef = useRef(null);

  const handleFocus = () => {
    inputRef.current?.focus();
  };

  const handleClear = () => {
    inputRef.current?.clear();
  };

  const handleGetValue = () => {
    const value = inputRef.current?.getValue();
    alert(`Current value: "${value}"`);
  };

  const handleSetValue = () => {
    inputRef.current?.setValue('Hello from parent!');
  };

  const handleSelect = () => {
    inputRef.current?.select();
  };

  return (
    <div className="example-container">
      <h2 className="example-title">1. Basic Custom Input</h2>
      <p className="example-description">
        Create a custom input component with exposed methods using useImperativeHandle.
      </p>
      
      <div className="demo-section">
        <div className="form-group">
          <label>Custom Input:</label>
          <CustomInput 
            ref={inputRef}
            placeholder="Type something..."
            defaultValue="Initial value"
          />
        </div>
        
        <div className="flex">
          <button onClick={handleFocus}>Focus</button>
          <button onClick={handleClear}>Clear</button>
          <button onClick={handleGetValue}>Get Value</button>
          <button onClick={handleSetValue}>Set Value</button>
          <button onClick={handleSelect}>Select All</button>
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">Code:</h4>
        <pre><code>{`const CustomInput = forwardRef((props, ref) => {
  const inputRef = useRef(null);
  const [value, setValue] = useState(props.defaultValue || '');

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
    clear: () => {
      setValue('');
      inputRef.current?.focus();
    },
    getValue: () => value,
    setValue: (newValue) => {
      setValue(newValue);
    },
    select: () => {
      inputRef.current?.select();
    }
  }));

  return (
    <input
      ref={inputRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      {...props}
    />
  );
});

// Usage
const Parent = () => {
  const inputRef = useRef(null);

  return (
    <div>
      <CustomInput ref={inputRef} placeholder="Type..." />
      <button onClick={() => inputRef.current?.focus()}>Focus</button>
      <button onClick={() => inputRef.current?.clear()}>Clear</button>
    </div>
  );
};`}</code></pre>
      </div>
    </div>
  );
};

// Advanced input with validation
const ValidatedInput = forwardRef(({ onValidate, ...props }, ref) => {
  const inputRef = useRef(null);
  const [value, setValue] = useState(props.defaultValue || '');
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  const validate = (inputValue) => {
    if (onValidate) {
      const errorMessage = onValidate(inputValue);
      setError(errorMessage || '');
      return !errorMessage;
    }
    return true;
  };

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
    blur: () => {
      inputRef.current?.blur();
    },
    clear: () => {
      setValue('');
      setError('');
      setTouched(false);
    },
    getValue: () => value,
    setValue: (newValue) => {
      setValue(newValue);
      validate(newValue);
    },
    isValid: () => {
      const isValid = validate(value);
      setTouched(true);
      return isValid;
    },
    getError: () => error,
    reset: () => {
      setValue(props.defaultValue || '');
      setError('');
      setTouched(false);
    }
  }));

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    if (touched) {
      validate(newValue);
    }
  };

  const handleBlur = () => {
    setTouched(true);
    validate(value);
  };

  return (
    <div>
      <input
        ref={inputRef}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        style={{
          borderColor: touched && error ? '#dc3545' : '#ced4da'
        }}
        {...props}
      />
      {touched && error && (
        <div style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          {error}
        </div>
      )}
    </div>
  );
});

const InputExample = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const validateEmail = (value) => {
    if (!value) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(value)) return 'Email is invalid';
    return '';
  };

  const validatePassword = (value) => {
    if (!value) return 'Password is required';
    if (value.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  const validateConfirmPassword = (value) => {
    const password = passwordRef.current?.getValue();
    if (!value) return 'Please confirm your password';
    if (value !== password) return 'Passwords do not match';
    return '';
  };

  const handleSubmit = () => {
    const emailValid = emailRef.current?.isValid();
    const passwordValid = passwordRef.current?.isValid();
    const confirmPasswordValid = confirmPasswordRef.current?.isValid();

    if (emailValid && passwordValid && confirmPasswordValid) {
      alert('Form is valid! Ready to submit.');
    } else {
      alert('Please fix the validation errors.');
    }
  };

  const handleReset = () => {
    emailRef.current?.reset();
    passwordRef.current?.reset();
    confirmPasswordRef.current?.reset();
  };

  return (
    <div className="example-container">
      <h2 className="example-title">2. Validated Input Components</h2>
      <p className="example-description">
        Custom input components with validation logic exposed through useImperativeHandle.
      </p>
      
      <div className="demo-section">
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <div className="form-group">
            <label>Email:</label>
            <ValidatedInput
              ref={emailRef}
              type="email"
              placeholder="Enter your email"
              onValidate={validateEmail}
            />
          </div>
          
          <div className="form-group">
            <label>Password:</label>
            <ValidatedInput
              ref={passwordRef}
              type="password"
              placeholder="Enter your password"
              onValidate={validatePassword}
            />
          </div>
          
          <div className="form-group">
            <label>Confirm Password:</label>
            <ValidatedInput
              ref={confirmPasswordRef}
              type="password"
              placeholder="Confirm your password"
              onValidate={validateConfirmPassword}
            />
          </div>
          
          <div className="flex">
            <button type="submit">Submit</button>
            <button type="button" onClick={handleReset} className="secondary">
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal component
const Modal = forwardRef(({ title, children }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);

  useImperativeHandle(ref, () => ({
    open: () => {
      setIsOpen(true);
      // Focus the modal after it opens
      setTimeout(() => {
        modalRef.current?.focus();
      }, 100);
    },
    close: () => {
      setIsOpen(false);
    },
    toggle: () => {
      setIsOpen(prev => !prev);
    },
    isOpen: () => isOpen
  }));

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
      onClick={() => setIsOpen(false)}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '2rem',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '80%',
          overflow: 'auto',
          outline: 'none'
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setIsOpen(false);
          }
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button 
            onClick={() => setIsOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '0.25rem'
            }}
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
});

const ModalExample = () => {
  const modal1Ref = useRef(null);
  const modal2Ref = useRef(null);

  return (
    <div className="example-container">
      <h2 className="example-title">3. Modal Component</h2>
      <p className="example-description">
        Modal component with imperative API for opening, closing, and checking state.
      </p>
      
      <div className="demo-section">
        <div className="flex">
          <button onClick={() => modal1Ref.current?.open()}>
            Open Modal 1
          </button>
          <button onClick={() => modal2Ref.current?.open()}>
            Open Modal 2
          </button>
          <button 
            onClick={() => {
              const isOpen1 = modal1Ref.current?.isOpen();
              const isOpen2 = modal2Ref.current?.isOpen();
              alert(`Modal 1: ${isOpen1 ? 'Open' : 'Closed'}, Modal 2: ${isOpen2 ? 'Open' : 'Closed'}`);
            }}
          >
            Check Status
          </button>
        </div>
        
        <Modal ref={modal1Ref} title="First Modal">
          <div>
            <p>This is the content of the first modal.</p>
            <p>You can press Escape to close it, or click outside.</p>
            <button onClick={() => modal1Ref.current?.close()}>
              Close Modal
            </button>
          </div>
        </Modal>
        
        <Modal ref={modal2Ref} title="Second Modal">
          <div>
            <p>This is the second modal with different content.</p>
            <div className="form-group">
              <label>Sample Input:</label>
              <input type="text" placeholder="Type something..." />
            </div>
            <div className="flex">
              <button onClick={() => modal2Ref.current?.close()}>
                Close
              </button>
              <button onClick={() => modal1Ref.current?.open()}>
                Open Modal 1
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

// Counter component with imperative API
const ImperativeCounter = forwardRef((props, ref) => {
  const [count, setCount] = useState(props.initialValue || 0);
  const [step, setStep] = useState(props.step || 1);

  useImperativeHandle(ref, () => ({
    increment: () => {
      setCount(prev => prev + step);
    },
    decrement: () => {
      setCount(prev => prev - step);
    },
    reset: () => {
      setCount(props.initialValue || 0);
    },
    setCount: (newCount) => {
      setCount(newCount);
    },
    getCount: () => count,
    setStep: (newStep) => {
      setStep(newStep);
    },
    getStep: () => step,
    incrementBy: (amount) => {
      setCount(prev => prev + amount);
    },
    decrementBy: (amount) => {
      setCount(prev => prev - amount);
    }
  }));

  return (
    <div className="card">
      <h4>Counter: {count}</h4>
      <p>Step: {step}</p>
      <div className="flex">
        <button onClick={() => setCount(prev => prev + step)}>+{step}</button>
        <button onClick={() => setCount(prev => prev - step)}>-{step}</button>
      </div>
    </div>
  );
});

const CounterExample = () => {
  const counter1Ref = useRef(null);
  const counter2Ref = useRef(null);

  const handleSyncCounters = () => {
    const count1 = counter1Ref.current?.getCount();
    const count2 = counter2Ref.current?.getCount();
    const average = Math.floor((count1 + count2) / 2);
    
    counter1Ref.current?.setCount(average);
    counter2Ref.current?.setCount(average);
  };

  const handleResetAll = () => {
    counter1Ref.current?.reset();
    counter2Ref.current?.reset();
  };

  const handleRandomIncrement = () => {
    const amount = Math.floor(Math.random() * 10) + 1;
    counter1Ref.current?.incrementBy(amount);
    counter2Ref.current?.incrementBy(amount);
  };

  return (
    <div className="example-container">
      <h2 className="example-title">4. Imperative Counter Components</h2>
      <p className="example-description">
        Multiple counter components controlled imperatively from the parent.
      </p>
      
      <div className="demo-section">
        <div className="grid grid-2">
          <ImperativeCounter ref={counter1Ref} initialValue={0} step={1} />
          <ImperativeCounter ref={counter2Ref} initialValue={10} step={2} />
        </div>
        
        <div className="flex">
          <button onClick={handleSyncCounters}>
            Sync Counters (Average)
          </button>
          <button onClick={handleResetAll} className="secondary">
            Reset All
          </button>
          <button onClick={handleRandomIncrement}>
            Random Increment
          </button>
          <button onClick={() => {
            counter1Ref.current?.setStep(5);
            counter2Ref.current?.setStep(5);
          }}>
            Set Step to 5
          </button>
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">Code:</h4>
        <pre><code>{`const ImperativeCounter = forwardRef((props, ref) => {
  const [count, setCount] = useState(props.initialValue || 0);
  const [step, setStep] = useState(props.step || 1);

  useImperativeHandle(ref, () => ({
    increment: () => {
      setCount(prev => prev + step);
    },
    decrement: () => {
      setCount(prev => prev - step);
    },
    reset: () => {
      setCount(props.initialValue || 0);
    },
    setCount: (newCount) => {
      setCount(newCount);
    },
    getCount: () => count,
    setStep: (newStep) => {
      setStep(newStep);
    },
    incrementBy: (amount) => {
      setCount(prev => prev + amount);
    }
  }));

  return (
    <div>
      <h4>Counter: {count}</h4>
      <button onClick={() => setCount(prev => prev + step)}>
        +{step}
      </button>
    </div>
  );
});

// Usage
const Parent = () => {
  const counterRef = useRef(null);

  return (
    <div>
      <ImperativeCounter ref={counterRef} initialValue={0} />
      <button onClick={() => counterRef.current?.increment()}>
        Increment from Parent
      </button>
      <button onClick={() => counterRef.current?.reset()}>
        Reset from Parent
      </button>
    </div>
  );
};`}</code></pre>
      </div>
    </div>
  );
};

export default UseImperativeHandleExamples;
