import { CityType, ProjectType, QualityLevel } from "./types";

// Base Prices in Tomans (Projected for Winter 1404 / Dec 2025)
export const PRICES = {
  WIRE_1_5: 42000,   // Projected ~4.2M per 100m coil
  WIRE_2_5: 68000,   // Projected ~6.8M per 100m coil
  WIRE_EARTH: 55000, // Average estimate
  PIPE_PVC: 48000,   // Pipe + fittings average per meter
  BOX_SWITCH: 22000, // PVC Box
  FUSE_BOX: 1850000, // 12-way surface/flush box (Inflation adjusted)
  MCB_FUSE: 380000,  // Single pole MCB
  // Average cost for Switch/Socket mechanism + Frame
  SWITCH_SOCKET_ECO: 135000,   // Economy
  SWITCH_SOCKET_STD: 280000,   // Standard
  SWITCH_SOCKET_PRM: 1100000,  // Premium/Imported
};

export const LABOR_RATES = {
  // Per point labor (Wiring + Installation + Grooving) - Projected Increase
  [QualityLevel.ECONOMY]: 240000,
  [QualityLevel.STANDARD]: 380000,
  [QualityLevel.PREMIUM]: 650000,
};

export const CITY_COEFFICIENTS = {
  [CityType.METROPOLIS]: 1.25,
  [CityType.TOWN]: 1.0,
};

export const PROJECT_COEFFICIENTS = {
  [ProjectType.NEW_BUILD]: 1.0,
  [ProjectType.RENOVATION]: 1.40,
};

export const WARNINGS_LIST = [
  "این برآورد بر اساس پیش‌بینی قیمت‌ها برای زمستان ۱۴۰۴ (دسامبر ۲۰۲۵) انجام شده است.",
  "قیمت‌های واقعی در زمان اجرا ممکن است بسته به شرایط اقتصادی آن زمان متفاوت باشد.",
  "حتماً از سیم و کابل استاندارد (دارای کد ده رقمی معتبر) استفاده کنید؛ ایمنی را فدای هزینه نکنید.",
  "اجرای سیستم ارتینگ (Earthing) طبق مبحث ۱۳ مقررات ملی ساختمان الزامی است.",
  "هزینه‌های جانبی مانند حمل و نقل، تخریب (در بازسازی) و نصب لوستر جداگانه محاسبه می‌شود.",
  "این محاسبات صرفاً جهت اطلاع‌رسانی و برنامه‌ریزی بودجه است و جایگزین قرارداد رسمی نیست."
];