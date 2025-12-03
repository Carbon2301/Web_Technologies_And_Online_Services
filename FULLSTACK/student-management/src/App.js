import axios from 'axios';
import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [stuClass, setStuClass] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get('http://localhost:5000/api/students')
      .then(response => setStudents(response.data))
      .catch(error => console.error("Lỗi khi fetch danh sách:", error));
  }, []);

  const handleAddStudent = (e) => {
    e.preventDefault();
    const newStu = { name, age: Number(age), class: stuClass };
    axios.post('http://localhost:5000/api/students', newStu)
      .then(res => {
        console.log("Đã thêm:", res.data);
        // Cập nhật state students để hiển thị luôn học sinh mới
        setStudents(prev => [...prev, res.data]);
        // Xóa nội dung form sau khi thêm thành công
        setName("");
        setAge("");
        setStuClass("");
        // Hiển thị thông báo thành công
        setMessage("Thêm học sinh thành công!");
        setTimeout(() => setMessage(""), 3000);
      })
      .catch(err => {
        console.error("Lỗi khi thêm:", err);
        setMessage("Lỗi khi thêm học sinh. Vui lòng thử lại!");
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

        {students.length === 0 ? (
          <p>Chưa có học sinh nào</p>
        ) : (
          <table className="student-table">
            <thead>
              <tr>
                <th>Họ tên</th>
                <th>Tuổi</th>
                <th>Lớp</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id || student.id}>
                  <td>{student.name}</td>
                  <td>{student.age}</td>
                  <td>{student.class}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </header>
    </div>
  );
}

export default App;
