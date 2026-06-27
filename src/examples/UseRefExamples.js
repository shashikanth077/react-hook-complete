import React, { useState, useRef, useEffect } from 'react';

const UseRefExamples = () => {
  return (
    <div>
      <h1>useRef Hook Examples</h1>
      <p>The useRef hook creates a mutable ref object that persists for the lifetime of the component. It's commonly used for accessing DOM elements and storing mutable values that don't trigger re-renders.</p>
      
      <DOMAccessExample />
      <FocusManagementExample />
      <MutableValueExample />
      <PreviousValueExample />
      <TimerExample />
      <UncontrolledComponentExample />
    </div>
  );
};

// Basic DOM access example
const DOMAccessExample = () => {
  const inputRef = useRef(null);
  const [value, setValue] = useState('');

  const focusInput = () => {
    inputRef.current.focus();
  };

  const selectAllText = () => {
    inputRef.current.select();
  };

  const getInputInfo = () => {
    const input = inputRef.current;
    alert(`
      Value: ${input.value}
      Selection Start: ${input.selectionStart}
      Selection End: ${input.selectionEnd}
      Input Type: ${input.type}
    `);
  };

  return (
    <div className="example-container">
      <h2 className="example-title">1. DOM Element Access</h2>
      <p className="example-description">
        Use useRef to directly access and manipulate DOM elements.
      </p>
      
      <div className="demo-section">
        <div className="form-group">
          <label>Text Input:</label>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Type something here"
          />
        </div>
        
        <div className="flex">
          <button onClick={focusInput}>Focus Input</button>
          <button onClick={selectAllText}>Select All Text</button>
          <button onClick={getInputInfo}>Get Input Info</button>
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">Code:</h4>
        <pre><code>{`const DOMAccessExample = () => {
  const inputRef = useRef(null);
  const [value, setValue] = useState('');

  const focusInput = () => {
    inputRef.current.focus();
  };

  const selectAllText = () => {
    inputRef.current.select();
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button onClick={focusInput}>Focus Input</button>
      <button onClick={selectAllText}>Select All</button>
    </div>
  );
};`}</code></pre>
      </div>
    </div>
  );
};

// Focus management example
const FocusManagementExample = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const inputRefs = useRef([]);

  const steps = [
    { label: 'First Name', placeholder: 'Enter your first name' },
    { label: 'Last Name', placeholder: 'Enter your last name' },
    { label: 'Email', placeholder: 'Enter your email' },
    { label: 'Phone', placeholder: 'Enter your phone number' }
  ];

  useEffect(() => {
    // Focus the current step's input
    if (inputRefs.current[currentStep]) {
      inputRefs.current[currentStep].focus();
    }
  }, [currentStep]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="example-container">
      <h2 className="example-title">2. Focus Management</h2>
      <p className="example-description">
        Manage focus across multiple inputs in a multi-step form.
      </p>
      
      <div className="demo-section">
        <div className="card">
          <h4>Step {currentStep + 1} of {steps.length}</h4>
          <div className="form-group">
            <label>{steps[currentStep].label}:</label>
            <input
              ref={(el) => inputRefs.current[currentStep] = el}
              type="text"
              placeholder={steps[currentStep].placeholder}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  nextStep();
                }
              }}
            />
          </div>
          
          <div className="flex">
            <button 
              onClick={prevStep} 
              disabled={currentStep === 0}
              className="secondary"
            >
              Previous
            </button>
            <button 
              onClick={nextStep}
              disabled={currentStep === steps.length - 1}
            >
              {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>

        <div className="alert info">
          Press Enter to move to the next step, or use the buttons. Notice how focus automatically moves to the next input.
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">Code:</h4>
        <pre><code>{`const FocusManagementExample = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const inputRefs = useRef([]);

  const steps = ['First Name', 'Last Name', 'Email', 'Phone'];

  useEffect(() => {
    // Focus the current step's input
    if (inputRefs.current[currentStep]) {
      inputRefs.current[currentStep].focus();
    }
  }, [currentStep]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div>
      <h4>Step {currentStep + 1}: {steps[currentStep]}</h4>
      <input
        ref={(el) => inputRefs.current[currentStep] = el}
        type="text"
        onKeyPress={(e) => e.key === 'Enter' && nextStep()}
      />
      <button onClick={nextStep}>Next</button>
    </div>
  );
};`}</code></pre>
      </div>
    </div>
  );
};

