import React from 'react';
import FormulaEditor from './pages/FormulaEditor';

function App() {
  return (
    <>
      <h1 style={{ textAlign: 'center' }}>Formula Editor</h1>
      <div className="App" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <FormulaEditor />
      </div>
    </>
  );
}

export default App;
