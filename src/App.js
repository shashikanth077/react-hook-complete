import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import styled from 'styled-components';

// Import all hook examples
import UseStateExamples from './examples/UseStateExamples';
import UseEffectExamples from './examples/UseEffectExamples';
import UseContextExamples from './examples/UseContextExamples';
import UseReducerExamples from './examples/UseReducerExamples';
import UseCallbackExamples from './examples/UseCallbackExamples';
import UseMemoExamples from './examples/UseMemoExamples';
import UseRefExamples from './examples/UseRefExamples';
import UseLayoutEffectExamples from './examples/UseLayoutEffectExamples';
import UseImperativeHandleExamples from './examples/UseImperativeHandleExamples';
import UseDebugValueExamples from './examples/UseDebugValueExamples';

// React 18 Hooks
import UseIdExamples from './examples/UseIdExamples';
import UseTransitionExamples from './examples/UseTransitionExamples';
import UseDeferredValueExamples from './examples/UseDeferredValueExamples';
import UseSyncExternalStoreExamples from './examples/UseSyncExternalStoreExamples';

// Custom Hooks Examples
import CustomHooksExamples from './examples/CustomHooksExamples';
import AdvancedCustomHooks from './examples/AdvancedCustomHooks';
import AdvancedPatternsExamples from './examples/AdvancedPatternsExamples';
import PerformanceExamples from './examples/PerformanceExamples';

const AppContainer = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;

const Header = styled.header`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem 0;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const Title = styled.h1`
  margin: 0;
  font-size: 2.5rem;
  font-weight: 700;
`;

const Subtitle = styled.p`
  margin: 0.5rem 0 0 0;
  font-size: 1.2rem;
  opacity: 0.9;
`;

const Navigation = styled.nav`
  background: #f8f9fa;
  padding: 1rem 0;
  border-bottom: 1px solid #dee2e6;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const NavGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const NavSection = styled.div`
  h3 {
    margin: 0 0 0.5rem 0;
    font-size: 0.9rem;
    color: #495057;
    text-transform: uppercase;
    font-weight: 600;
  }
`;

const NavLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const NavLink = styled(Link)`
  color: #6c757d;
  text-decoration: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
  transition: all 0.2s;

  &:hover {
    color: #495057;
    background: #e9ecef;
  }

  &.active {
    color: #007bff;
    background: #e3f2fd;
    font-weight: 500;
  }
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const HomePage = styled.div`
  text-align: center;
  padding: 4rem 2rem;

  h2 {
    color: #495057;
    margin-bottom: 2rem;
  }

  .features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin: 3rem 0;
  }

  .feature {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    
    h3 {
      color: #667eea;
      margin-bottom: 1rem;
    }
    
    p {
      color: #6c757d;
      line-height: 1.6;
    }
  }
`;

const hookCategories = {
  'Built-in Hooks': [
    { path: '/useState', name: 'useState', component: UseStateExamples },
    { path: '/useEffect', name: 'useEffect', component: UseEffectExamples },
    { path: '/useContext', name: 'useContext', component: UseContextExamples },
    { path: '/useReducer', name: 'useReducer', component: UseReducerExamples },
    { path: '/useCallback', name: 'useCallback', component: UseCallbackExamples },
    { path: '/useMemo', name: 'useMemo', component: UseMemoExamples },
    { path: '/useRef', name: 'useRef', component: UseRefExamples },
    { path: '/useLayoutEffect', name: 'useLayoutEffect', component: UseLayoutEffectExamples },
    { path: '/useImperativeHandle', name: 'useImperativeHandle', component: UseImperativeHandleExamples },
    { path: '/useDebugValue', name: 'useDebugValue', component: UseDebugValueExamples }
  ],
  'React 18 Hooks': [
    { path: '/useId', name: 'useId', component: UseIdExamples },
    { path: '/useTransition', name: 'useTransition', component: UseTransitionExamples },
    { path: '/useDeferredValue', name: 'useDeferredValue', component: UseDeferredValueExamples },
    { path: '/useSyncExternalStore', name: 'useSyncExternalStore', component: UseSyncExternalStoreExamples }
  ],
  'Advanced Patterns': [
    { path: '/custom-hooks', name: 'Custom Hooks', component: CustomHooksExamples },
    { path: '/advanced-hooks', name: 'Advanced Custom Hooks', component: AdvancedCustomHooks },
    { path: '/performance', name: 'Performance', component: PerformanceExamples },
    { path: '/advanced-patterns', name: 'Advanced Patterns', component: AdvancedPatternsExamples }
  ]
};

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  const HomeComponent = () => (
    <HomePage>
      <h2>Master React Hooks with Complete Examples</h2>
      <p>Explore comprehensive examples of all React hooks with best practices and real-world use cases.</p>
      
      <div className="features">
        <div className="feature">
          <h3>🎯 Complete Coverage</h3>
          <p>Every React hook from basic useState to advanced React 18 hooks with detailed examples.</p>
        </div>
        
        <div className="feature">
          <h3>🚀 Best Practices</h3>
          <p>Learn performance optimization, common patterns, and how to avoid common pitfalls.</p>
        </div>
        
        <div className="feature">
          <h3>💡 Real-world Examples</h3>
          <p>Practical examples you'll actually use in your applications, not just toy examples.</p>
        </div>
        
        <div className="feature">
          <h3>🔧 Custom Hooks</h3>
          <p>Learn to create reusable custom hooks for common patterns like data fetching and form handling.</p>
        </div>
        
        <div className="feature">
          <h3>⚡ Performance Tips</h3>
          <p>Understand when and how to optimize your hooks for better application performance.</p>
        </div>
        
        <div className="feature">
          <h3>🎨 Interactive Demos</h3>
          <p>Live, interactive examples that you can modify and experiment with.</p>
        </div>
      </div>
    </HomePage>
  );

  return (
    <Router>
      <AppContainer>
        <Header>
          <Title>React Hooks Complete Guide</Title>
          <Subtitle>Master all React hooks with practical examples and best practices</Subtitle>
        </Header>

        <Navigation>
          <NavContainer>
            <NavGrid>
              {Object.entries(hookCategories).map(([category, hooks]) => (
                <NavSection key={category}>
                  <h3>{category}</h3>
                  <NavLinks>
                    {hooks.map(hook => (
                      <NavLink 
                        key={hook.path}
                        to={hook.path}
                        className={currentPath === hook.path ? 'active' : ''}
                        onClick={() => setCurrentPath(hook.path)}
                      >
                        {hook.name}
                      </NavLink>
                    ))}
                  </NavLinks>
                </NavSection>
              ))}
            </NavGrid>
          </NavContainer>
        </Navigation>

        <MainContent>
          <Routes>
            <Route path="/" element={<HomeComponent />} />
            {Object.values(hookCategories).flat().map(hook => (
              <Route 
                key={hook.path}
                path={hook.path}
                element={<hook.component />}
              />
            ))}
          </Routes>
        </MainContent>
      </AppContainer>
    </Router>
  );
}

export default App;
