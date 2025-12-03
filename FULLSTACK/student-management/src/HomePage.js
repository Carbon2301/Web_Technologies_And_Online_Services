import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function HomePage() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [stuClass, setStuClass] = useState("");
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    axios.get('http://localhost:5000/api/students')
      .then(response => setStudents(response.data))
      .catch(error => console.error("Lỗi khi fetch danh sách:", error));
  };

  const handleAddStudent = (e) => {
    e.preventDefault();
    const newStu = { name, age: Number(age), class: stuClass };
    axios.post('http://localhost:5000/api/students', newStu)
      .then(res => {
        console.log("Đã thêm:", res.data);
        setStudents(prev => [...prev, res.data]);
        setName("");
        setAge("");
        setStuClass("");
        setMessage("Thêm học sinh thành công!");
        setTimeout(() => setMessage(""), 3000);
      })
      .catch(err => {
        console.error("Lỗi khi thêm:", err);
        setMessage("Lỗi khi thêm học sinh. Vui lòng thử lại!");
        setTimeout(() => setMessage(""), 3000);
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa học sinh này?")) return;
    
    axios.delete(`http://localhost:5000/api/students/${id}`)
      .then(res => {
        console.log(res.data.message);
        setStudents(prevList => prevList.filter(s => (s._id || s.id) !== id));
        setMessage("Xóa học sinh thành công!");
        setTimeout(() => setMessage(""), 3000);
      })
      .catch(err => {
        console.error("Lỗi khi xóa:", err);
        setMessage("Lỗi khi xóa học sinh. Vui lòng thử lại!");
        setTimeout(() => setMessage(""), 3000);
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Danh sách học sinh</h1>
        
        <div className="add-student-form">
          <h2>Thêm học sinh mới</h2>
          {message && (
            <div className={`message ${message.includes("thành công") ? "success" : "error"}`}>
              {message}
            </div>
          )}
          <form onSubmit={handleAddStudent}>
            <input 
              type="text" 
              placeholder="Họ tên" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
            />
            <input 
              type="number" 
              placeholder="Tuổi" 
              value={age} 
              onChange={e => setAge(e.target.value)} 
              required 
            />
            <input 
              type="text" 
              placeholder="Lớp" 
              value={stuClass} 
              onChange={e => setStuClass(e.target.value)} 
              required 
            />
            <button type="submit">Thêm học sinh</button>
          </form>
        </div>

        <div className="search-container">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button 
            className="sort-btn"
            onClick={() => setSortAsc(prev => !prev)}
          >
            Sắp xếp theo tên: {sortAsc ? 'A → Z' : 'Z → A'}
          </button>
        </div>

        {/* Lọc và sắp xếp danh sách */}
        {(() => {
          const filteredStudents = students.filter(s =>
            s.name.toLowerCase().includes(searchTerm.toLowerCase())
          );

          const sortedStudents = [...filteredStudents].sort((a, b) => {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            if (nameA < nameB) return sortAsc ? -1 : 1;
            if (nameA > nameB) return sortAsc ? 1 : -1;
            return 0;
          });

          if (students.length === 0) {
            return <p>Chưa có học sinh nào</p>;
          }

          if (filteredStudents.length === 0 && searchTerm) {
            return <p>Không tìm thấy học sinh nào phù hợp với "{searchTerm}"</p>;
          }

          return (
            <table className="student-table">
            <thead>
              <tr>
                <th>Họ tên</th>
                <th>Tuổi</th>
                <th>Lớp</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {sortedStudents.map((student) => (
                <tr key={student._id || student.id}>
                  <td>{student.name}</td>
                  <td>{student.age}</td>
                  <td>{student.class}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                      <button 
                        className="edit-btn"
                        onClick={() => navigate(`/edit/${student._id || student.id}`)}
                      >
                        Sửa
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDelete(student._id || student.id)}
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          );
        })()}
      </header>
    </div>
  );
}

export default HomePage;

