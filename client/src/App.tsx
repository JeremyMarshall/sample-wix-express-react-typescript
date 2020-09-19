import React from 'react';

import Users from './components/Users';
import Tokens from './components/Tokens';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <Users />
        <Tokens />
      </header>
    </div>
  );
}

export default App;
