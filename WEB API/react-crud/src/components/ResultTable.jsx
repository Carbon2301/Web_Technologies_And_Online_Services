import React from 'react';

function ResultTable({ keyword, user, onAdded }) {
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [editing, setEditing] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;

  // Tải dữ liệu 1 lần khi component mount - sử dụng async/await
  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Không thể tải danh sách người dùng. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Thêm user mới khi prop user thay đổi - gọi API POST
  React.useEffect(() => {
    const createUser = async () => {
      if (user) {
        try {
          setError(null);
          const response = await fetch("https://jsonplaceholder.typicode.com/users", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const createdUser = await response.json();
          // Cập nhật UI thủ công sau POST
          setUsers((prev) => [...prev, { ...createdUser, id: prev.length + 1 }]);
          onAdded();
        } catch (error) {
          console.error("Error creating user:", error);
          setError("Không thể thêm người dùng. Vui lòng thử lại sau.");
          // Vẫn cập nhật UI local nếu API fail (vì JSONPlaceholder không lưu thật)
          setUsers((prev) => [...prev, { ...user, id: prev.length + 1 }]);
          onAdded();
        }
      }
    };

    createUser();
  }, [user, onAdded]);

  // Lọc danh sách theo keyword
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(keyword.toLowerCase()) ||
      u.username.toLowerCase().includes(keyword.toLowerCase())
  );

  // Tính toán pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset về trang 1 khi keyword thay đổi
  React.useEffect(() => {
    setCurrentPage(1);
  }, [keyword]);

  // Hàm xóa người dùng - gọi API DELETE
  const removeUser = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      return;
    }

    try {
      setError(null);
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Cập nhật UI thủ công sau DELETE
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Không thể xóa người dùng. Vui lòng thử lại sau.");
      // Vẫn cập nhật UI local nếu API fail
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  };

  // Hàm sửa người dùng - Deep Copy
  function editUser(user) {
    setEditing({ ...user, address: { ...user.address } });
  }

  // Hàm xử lý thay đổi khi edit
  function handleEditChange(field, value) {
    if (["street", "suite", "city"].includes(field)) {
      setEditing({ ...editing, address: { ...editing.address, [field]: value } });
    } else {
      setEditing({ ...editing, [field]: value });
    }
  }

  // Hàm lưu sau khi chỉnh sửa - gọi API PUT
  const saveUser = async () => {
    if (editing.name === "" || editing.username === "") {
      alert("Vui lòng nhập Name và Username!");
      return;
    }

    try {
      setError(null);
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${editing.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editing),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedUser = await response.json();
      // Cập nhật UI thủ công sau PUT
      setUsers(prev => prev.map(u => u.id === editing.id ? updatedUser : u));
      setEditing(null);
    } catch (error) {
      console.error("Error updating user:", error);
      setError("Không thể cập nhật người dùng. Vui lòng thử lại sau.");
      // Vẫn cập nhật UI local nếu API fail
      setUsers(prev => prev.map(u => u.id === editing.id ? editing : u));
      setEditing(null);
    }
  };

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="table-container">
      <h3>Danh sách người dùng ({filteredUsers.length})</h3>
      
      {error && (
        <div className="error-message" style={{
          padding: '12px',
          marginBottom: '20px',
          backgroundColor: '#ffebee',
          color: '#c62828',
          borderRadius: '6px',
          border: '1px solid #ef5350'
        }}>
          {error}
          <button 
            onClick={() => setError(null)}
            style={{
              float: 'right',
              background: 'none',
              border: 'none',
              color: '#c62828',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: 'bold'
            }}
          >
            ×
          </button>
        </div>
      )}
      
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>
                Không tìm thấy người dùng nào
              </td>
            </tr>
          ) : (
            currentUsers.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.phone}</td>
                <td>
                  <button className="btn-edit" onClick={() => editUser(u)}>
                    Sửa
                  </button>
                  <button className="btn-delete" onClick={() => removeUser(u.id)}>
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination" style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
          marginTop: '20px'
        }}>
          <button
            className="btn-pagination"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: currentPage === 1 ? '#ccc' : '#667eea',
              color: 'white',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              opacity: currentPage === 1 ? 0.5 : 1
            }}
          >
            Trước
          </button>
          
          <span style={{ padding: '0 10px', color: '#555' }}>
            Trang {currentPage} / {totalPages}
          </span>
          
          <button
            className="btn-pagination"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: currentPage === totalPages ? '#ccc' : '#667eea',
              color: 'white',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              opacity: currentPage === totalPages ? 0.5 : 1
            }}
          >
            Sau
          </button>
        </div>
      )}

      {/* Modal Edit User */}
      {editing && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>Sửa người dùng</h4>
            
            <div className="form-group">
              <label htmlFor="edit-name">Name:</label>
              <input
                id="edit-name"
                type="text"
                value={editing.name}
                onChange={(e) => handleEditChange("name", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-username">Username:</label>
              <input
                id="edit-username"
                type="text"
                value={editing.username}
                onChange={(e) => handleEditChange("username", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-email">Email:</label>
              <input
                id="edit-email"
                type="email"
                value={editing.email}
                onChange={(e) => handleEditChange("email", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-street">Street:</label>
              <input
                id="edit-street"
                type="text"
                value={editing.address.street}
                onChange={(e) => handleEditChange("street", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-suite">Suite:</label>
              <input
                id="edit-suite"
                type="text"
                value={editing.address.suite}
                onChange={(e) => handleEditChange("suite", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-city">City:</label>
              <input
                id="edit-city"
                type="text"
                value={editing.address.city}
                onChange={(e) => handleEditChange("city", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-phone">Phone:</label>
              <input
                id="edit-phone"
                type="text"
                value={editing.phone}
                onChange={(e) => handleEditChange("phone", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-website">Website:</label>
              <input
                id="edit-website"
                type="text"
                value={editing.website}
                onChange={(e) => handleEditChange("website", e.target.value)}
              />
            </div>

            <div className="form-actions">
              <button className="btn-save" onClick={saveUser}>
                Lưu
              </button>
              <button className="btn-cancel" onClick={() => setEditing(null)}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResultTable;
