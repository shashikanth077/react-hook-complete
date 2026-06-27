import React, { useState, useTransition, startTransition } from 'react';

const UseTransitionExamples = () => {
  return (
    <div>
      <h1>useTransition Hook Examples (React 18)</h1>
      <p>The useTransition hook allows you to mark updates as non-urgent, keeping the UI responsive during expensive operations. It's part of React's concurrent features.</p>
      
      <BasicExample />
      <SearchExample />
      <TabSwitchingExample />
      <ListFilteringExample />
    </div>
  );
};

// Basic useTransition example
const BasicExample = () => {
  const [isPending, startTransition] = useTransition();
  const [count, setCount] = useState(0);
  const [list, setList] = useState([]);

  const handleClick = () => {
    // Urgent update - happens immediately
    setCount(c => c + 1);
    
    // Non-urgent update - can be interrupted
    startTransition(() => {
      setList(Array.from({ length: 20000 }, (_, i) => i));
    });
  };

  return (
    <div className="example-container">
      <h2 className="example-title">1. Basic useTransition</h2>
      <p className="example-description">
        Mark expensive updates as non-urgent to keep the UI responsive.
      </p>
      
      <div className="demo-section">
        <div className="card">
          <h4>Count: {count}</h4>
          <button onClick={handleClick} disabled={isPending}>
            {isPending ? 'Updating...' : 'Increment & Generate List'}
          </button>
          <p><strong>Is Pending:</strong> {isPending ? 'Yes' : 'No'}</p>
        </div>
        
        <div className="card">
          <h4>Generated List ({list.length} items)</h4>
          {isPending ? (
            <p className="loading">Generating list...</p>
          ) : (
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {list.slice(0, 100).map(item => (
                <div key={item} style={{ padding: '2px' }}>
                  Item {item}
                </div>
              ))}
              {list.length > 100 && (
                <p><em>... and {list.length - 100} more items</em></p>
              )}
            </div>
          )}
        </div>
        
        <div className="alert info">
          Notice how the count updates immediately while the list generation doesn't block the UI.
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">Code:</h4>
        <pre><code>{`const BasicExample = () => {
  const [isPending, startTransition] = useTransition();
  const [count, setCount] = useState(0);
  const [list, setList] = useState([]);

  const handleClick = () => {
    // Urgent update - happens immediately
    setCount(c => c + 1);
    
    // Non-urgent update - can be interrupted
    startTransition(() => {
      setList(Array.from({ length: 20000 }, (_, i) => i));
    });
  };

  return (
    <div>
      <h4>Count: {count}</h4>
      <button onClick={handleClick} disabled={isPending}>
        {isPending ? 'Updating...' : 'Update'}
      </button>
      <p>Is Pending: {isPending ? 'Yes' : 'No'}</p>
      <div>List: {list.length} items</div>
    </div>
  );
};`}</code></pre>
      </div>
    </div>
  );
};

// Search example with useTransition
const SearchExample = () => {
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  // Simulate a large dataset
  const data = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
    category: ['electronics', 'clothing', 'books', 'home'][Math.floor(Math.random() * 4)],
    description: `This is the description for item ${i}`
  }));

  const handleSearch = (value) => {
    // Urgent update - input value changes immediately
    setQuery(value);
    
    // Non-urgent update - search results can be delayed
    startTransition(() => {
      if (value.trim() === '') {
        setResults([]);
      } else {
        const filtered = data.filter(item =>
          item.name.toLowerCase().includes(value.toLowerCase()) ||
          item.category.toLowerCase().includes(value.toLowerCase()) ||
          item.description.toLowerCase().includes(value.toLowerCase())
        );
        setResults(filtered);
      }
    });
  };

  return (
    <div className="example-container">
      <h2 className="example-title">2. Search with useTransition</h2>
      <p className="example-description">
        Keep the search input responsive while filtering large datasets.
      </p>
      
      <div className="demo-section">
        <div className="form-group">
          <label>Search (10,000 items):</label>
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Type to search..."
          />
          {isPending && <span className="loading">Searching...</span>}
        </div>
        
        <div className="card">
          <h4>Results ({results.length} found)</h4>
          {query && !isPending && results.length === 0 && (
            <p>No results found for "{query}"</p>
          )}
          
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {results.slice(0, 50).map(item => (
              <div key={item.id} className="card">
                <strong>{item.name}</strong>
                <p><em>{item.category}</em></p>
                <p>{item.description}</p>
              </div>
            ))}
            {results.length > 50 && (
              <p className="alert info">
                Showing first 50 of {results.length} results
              </p>
            )}
          </div>
        </div>
        
        <div className="alert info">
          Try typing quickly - the input stays responsive even during expensive searches.
        </div>
      </div>
    </div>
  );
};

