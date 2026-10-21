const API_URL = import.meta.env.VITE_API_URL || 'https://smart-shop-api-mw7l.onrender.com';

// تابع کمکی برای گرفتن هدرها با توکن
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// ---------------- احراز هویت ----------------

export const loginUser = async (username, password) => {
  const res = await fetch(`${API_URL}/api/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error('نام کاربری یا رمز عبور اشتباه است');
  const data = await res.json();
  localStorage.setItem('access_token', data.access);
  localStorage.setItem('refresh_token', data.refresh);
  return data;
};

export const getCurrentUser = async () => {
  const res = await fetch(`${API_URL}/api/users/me/`, {
    headers: { ...getAuthHeaders() }
  });
  if (!res.ok) throw new Error('خطا در دریافت اطلاعات کاربر');
  return await res.json();
};

export const logoutUser = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

// ---------------- محصولات ----------------

export const fetchProducts = async () => {
  const res = await fetch(`${API_URL}/api/products/`);
  if (!res.ok) throw new Error('خطا در دریافت محصولات');
  const data = await res.json();
  // پشتیبانی از هر دو حالت صفحه‌بندی شده و لیست ساده
  return data.results || data; 
};

export const fetchProductById = async (id) => {
  const res = await fetch(`${API_URL}/api/products/${id}/`);
  if (!res.ok) throw new Error('محصول پیدا نشد');
  return await res.json();
};

export const createProduct = async (productData) => {
  const res = await fetch(`${API_URL}/api/products/`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(productData),
  });
  if (!res.ok) throw new Error('خطا در ثبت محصول');
  return await res.json();
};

// ---------------- مدیریت کاربران و فروشندگان ----------------

export const createSeller = async (sellerData) => {
  const res = await fetch(`${API_URL}/api/users/`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify({ ...sellerData, is_seller: true }),
  });
  if (!res.ok) throw new Error('خطا در ساخت فروشنده (احتمالاً نام کاربری تکراری است)');
  return await res.json();
};

export const getSellerStats = async () => {
  const res = await fetch(`${API_URL}/api/users/stats/`, {
    headers: { ...getAuthHeaders() }
  });
  if (!res.ok) throw new Error('خطا در دریافت آمار فروشندگان');
  return await res.json();
};

// ---------------- سفارشات ----------------

export const createOrder = async (orderData) => {
  const res = await fetch(`${API_URL}/api/orders/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) throw new Error('خطا در ثبت سفارش');
  return await res.json();
};
