import { Headphones, Headset, Watch, Speaker, Keyboard, BatteryCharging, Mouse } from 'lucide-react'

export const CATEGORIES = [
  { id: 'all', label: 'همه' },
  { id: 'audio', label: 'صوتی' },
  { id: 'wearable', label: 'پوشیدنی' },
  { id: 'accessory', label: 'لوازم جانبی' },
]

// ⚠️ شناسه‌ها، نام‌ها و قیمت‌ها باید با backend/chat/catalog.py هماهنگ باشند.
export const PRODUCTS = [
  {
    id: 1, name: 'هدفون بی‌سیم نویزکنسلینگ Aura ANC', price: 1850000, rating: 4.8,
    tag: 'پرفروش', category: 'audio', icon: Headphones,
    description: 'هدفون بی‌سیم با حذف نویز فعال و صدای دقیق؛ مناسب سفر، کار و گوش دادن طولانی به موسیقی.',
    features: ['نویزکنسلینگ فعال (ANC)', 'تا ۴۰ ساعت شارژدهی', 'بلوتوث ۵.۳', 'میکروفون دوگانه برای مکالمه'],
  },
  {
    id: 2, name: 'هدفون گیمینگ Vortex 7.1', price: 1200000, rating: 4.6,
    tag: 'گیمینگ', category: 'audio', icon: Headset,
    description: 'هدفون گیمینگ با صدای فراگیر ۷.۱ و میکروفون جداشدنی برای تجربه‌ای دقیق در بازی‌های رقابتی.',
    features: ['صدای فراگیر مجازی ۷.۱', 'میکروفون جداشدنی', 'پدهای فوم حافظه‌دار', 'نورپردازی RGB'],
  },
  {
    id: 3, name: 'هدفون بلوتوث اقتصادی Pulse Lite', price: 690000, rating: 4.3,
    tag: 'اقتصادی', category: 'audio', icon: Headphones,
    description: 'گزینه‌ای سبک و مقرون‌به‌صرفه برای استفاده روزمره، با کیفیت صدای متعادل.',
    features: ['وزن بسیار سبک', 'تا ۲۰ ساعت شارژدهی', 'بلوتوث ۵.۰', 'قابل تا شدن'],
  },
  {
    id: 4, name: 'ساعت هوشمند Nova Fit 2', price: 3900000, rating: 4.7,
    tag: 'جدید', category: 'wearable', icon: Watch,
    description: 'ساعت هوشمند با نمایشگر AMOLED، پایش فعالیت و ضربان قلب و عمر باتری بالا.',
    features: ['نمایشگر AMOLED', 'پایش ضربان و خواب', 'GPS داخلی', 'مقاوم در برابر آب'],
  },
  {
    id: 5, name: 'اسپیکر بلوتوث ضدآب Boom Mini', price: 1450000, rating: 4.5,
    tag: 'ضدآب', category: 'audio', icon: Speaker,
    description: 'اسپیکر کوچک و مقاوم با باس قوی؛ همراه ایده‌آل برای سفر، کوه و استخر.',
    features: ['استاندارد IP67', 'تا ۱۲ ساعت پخش', 'قابلیت اتصال دو اسپیکر', 'بند حمل'],
  },
  {
    id: 6, name: 'کیبورد مکانیکال Keystone 75', price: 2100000, rating: 4.7,
    tag: 'مکانیکال', category: 'accessory', icon: Keyboard,
    description: 'کیبورد مکانیکال ۷۵٪ با سوییچ‌های قابل تعویض و حس تایپ عالی.',
    features: ['سوییچ Hot-swap', 'چیدمان ۷۵٪', 'اتصال بی‌سیم و سیمی', 'نورپردازی قابل تنظیم'],
  },
  {
    id: 7, name: 'پاوربانک ۲۰۰۰۰ میلی‌آمپر FastCharge', price: 650000, rating: 4.4,
    tag: 'شارژ سریع', category: 'accessory', icon: BatteryCharging,
    description: 'پاوربانک پرظرفیت با شارژ سریع ۲۲.۵ واتی برای موبایل، تبلت و لوازم جانبی.',
    features: ['ظرفیت ۲۰۰۰۰ mAh', 'شارژ سریع ۲۲.۵ وات', 'دو خروجی USB + Type-C', 'نمایشگر درصد شارژ'],
  },
  {
    id: 8, name: 'ماوس بی‌سیم Glide Pro', price: 480000, rating: 4.5,
    tag: 'بی‌سیم', category: 'accessory', icon: Mouse,
    description: 'ماوس بی‌سیم ارگونومیک و بی‌صدا با سنسور دقیق برای کار روزانه.',
    features: ['کلیک بی‌صدا', 'سنسور ۴۰۰۰ DPI', 'اتصال دوگانه', 'باتری ۶ ماهه'],
  },
]

// حداکثر تعداد هر کالا در سبد
export const MAX_QTY = 10

export const getProduct = (id) => PRODUCTS.find((p) => p.id === Number(id))

export const fmt = (n) => new Intl.NumberFormat('fa-IR').format(n)