// Tab switching example
const TabSwitchingExample = () => {
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState('tab1');

  const tabs = {
    tab1: { name: 'Posts', component: PostsTab },
    tab2: { name: 'Photos', component: PhotosTab },
    tab3: { name: 'Comments', component: CommentsTab }
  };

  const switchTab = (tabId) => {
    startTransition(() => {
      setActiveTab(tabId);
    });
  };

  const ActiveComponent = tabs[activeTab].component;

  return (
    <div className="example-container">
      <h2 className="example-title">3. Tab Switching</h2>
      <p className="example-description">
        Use useTransition to make tab switching feel more responsive.
      </p>
      
      <div className="demo-section">
        <div className="flex" style={{ marginBottom: '1rem' }}>
          {Object.entries(tabs).map(([tabId, tab]) => (
            <button
              key={tabId}
              onClick={() => switchTab(tabId)}
              className={activeTab === tabId ? '' : 'secondary'}
              disabled={isPending}
            >
              {tab.name}
            </button>
          ))}
        </div>
        
        {isPending && (
          <div className="alert info">Loading tab content...</div>
        )}
        
        <div style={{ opacity: isPending ? 0.6 : 1, transition: 'opacity 0.2s' }}>
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
};

// Mock tab components with expensive rendering
const PostsTab = () => {
  const posts = Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    title: `Post ${i + 1}`,
    content: `This is the content of post ${i + 1}. It contains some text that makes the rendering more expensive.`,
    author: `Author ${Math.floor(i / 10) + 1}`,
    date: new Date(2023, 0, i % 30 + 1).toLocaleDateString()
  }));

  return (
    <div>
      <h4>Posts ({posts.length})</h4>
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {posts.slice(0, 100).map(post => (
          <div key={post.id} className="card">
            <h5>{post.title}</h5>
            <p><small>By {post.author} on {post.date}</small></p>
            <p>{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const PhotosTab = () => {
  const photos = Array.from({ length: 500 }, (_, i) => ({
    id: i,
    title: `Photo ${i + 1}`,
    url: `https://picsum.photos/200/150?random=${i}`,
    description: `Beautiful photo number ${i + 1}`
  }));

  return (
    <div>
      <h4>Photos ({photos.length})</h4>
      <div className="grid grid-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {photos.slice(0, 30).map(photo => (
          <div key={photo.id} className="card">
            <img 
              src={photo.url} 
              alt={photo.title}
              style={{ width: '100%', height: '150px', objectFit: 'cover' }}
            />
            <h6>{photo.title}</h6>
            <p><small>{photo.description}</small></p>
          </div>
        ))}
      </div>
    </div>
  );
};

const CommentsTab = () => {
  const comments = Array.from({ length: 2000 }, (_, i) => ({
    id: i,
    author: `User${i % 50}`,
    content: `This is comment number ${i + 1}. It contains some thoughts and opinions about the topic.`,
    timestamp: new Date(2023, 0, 1, Math.floor(i / 100), i % 60).toLocaleString(),
    likes: Math.floor(Math.random() * 100)
  }));

  return (
    <div>
      <h4>Comments ({comments.length})</h4>
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {comments.slice(0, 150).map(comment => (
          <div key={comment.id} className="card">
            <div className="flex">
              <strong>{comment.author}</strong>
              <small>{comment.timestamp}</small>
            </div>
            <p>{comment.content}</p>
            <p><small>👍 {comment.likes} likes</small></p>
          </div>
        ))}
      </div>
    </div>
  );
};

// List filtering example
const ListFilteringExample = () => {
  const [isPending, startTransition] = useTransition();
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [filteredData, setFilteredData] = useState([]);

  const data = Array.from({ length: 5000 }, (_, i) => ({
    id: i,
    name: `Item ${i + 1}`,
    category: ['urgent', 'normal', 'low'][Math.floor(Math.random() * 3)],
    price: Math.floor(Math.random() * 1000) + 10,
    rating: Math.floor(Math.random() * 5) + 1,
    inStock: Math.random() > 0.3
  }));

  const applyFilters = (newFilter, newSortBy) => {
    startTransition(() => {
      let result = [...data];
      
      // Apply filter
      if (newFilter !== 'all') {
        result = result.filter(item => item.category === newFilter);
      }
      
      // Apply sorting
      result.sort((a, b) => {
        if (newSortBy === 'name') return a.name.localeCompare(b.name);
        if (newSortBy === 'price') return a.price - b.price;
        if (newSortBy === 'rating') return b.rating - a.rating;
        return 0;
      });
      
      setFilteredData(result);
    });
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    applyFilters(newFilter, sortBy);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    applyFilters(filter, newSortBy);
  };

  // Initial load
  React.useEffect(() => {
    applyFilters('all', 'name');
  }, []);

  return (
    <div className="example-container">
      <h2 className="example-title">4. List Filtering & Sorting</h2>
      <p className="example-description">
        Filter and sort large lists without blocking the UI controls.
      </p>
      
      <div className="demo-section">
        <div className="grid grid-2">
          <div className="form-group">
            <label>Filter by category:</label>
            <select value={filter} onChange={(e) => handleFilterChange(e.target.value)}>
              <option value="all">All Categories</option>
              <option value="urgent">Urgent</option>
              <option value="normal">Normal</option>
              <option value="low">Low</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => handleSortChange(e.target.value)}>
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>
        
        {isPending && (
          <div className="alert info">Filtering and sorting...</div>
        )}
        
        <div className="card">
          <h4>Results ({filteredData.length} items)</h4>
          <div style={{ 
            maxHeight: '300px', 
            overflowY: 'auto',
            opacity: isPending ? 0.6 : 1,
            transition: 'opacity 0.2s'
          }}>
            {filteredData.slice(0, 50).map(item => (
              <div key={item.id} className="card">
                <div className="flex">
                  <div style={{ flex: 1 }}>
                    <strong>{item.name}</strong>
                    <p>Category: {item.category} | Price: ${item.price} | Rating: {'⭐'.repeat(item.rating)}</p>
                    <p><span className={`badge ${item.inStock ? 'success' : 'danger'}`}>
                      {item.inStock ? 'In Stock' : 'Out of Stock'}
                    </span></p>
                  </div>
                </div>
              </div>
            ))}
            {filteredData.length > 50 && (
              <p className="alert info">
                Showing first 50 of {filteredData.length} results
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="code-section">
        <h4 className="code-title">Code:</h4>
        <pre><code>{`const ListFilteringExample = () => {
  const [isPending, startTransition] = useTransition();
  const [filter, setFilter] = useState('all');
  const [filteredData, setFilteredData] = useState([]);

  const data = Array.from({ length: 5000 }, (_, i) => ({
    id: i,
    name: \`Item \${i + 1}\`,
    category: ['urgent', 'normal', 'low'][Math.floor(Math.random() * 3)]
  }));

  const applyFilters = (newFilter) => {
    startTransition(() => {
      let result = [...data];
      
      if (newFilter !== 'all') {
        result = result.filter(item => item.category === newFilter);
      }
      
      setFilteredData(result);
    });
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    applyFilters(newFilter);
  };

  return (
    <div>
      <select value={filter} onChange={(e) => handleFilterChange(e.target.value)}>
        <option value="all">All</option>
        <option value="urgent">Urgent</option>
        <option value="normal">Normal</option>
      </select>
      
      {isPending && <div>Filtering...</div>}
      
      <div>
        {filteredData.map(item => (
          <div key={item.id}>{item.name}</div>
        ))}
      </div>
    </div>
  );
};`}</code></pre>
      </div>
    </div>
  );
};

export default UseTransitionExamples;
