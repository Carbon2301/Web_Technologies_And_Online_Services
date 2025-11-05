// Tích hợp Bài 4: tìm kiếm, toggle form, validate, thêm sản phẩm (prepend), giữ tương thích tìm kiếm
(function () {
    const searchInput = document.querySelector('#searchInput');
    const searchBtn = document.querySelector('#searchBtn');
    const productList = document.querySelector('#product-list');
  
    const addProductBtn = document.querySelector('#addProductBtn');
    const addProductForm = document.querySelector('#addProductForm');
    const cancelBtn = document.querySelector('#cancelBtn');
    const errorMsg = document.querySelector('#errorMsg');
  
    function filterProducts() {
      const keyword = (searchInput?.value || '').trim().toLowerCase();
      const items = productList.querySelectorAll('.product-item');
      items.forEach((item) => {
        const nameEl = item.querySelector('.product-name') || item.querySelector('h3');
        const nameText = (nameEl?.textContent || '').toLowerCase();
        item.style.display = (!keyword || nameText.includes(keyword)) ? '' : 'none';
      });
    }
  
    if (searchBtn) searchBtn.addEventListener('click', filterProducts);
    if (searchInput) searchInput.addEventListener('keyup', filterProducts);
  
    if (addProductBtn && addProductForm) {
      addProductBtn.addEventListener('click', () => {
        // Toggle hiển thị form
        addProductForm.classList.toggle('hidden');
        // Xóa lỗi khi mở lại form
        if (!addProductForm.classList.contains('hidden')) {
          if (errorMsg) errorMsg.textContent = '';
        }
      });
  
      if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
          addProductForm.classList.add('hidden');
          addProductForm.reset();
          if (errorMsg) errorMsg.textContent = '';
        });
      }
  
      addProductForm.addEventListener('submit', (e) => {
        e.preventDefault();
  
        const nameInput = document.getElementById('newName');
        const priceInput = document.getElementById('newPrice');
        const descInput = document.getElementById('newDesc');
  
        const name = nameInput?.value.trim() || '';
        const priceStr = priceInput?.value.trim() || '';
        const priceNum = Number(priceStr);
        const desc = (descInput?.value || '').trim();
  
        // Validate
        if (!name) {
          if (errorMsg) errorMsg.textContent = 'Vui lòng nhập tên sản phẩm.';
          return;
        }
        if (!priceStr || Number.isNaN(priceNum) || priceNum <= 0) {
          if (errorMsg) errorMsg.textContent = 'Giá phải là số dương hợp lệ.';
          return;
        }
        if (desc && desc.length < 5) {
          if (errorMsg) errorMsg.textContent = 'Mô tả quá ngắn (≥ 5 ký tự) hoặc để trống.';
          return;
        }
        if (errorMsg) errorMsg.textContent = '';
  
        // Tạo phần tử sản phẩm mới
        const article = document.createElement('article');
        article.className = 'product-item';
        article.innerHTML = `
          <header><h3 class="product-name"></h3></header>
          <p class="product-desc"></p>
          <p>Giá: <span class="price"></span></p>
        `;
        article.querySelector('.product-name').textContent = name;
        article.querySelector('.product-desc').textContent = desc ? `Mô tả: ${desc}` : 'Mô tả: (đang cập nhật)';
        // Hiển thị theo chuẩn "xx.xxxđ"
        const formatted = new Intl.NumberFormat('vi-VN').format(priceNum) + 'đ';
        article.querySelector('.price').textContent = formatted;
  
        // Thêm vào đầu danh sách (prepend)
        productList.prepend(article);
  
        // Reset và ẩn form
        addProductForm.reset();
        addProductForm.classList.add('hidden');
  
        // Áp dụng lọc lại (để sản phẩm mới cũng bị/được hiển thị đúng theo từ khóa hiện tại)
        filterProducts();
      });
    }
  })();