// Mutable value example
const MutableValueExample = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  
  // These refs don't cause re-renders when changed
  const renderCount = useRef(0);
  const nameChangeCount = useRef(0);
  const lastNameLength = useRef(0);

  // Update render count on every render
  renderCount.current += 1;

  // Update name change count when name changes
  useEffect(() => {
    if (name !== '') {
      nameChangeCount.current += 1;
    }
    lastNameLength.current = name.length;
  }, [name]);

  const resetCounters = () => {
    renderCount.current = 0;
    nameChangeCount.current = 0;
    lastNameLength.current = 0;
    setCount(0);
    setName('');
  };

  return (
    <div className="example-container">
      <h2 className="example-title">3. Mutable Values (No Re-render)</h2>
      <p className="example-description">
        Store mutable values that persist between renders without triggering re-renders.
      </p>
      
      <div className="demo-section">
        <div className="grid grid-2">
          <div className="card">
            <h4>State Values (Cause Re-renders)</h4>
            <p><strong>Count:</strong> {count}</p>
            <p><strong>Name:</strong> "{name}"</p>
            <p><strong>Name Length:</strong> {name.length}</p>
          </div>
          
          <div className="card">
            <h4>Ref Values (No Re-renders)</h4>
            <p><strong>Render Count:</strong> {renderCount.current}</p>
            <p><strong>Name Changes:</strong> {nameChangeCount.current}</p>
            <p><strong>Last Name Length:</strong> {lastNameLength.current}</p>
          </div>
        </div>
        
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Type to see name change counter"
          />
        </div>
        
        <div className="flex">
          <button onClick={() => setCount(count + 1)}>
            Increment Count
          </button>
          <button onClick={resetCounters} className="secondary">
            Reset All
          </button>
        </div>
        
        <div className="alert info">
          Notice how ref values update without causing re-renders, while state changes trigger re-renders and update the render count.
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">Code:</h4>
        <pre><code>{`const MutableValueExample = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  
  // Refs don't cause re-renders when changed
  const renderCount = useRef(0);
  const nameChangeCount = useRef(0);

  // Update render count on every render
  renderCount.current += 1;

  // Update name change count when name changes
  useEffect(() => {
    if (name !== '') {
      nameChangeCount.current += 1;
    }
  }, [name]);

  return (
    <div>
      <p>Count: {count}</p>
      <p>Render Count: {renderCount.current}</p>
      <p>Name Changes: {nameChangeCount.current}</p>
      
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
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

// Previous value tracking
const PreviousValueExample = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  
  const prevCount = useRef(0);
  const prevName = useRef('');

  useEffect(() => {
    prevCount.current = count;
  }, [count]);

  useEffect(() => {
    prevName.current = name;
  }, [name]);

  return (
    <div className="example-container">
      <h2 className="example-title">4. Previous Value Tracking</h2>
      <p className="example-description">
        Track previous values of state variables using useRef.
      </p>
      
      <div className="demo-section">
        <div className="grid grid-2">
          <div className="card">
            <h4>Current Values</h4>
            <p><strong>Count:</strong> {count}</p>
            <p><strong>Name:</strong> "{name}"</p>
          </div>
          
          <div className="card">
            <h4>Previous Values</h4>
            <p><strong>Previous Count:</strong> {prevCount.current}</p>
            <p><strong>Previous Name:</strong> "{prevName.current}"</p>
          </div>
        </div>
        
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Change to see previous value"
          />
        </div>
        
        <div className="flex">
          <button onClick={() => setCount(count + 1)}>
            Count: {count}
          </button>
          <button onClick={() => setCount(count - 1)}>
            Decrement
          </button>
        </div>
        
        <div className="card">
          <h4>Comparison</h4>
          <p><strong>Count changed:</strong> {count !== prevCount.current ? 'Yes' : 'No'}</p>
          <p><strong>Name changed:</strong> {name !== prevName.current ? 'Yes' : 'No'}</p>
          {count !== prevCount.current && (
            <p><strong>Count difference:</strong> {count - prevCount.current}</p>
          )}
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">Code:</h4>
        <pre><code>{`const PreviousValueExample = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  
  const prevCount = useRef(0);
  const prevName = useRef('');

  useEffect(() => {
    prevCount.current = count;
  }, [count]);

  useEffect(() => {
    prevName.current = name;
  }, [name]);

  return (
    <div>
      <p>Current Count: {count}</p>
      <p>Previous Count: {prevCount.current}</p>
      <p>Count changed: {count !== prevCount.current ? 'Yes' : 'No'}</p>
      
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
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

// Timer example with useRef
const TimerExample = () => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
  };

  const stopTimer = () => {
    if (isRunning) {
      setIsRunning(false);
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const resetTimer = () => {
    stopTimer();
    setSeconds(0);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="example-container">
      <h2 className="example-title">5. Timer with Interval Management</h2>
      <p className="example-description">
        Use useRef to store interval IDs and manage timers without causing re-renders.
      </p>
      
      <div className="demo-section">
        <div className="card">
          <h3 style={{ fontFamily: 'monospace', fontSize: '2rem' }}>
            {formatTime(seconds)}
          </h3>
          
          <div className="flex">
            <button 
              onClick={startTimer} 
              disabled={isRunning}
              className="success"
            >
              Start
            </button>
            <button 
              onClick={stopTimer}
              disabled={!isRunning}
              className="danger"
            >
              Stop
            </button>
            <button onClick={resetTimer} className="secondary">
              Reset
            </button>
          </div>
          
          <p className="alert info">
            Status: {isRunning ? 'Running' : 'Stopped'}
            {intervalRef.current && ` (Interval ID: ${intervalRef.current})`}
          </p>
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">Code:</h4>
        <pre><code>{`const TimerExample = () => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
  };

  const stopTimer = () => {
    if (isRunning) {
      setIsRunning(false);
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const resetTimer = () => {
    stopTimer();
    setSeconds(0);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div>
      <h3>{seconds}</h3>
      <button onClick={startTimer} disabled={isRunning}>Start</button>
      <button onClick={stopTimer} disabled={!isRunning}>Stop</button>
      <button onClick={resetTimer}>Reset</button>
    </div>
  );
};`}</code></pre>
      </div>
    </div>
  );
};

// Uncontrolled component example
const UncontrolledComponentExample = () => {
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const messageRef = useRef(null);
  const fileRef = useRef(null);
  
  const [submittedData, setSubmittedData] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formData = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      message: messageRef.current.value,
      file: fileRef.current.files[0]?.name || 'No file selected'
    };
    
    setSubmittedData(formData);
  };

  const clearForm = () => {
    nameRef.current.value = '';
    emailRef.current.value = '';
    messageRef.current.value = '';
    fileRef.current.value = '';
    setSubmittedData(null);
  };

  const focusFirstEmpty = () => {
    if (!nameRef.current.value) {
      nameRef.current.focus();
    } else if (!emailRef.current.value) {
      emailRef.current.focus();
    } else if (!messageRef.current.value) {
      messageRef.current.focus();
    }
  };

  return (
    <div className="example-container">
      <h2 className="example-title">6. Uncontrolled Components</h2>
      <p className="example-description">
        Use useRef to access form values without controlled state management.
      </p>
      
      <div className="demo-section">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input
              ref={nameRef}
              type="text"
              defaultValue="John Doe"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Email:</label>
            <input
              ref={emailRef}
              type="email"
              defaultValue="john@example.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Message:</label>
            <textarea
              ref={messageRef}
              defaultValue="Hello, this is a test message."
              rows="4"
              required
            />
          </div>
          
          <div className="form-group">
            <label>File:</label>
            <input
              ref={fileRef}
              type="file"
              accept=".txt,.pdf,.doc"
            />
          </div>
          
          <div className="flex">
            <button type="submit">Submit</button>
            <button type="button" onClick={clearForm} className="secondary">
              Clear Form
            </button>
            <button type="button" onClick={focusFirstEmpty}>
              Focus First Empty
            </button>
          </div>
        </form>
        
        {submittedData && (
          <div className="card" style={{ marginTop: '1rem' }}>
            <h4>Submitted Data:</h4>
            <p><strong>Name:</strong> {submittedData.name}</p>
            <p><strong>Email:</strong> {submittedData.email}</p>
            <p><strong>Message:</strong> {submittedData.message}</p>
            <p><strong>File:</strong> {submittedData.file}</p>
          </div>
        )}
      </div>

      <div className="code-section">
        <h4 className="code-title">Code:</h4>
        <pre><code>{`const UncontrolledComponentExample = () => {
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const messageRef = useRef(null);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formData = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      message: messageRef.current.value
    };
    
    console.log('Form data:', formData);
  };

  const clearForm = () => {
    nameRef.current.value = '';
    emailRef.current.value = '';
    messageRef.current.value = '';
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={nameRef}
        type="text"
        defaultValue="John Doe"
        required
      />
      <input
        ref={emailRef}
        type="email"
        defaultValue="john@example.com"
        required
      />
      <textarea
        ref={messageRef}
        defaultValue="Hello!"
        required
      />
      <button type="submit">Submit</button>
      <button type="button" onClick={clearForm}>Clear</button>
    </form>
  );
};`}</code></pre>
      </div>
    </div>
  );
};

export default UseRefExamples;
