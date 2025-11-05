// Giải thích: JS thao tác DOM theo yêu cầu Bài 3 (tìm kiếm, toggle form, thêm sản phẩm)
(function () {
    // Lấy các phần tử cần dùng
    const searchInput = document.querySelector('#searchInput');
    const searchBtn = document.querySelector('#searchBtn');
    const productList = document.querySelector('#product-list');
  
    const addProductBtn = document.querySelector('#addProductBtn');
    const addProductForm = document.querySelector('#addProductForm');
  
    // Tìm kiếm/lọc sản phẩm theo tên (không phân biệt hoa thường)
    function filterProducts() {
      const keyword = (searchInput?.value || '').trim().toLowerCase();
      const items = productList.querySelectorAll('.product-item');
  
      items.forEach((item) => {
        const nameEl = item.querySelector('.product-name') || item.querySelector('h3');
        const nameText = (nameEl?.textContent || '').toLowerCase();
        // Hiển thị nếu tên chứa từ khóa; ngược lại ẩn
        if (!keyword || nameText.includes(keyword)) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    }
  
    // Gắn sự kiện cho nút tìm và nhập liệu
    if (searchBtn) {
      searchBtn.addEventListener('click', filterProducts);
    }
    if (searchInput) {
      // Cho phép Enter để tìm nhanh, và lọc theo thời gian thực
      searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') filterProducts();
        else filterProducts();
      });
    }
  
    // Toggle ẩn/hiện form "Thêm sản phẩm"
    if (addProductBtn && addProductForm) {
      addProductBtn.addEventListener('click', () => {
        addProductForm.classList.toggle('hidden');
      });
  
      // Xử lý submit form thêm sản phẩm
      addProductForm.addEventListener('submit', (e) => {
        e.preventDefault();
  
        // Lấy dữ liệu từ form
        const name = addProductForm.querySelector('#pName')?.value?.trim();
        const desc = addProductForm.querySelector('#pDesc')?.value?.trim();
        const price = addProductForm.querySelector('#pPrice')?.value?.trim();
  
        if (!name || !desc || !price) return;
  
        // Tạo phần tử sản phẩm mới theo cấu trúc hiện có
        const article = document.createElement('article');
        article.className = 'product-item';
        article.innerHTML = `
          <header><h3 class="product-name"></h3></header>
          <p></p>
          <p>Giá: <span class="price"></span></p>
        `;
        article.querySelector('.product-name').textContent = name;
        article.querySelectorAll('p')[0].textContent = `Mô tả: ${desc}`;
        article.querySelector('.price').textContent = price.endsWith('đ') ? price : `${price}đ`;
  
        // Thêm vào danh sách
        productList.appendChild(article);
  
        // Dọn form và ẩn lại
        addProductForm.reset();
        addProductForm.classList.add('hidden');
  
        // Nếu đang có từ khóa tìm kiếm, áp dụng lọc lại
        filterProducts();
      });
    }
  })();