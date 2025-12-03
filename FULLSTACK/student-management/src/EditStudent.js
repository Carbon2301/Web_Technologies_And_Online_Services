import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './App.css';

function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [stuClass, setStuClass] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/students/${id}`)
      .then(res => {
        setName(res.data.name);
        setAge(res.data.age);
        setStuClass(res.data.class);
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi khi lấy thông tin học sinh:", err);
        setMessage("Không tìm thấy học sinh!");
        setLoading(false);
      });
  }, [id]);

  const handleUpdate = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:5000/api/students/${id}`, {
      name, age: Number(age), class: stuClass
    })
      .then(res => {
        console.log("Đã cập nhật:", res.data);
        setMessage("Cập nhật học sinh thành công!");
        setTimeout(() => {
          navigate("/");
        }, 1500);
      })
      .catch(err => {
        console.error("Lỗi khi cập nhật:", err);
        setMessage("Lỗi khi cập nhật học sinh. Vui lòng thử lại!");
        setTimeout(() => setMessage(""), 3000);
      });
  };

  if (loading) {
    return (
      <div className="App">
        <header className="App-header">
          <p>Đang tải...</p>
        </header>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Chỉnh sửa thông tin học sinh</h1>
        
        <div className="add-student-form">
          {message && (
            <div className={`message ${message.includes("thành công") ? "success" : "error"}`}>
              {message}
            </div>
          )}
          <form onSubmit={handleUpdate}>
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
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button type="submit">Cập nhật</button>
              <button type="button" onClick={() => navigate("/")} style={{ backgroundColor: '#6c757d' }}>
                Hủy
              </button>
            </div>
          </form>
        </div>
      </header>
    </div>
  );
}

export default EditStudent;

