// Remove duplicate basic block; enhanced block below remains

  (function () {
    const STORAGE_KEY = 'products';
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
    // Advanced controls
    const minPriceInput = document.querySelector('#minPrice');
    const maxPriceInput = document.querySelector('#maxPrice');
    const sortBySelect = document.querySelector('#sortBy');
    const loadJsonBtn = document.querySelector('#loadJsonBtn');
    const categoryFilter = document.querySelector('#categoryFilter');
    // Modal
    const modal = document.querySelector('#productModal');
    const modalBody = document.querySelector('#modalBody');
  
    const FADE_MS = 300;
    const COLLAPSE_MS = 500;
  
    function saveProducts(products) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(products)); } catch (_) {}
    }
    function loadProducts() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
      } catch (_) { return null; }
    }
  
    function createProductHTML(product, index) {
      const formatted = new Intl.NumberFormat('vi-VN').format(product.price) + 'đ';
      return `
        <article class="product-item" data-index="${index}">
          <header><h3 class="product-name">${product.name}</h3></header>
          <p class="product-desc">Mô tả: ${product.desc || '(đang cập nhật)'}</p>
          <p>Giá: <span class="price">${formatted}</span></p>
          <p class="product-cat">Danh mục: ${(product.category || '').replace('-', ' ') || '(khác)'} </p>
          <div class="actions">
            <button class="btn-secondary" data-action="detail">Chi tiết</button>
            <button class="btn-danger" data-action="delete">Xóa</button>
          </div>
        </article>
      `;
    }
    function renderProducts(products) {
      if (!productList) return;
      productList.innerHTML = '';
      products.forEach((p, idx) => {
        const wrap = document.createElement('div');
        wrap.innerHTML = createProductHTML(p, idx);
        productList.appendChild(wrap.firstElementChild);
      });
    }
    function initializeProducts() {
      let products = loadProducts();
      if (!products || products.length === 0) {
        products = [...SAMPLE_PRODUCTS];
        saveProducts(products);
      }
      renderProducts(products);
    }
  
    // Sorting helper
    function sortProducts(products, sortKey) {
      const arr = [...products];
      switch (sortKey) {
        case 'name-asc':
          arr.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
          break;
        case 'name-desc':
          arr.sort((a, b) => b.name.localeCompare(a.name, 'vi'));
          break;
        case 'price-asc':
          arr.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          arr.sort((a, b) => b.price - a.price);
          break;
      }
      return arr;
    }

    // Apply combined keyword + price filters, then sort, then render
    function applyFilterAndRender() {
      const all = loadProducts() || [];
      const kw = (searchInput?.value || '').trim().toLowerCase();
      const min = (minPriceInput && minPriceInput.value !== '') ? Number(minPriceInput.value) : NaN;
      const max = (maxPriceInput && maxPriceInput.value !== '') ? Number(maxPriceInput.value) : NaN;

      const filtered = all.filter(p => {
        const matchName = !kw || p.name.toLowerCase().includes(kw);
        const matchMin = Number.isNaN(min) ? true : p.price >= min;
        const matchMax = Number.isNaN(max) ? true : p.price <= max;
        const filterCat = (categoryFilter && categoryFilter.value) ? String(categoryFilter.value).toLowerCase() : '';
        const prodCat = String(p.category || '').toLowerCase();
        const matchCat = !filterCat || prodCat === filterCat;
        return matchName && matchMin && matchMax && matchCat;
      });

      const sorted = sortProducts(filtered, sortBySelect?.value || '');
      renderProducts(sorted);
      bindItemEvents();
      // Smooth fade filter handled by CSS when future per-item toggles are needed
    }

    // Smooth filter for existing DOM (kept for per-item fade if needed)
    function fadeFilterCurrentDOM() {
      const keyword = (searchInput?.value || '').trim().toLowerCase();
      const items = productList.querySelectorAll('.product-item');
      items.forEach((item) => {
        const nameEl = item.querySelector('.product-name') || item.querySelector('h3');
        const nameText = (nameEl?.textContent || '').toLowerCase();
        const shouldShow = !keyword || nameText.includes(keyword);
        const isHiddenDisplay = item.style.display === 'none';
        if (shouldShow) {
          if (isHiddenDisplay) {
            item.style.display = '';
            requestAnimationFrame(() => item.classList.remove('is-hiding'));
          } else {
            item.classList.remove('is-hiding');
          }
        } else if (!item.classList.contains('is-hiding')) {
          item.classList.add('is-hiding');
          setTimeout(() => { item.style.display = 'none'; }, FADE_MS);
        }
      });
    }
  
    // Collapsible helpers
    function openForm() {
      if (!addProductForm) return;
      addProductForm.classList.add('open');
      addProductForm.style.maxHeight = addProductForm.scrollHeight + 'px';
      if (errorMsg) errorMsg.textContent = '';
    }
    function closeForm(reset = false) {
      if (!addProductForm) return;
      addProductForm.style.maxHeight = '0px';
      setTimeout(() => {
        addProductForm.classList.remove('open');
        if (reset) addProductForm.reset();
        if (errorMsg) errorMsg.textContent = '';
      }, COLLAPSE_MS);
    }
    function toggleForm() {
      if (!addProductForm) return;
      const isOpen = addProductForm.classList.contains('open');
      if (isOpen) closeForm(false);
      else openForm();
    }
  
    function addProduct(name, price, desc) {
      const products = loadProducts() || [];
      const newProduct = { name, price, desc };
      products.unshift(newProduct);
      saveProducts(products);
      applyFilterAndRender();
    }
  
    function clearStorage() {
      if (confirm('Bạn có chắc muốn xóa tất cả sản phẩm? Hành động này không thể hoàn tác.')) {
        localStorage.removeItem(STORAGE_KEY);
        initializeProducts();
      }
    }

    // Fetch from JSON with fallback
    async function loadFromJson() {
      try {
        const res = await fetch('./products.json', { cache: 'no-store' });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error('Invalid JSON');
        const normalized = data.map(p => ({
          name: String(p.name || ''),
          price: Number(p.price || 0),
          desc: String(p.desc || ''),
          category: String(p.category || '')
        })).filter(p => p.name && p.price > 0);
        saveProducts(normalized);
        // Clear filters so dữ liệu mới hiện ngay
        if (searchInput) searchInput.value = '';
        if (minPriceInput) minPriceInput.value = '';
        if (maxPriceInput) maxPriceInput.value = '';
        if (sortBySelect) sortBySelect.value = '';
        if (categoryFilter) categoryFilter.value = '';
        applyFilterAndRender();
      } catch (e) {
        alert('Không thể nạp JSON (cần chạy qua server cục bộ). Dùng dữ liệu hiện có.');
      }
    }

    // Modal helpers
    function openModal(product) {
      if (!modal || !modalBody) return;
      modalBody.innerHTML = `
        <p><strong>Tên:</strong> ${product.name}</p>
        <p><strong>Giá:</strong> ${new Intl.NumberFormat('vi-VN').format(product.price)}đ</p>
        <p><strong>Mô tả:</strong> ${product.desc || '(đang cập nhật)'}</p>
      `;
      modal.classList.remove('hidden');
    }
    function closeModal() { modal?.classList.add('hidden'); }
    modal?.addEventListener('click', (e) => {
      if (e.target && e.target.getAttribute('data-close')) closeModal();
    });

    // Bind events for product items (detail/delete)
    function bindItemEvents() {
      productList.querySelectorAll('.product-item').forEach((item) => {
        item.addEventListener('click', (e) => {
          const action = e.target.getAttribute('data-action');
          if (!action) return;
          e.stopPropagation();
          const index = Number(item.getAttribute('data-index'));
          const data = loadProducts() || [];
          if (Number.isNaN(index) || !data[index]) return;
          if (action === 'detail') {
            openModal(data[index]);
          } else if (action === 'delete') {
            if (confirm('Xóa sản phẩm này?')) {
              data.splice(index, 1);
              saveProducts(data);
              applyFilterAndRender();
            }
          }
        });
      });
    }
  
    if (searchBtn) searchBtn.addEventListener('click', applyFilterAndRender);
    if (searchInput) searchInput.addEventListener('keyup', applyFilterAndRender);
    if (minPriceInput) minPriceInput.addEventListener('input', applyFilterAndRender);
    if (maxPriceInput) maxPriceInput.addEventListener('input', applyFilterAndRender);
    if (sortBySelect) sortBySelect.addEventListener('change', applyFilterAndRender);
    if (loadJsonBtn) loadJsonBtn.addEventListener('click', loadFromJson);
  
    if (addProductBtn) addProductBtn.addEventListener('click', toggleForm);
    if (cancelBtn) cancelBtn.addEventListener('click', () => closeForm(true));
  
    if (addProductForm) {
      addProductForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('newName')?.value.trim() || '';
        const priceStr = document.getElementById('newPrice')?.value.trim() || '';
        const desc = (document.getElementById('newDesc')?.value || '').trim();
        const category = document.getElementById('newCategory')?.value || '';
        const priceNum = Number(priceStr);
  
        if (!name) { if (errorMsg) errorMsg.textContent = 'Vui lòng nhập tên sản phẩm.'; return; }
        if (!priceStr || Number.isNaN(priceNum) || priceNum <= 0) { if (errorMsg) errorMsg.textContent = 'Giá phải là số dương hợp lệ.'; return; }
        if (desc && desc.length < 5) { if (errorMsg) errorMsg.textContent = 'Mô tả quá ngắn (≥ 5 ký tự) hoặc để trống.'; return; }
        if (errorMsg) errorMsg.textContent = '';
  
        addProduct(name, priceNum, desc, category);
        closeForm(true);
      });
    }
  
    if (clearStorageBtn) clearStorageBtn.addEventListener('click', clearStorage);
  
    document.addEventListener('DOMContentLoaded', () => {
      initializeProducts();
      applyFilterAndRender();
    });
  })();