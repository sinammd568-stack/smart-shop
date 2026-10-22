const API_URL = import.meta.env.VITE_API_URL || 'https://smart-shop-api-mw7l.onrender.com';

// تابع کمکی برای گرفتن هدرها با توکن
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// ==========================================
// ۱. احراز هویت (Authentication)
// ==========================================

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

// ==========================================
// ۲. محصولات (Products)
// ==========================================

export const fetchProducts = async () => {
  const res = await fetch(`${API_URL}/api/products/`);
  if (!res.ok) throw new Error('خطا در دریافت محصولات');
  const data = await res.json();
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
      ...getAuthHeaders() 
    },
    body: productData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error("Server Error:", err); // 👈 این خط خطا رو دقیق تو کنسول چاپ میکنه
    let errorMsg = 'خطا در ثبت محصول';
    if (err.detail) errorMsg = err.detail;
    else if (typeof err === 'object') {
      // استخراج پیام خطا از فیلدهای مختلف
      errorMsg = Object.keys(err).map(key => `${key}: ${err[key]}`).join(' | ');
    }
    throw new Error(errorMsg);
  }
  return await res.json();
};

// ==========================================
// ۳. کاربران و فروشندگان (Users & Sellers)
// ==========================================

export const createSeller = async (sellerData) => {
  const res = await fetch(`${API_URL}/api/users/`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify({ ...sellerData, is_seller: true }),
  });
  if (!res.ok) {
    // تلاش برای خواندن پیام خطای دقیق از بک‌اند (مثلا نام کاربری تکراری)
    const errorData = await res.json().catch(() => ({}));
    const msg = errorData.username ? 'این نام کاربری قبلا گرفته شده است.' : 'خطا در ساخت فروشنده';
    throw new Error(msg);
  }
  return await res.json();
};

export const getSellerStats = async () => {
  const res = await fetch(`${API_URL}/api/users/stats/`, {
    headers: { ...getAuthHeaders() }
  });
  if (!res.ok) throw new Error('خطا در دریافت آمار فروشندگان');
  return await res.json();
};

export const getUsers = async () => {
  const res = await fetch(`${API_URL}/api/users/`, {
    headers: { ...getAuthHeaders() }
  });
  if (!res.ok) throw new Error('خطا در دریافت لیست کاربران');
  const data = await res.json();
  return data.results || data;
};

// ==========================================
// ۴. سفارشات (Orders)
// ==========================================

export const createOrder = async (orderData) => {
  const res = await fetch(`${API_URL}/api/orders/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) throw new Error('خطا در ثبت سفارش');
  return await res.json();
};

export const getOrders = async () => {
  const res = await fetch(`${API_URL}/api/orders/`, {
    headers: { ...getAuthHeaders() }
  });
  if (!res.ok) throw new Error('خطا در دریافت لیست سفارشات');
  const data = await res.json();
  return data.results || data;
};
