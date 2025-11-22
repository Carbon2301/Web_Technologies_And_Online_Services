import React from 'react';
import './App.css';
import SearchForm from './components/SearchForm';
import AddUser from './components/AddUser';
import ResultTable from './components/ResultTable';

function App() {
  const [kw, setKeyword] = React.useState("");
  const [newUser, setNewUser] = React.useState(null);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🧑‍💼 Quản lý người dùng</h1>
        <p>Ứng dụng CRUD với React</p>
      </header>

      <div className="app-content">
        <div className="top-section">
          <SearchForm onChangeValue={setKeyword} />
          <AddUser onAdd={setNewUser} />
        </div>
        
        <ResultTable 
          keyword={kw} 
          user={newUser} 
          onAdded={() => setNewUser(null)} 
        />
      </div>
    </div>
  );
}

export default App;
