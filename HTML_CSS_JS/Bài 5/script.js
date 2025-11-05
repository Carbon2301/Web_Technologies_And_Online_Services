// Bài 5: LocalStorage persistence - lưu/khôi phục sản phẩm
(function () {
    const STORAGE_KEY = 'products';
    
    // Sản phẩm mẫu ban đầu
    const SAMPLE_PRODUCTS = [
      { name: 'Rau má nguyên chất', price: 20000, desc: '100% rau má ép lạnh, không đường, vị thanh mát.' },
      { name: 'Rau má sữa', price: 25000, desc: 'Rau má phối sữa tươi, beo béo dễ uống.' },
      { name: 'Rau má đậu xanh', price: 25000, desc: 'Thơm bùi đậu xanh, mát lành giải nhiệt.' }
    ];
  
    const searchInput = document.querySelector('#searchInput');
    const searchBtn = document.querySelector('#searchBtn');
    const productList = document.querySelector('#product-list');
    const addProductBtn = document.querySelector('#addProductBtn');
    const addProductForm = document.querySelector('#addProductForm');
    const cancelBtn = document.querySelector('#cancelBtn');
    const errorMsg = document.querySelector('#errorMsg');
    const clearStorageBtn = document.querySelector('#clearStorageBtn');
  
    // Lưu danh sách sản phẩm vào LocalStorage
    function saveProducts(products) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
        console.log('Đã lưu', products.length, 'sản phẩm vào LocalStorage');
      } catch (error) {
        console.error('Lỗi lưu LocalStorage:', error);
      }
    }
  
    // Đọc danh sách sản phẩm từ LocalStorage
    function loadProducts() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const products = JSON.parse(stored);
          console.log('Đã tải', products.length, 'sản phẩm từ LocalStorage');
          return products;
        }
      } catch (error) {
        console.error('Lỗi đọc LocalStorage:', error);
      }
      return null;
    }
  
    // Tạo HTML cho một sản phẩm
    function createProductHTML(product) {
      const formatted = new Intl.NumberFormat('vi-VN').format(product.price) + 'đ';
      return `
        <article class="product-item">
          <header><h3 class="product-name">${product.name}</h3></header>
          <p class="product-desc">Mô tả: ${product.desc || '(đang cập nhật)'}</p>
          <p>Giá: <span class="price">${formatted}</span></p>
        </article>
      `;
    }
  
    // Hiển thị danh sách sản phẩm
    function renderProducts(products) {
      if (!productList) return;
      
      productList.innerHTML = '';
      products.forEach(product => {
        const div = document.createElement('div');
        div.innerHTML = createProductHTML(product);
        productList.appendChild(div.firstElementChild);
      });
    }
  
    // Khởi tạo trang - tải sản phẩm từ LocalStorage hoặc dùng mẫu
    function initializeProducts() {
      let products = loadProducts();
      
      if (!products || products.length === 0) {
        // Nếu chưa có dữ liệu, khởi tạo với sản phẩm mẫu
        products = [...SAMPLE_PRODUCTS];
        saveProducts(products);
        console.log('Khởi tạo với sản phẩm mẫu');
      }
      
      renderProducts(products);
    }
  
    // Tìm kiếm/lọc sản phẩm
    function filterProducts() {
      const keyword = (searchInput?.value || '').trim().toLowerCase();
      const items = productList.querySelectorAll('.product-item');
      
      items.forEach((item) => {
        const nameEl = item.querySelector('.product-name') || item.querySelector('h3');
        const nameText = (nameEl?.textContent || '').toLowerCase();
        item.style.display = (!keyword || nameText.includes(keyword)) ? '' : 'none';
      });
    }
  
    // Thêm sản phẩm mới
    function addProduct(name, price, desc) {
      const products = loadProducts() || [];
      const newProduct = { name, price, desc };
      products.unshift(newProduct); // Thêm vào đầu mảng
      saveProducts(products);
      renderProducts(products);
      filterProducts(); // Áp dụng lọc hiện tại
    }
  
    // Xóa tất cả dữ liệu LocalStorage
    function clearStorage() {
      if (confirm('Bạn có chắc muốn xóa tất cả sản phẩm? Hành động này không thể hoàn tác.')) {
        localStorage.removeItem(STORAGE_KEY);
        initializeProducts(); // Khởi tạo lại với sản phẩm mẫu
        console.log('Đã xóa dữ liệu LocalStorage');
      }
    }
  
    // Gắn sự kiện
    if (searchBtn) searchBtn.addEventListener('click', filterProducts);
    if (searchInput) searchInput.addEventListener('keyup', filterProducts);
  
    if (addProductBtn && addProductForm) {
      addProductBtn.addEventListener('click', () => {
        addProductForm.classList.toggle('hidden');
        if (!addProductForm.classList.contains('hidden') && errorMsg) {
          errorMsg.textContent = '';
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
  
        // Thêm sản phẩm và lưu vào LocalStorage
        addProduct(name, priceNum, desc);
  
        // Reset và ẩn form
        addProductForm.reset();
        addProductForm.classList.add('hidden');
      });
    }
  
    if (clearStorageBtn) {
      clearStorageBtn.addEventListener('click', clearStorage);
    }
  
    // Khởi tạo trang khi load
    document.addEventListener('DOMContentLoaded', initializeProducts);
  })();