import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import EditStudent from './EditStudent';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/edit/:id" element={<EditStudent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
