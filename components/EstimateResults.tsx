import React from 'react';
import { EstimateResult } from '../types';
import { AlertTriangle, CheckCircle2, Clock, Banknote, ClipboardList, Zap, Share2, Printer, MessageCircle, Send } from 'lucide-react';

interface EstimateResultsProps {
  result: EstimateResult;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fa-IR').format(price);
};

const EstimateResults: React.FC<EstimateResultsProps> = ({ result }) => {

  // Generate a text representation of the invoice for social sharing
  const generateInvoiceText = () => {
    const date = new Date().toLocaleDateString('fa-IR');
    let text = `🧾 *پیش‌فاکتور برآورد برق ساختمان*\n`;
    text += `📅 تاریخ: ${date}\n\n`;
    
    text += `⏱ *زمان اجرا:* ${result.timeEstimateDays} روز کاری\n`;
    text += `💡 *تعداد نقاط:* ${result.totalPoints.lighting + result.totalPoints.sockets + result.totalPoints.switches} عدد\n\n`;
    
    text += `📋 *لیست تجهیزات اصلی:*\n`;
    result.materials.forEach(m => {
        text += `▪️ ${m.name}: ${m.quantity} ${m.unit}\n`;
    });
    
    text += `\n💰 *برآورد مالی (تومان):*\n`;
    text += `🔹 مصالح: ${formatPrice(result.costs.materialsLow)} تا ${formatPrice(result.costs.materialsHigh)}\n`;
    text += `🔹 اجرت: ${formatPrice(result.costs.laborLow)} تا ${formatPrice(result.costs.laborHigh)}\n`;
    text += `🔴 *جمع کل: ${formatPrice(result.costs.totalLow)} تا ${formatPrice(result.costs.totalHigh)}*\n\n`;
    
    text += `⚠ این یک برآورد ماشینی توسط هوش مصنوعی است.\n`;
    text += `🤖 طراحی شده توسط برق‌یار`;
    
    return encodeURIComponent(text);
  };

  const handleWhatsAppShare = () => {
    const text = generateInvoiceText();
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleTelegramShare = () => {
    const text = generateInvoiceText();
    window.open(`https://t.me/share/url?url=${text}&text=`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* Disclaimer Banner */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border-r-4 border-amber-500 p-3 md:p-4 rounded-xl flex gap-3 shadow-sm print:border text-right">
        <AlertTriangle className="text-amber-600 dark:text-amber-500 min-w-5 h-5 mt-1" />
        <div className="text-xs md:text-sm text-amber-900 dark:text-amber-200">
          <p className="font-bold mb-1">توجه مهم:</p>
          <p className="opacity-90 leading-relaxed">این برآورد صرفاً یک تخمین مهندسی برای سال ۱۴۰۴ است و جایگزین بازدید حضوری متخصص نمی‌باشد.</p>
        </div>
      </div>

      {/* Action Buttons (Hidden on Print) */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 print:hidden">
         <button 
           onClick={handlePrint}
           className="col-span-2 md:col-span-1 flex items-center justify-center gap-2 bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 text-white p-3 rounded-xl transition-colors font-medium shadow-md text-sm md:text-base"
         >
           <Printer className="w-5 h-5" />
           چاپ فاکتور رسمی
         </button>
         <button 
           onClick={handleWhatsAppShare}
           className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl transition-colors font-medium shadow-md text-sm md:text-base"
         >
           <MessageCircle className="w-5 h-5" />
           ارسال به واتساپ
         </button>
         <button 
           onClick={handleTelegramShare}
           className="flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white p-3 rounded-xl transition-colors font-medium shadow-md text-sm md:text-base"
         >
           <Send className="w-5 h-5" />
           ارسال به تلگرام
         </button>
      </div>

      {/* Header for Print Only */}
      <div className="hidden print:flex items-center justify-between mb-8 pb-4 border-b-2 border-slate-800">
         <div className="flex items-center gap-2">
            <Zap className="w-8 h-8 text-slate-800" />
            <h1 className="text-2xl font-black text-slate-800">فاکتور برآورد برق‌یار</h1>
         </div>
         <div className="text-left text-sm text-slate-600">
            <p>تاریخ: {new Date().toLocaleDateString('fa-IR')}</p>
            <p>معتبر تا: ۷ روز</p>
         </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 print:grid-cols-2">
        <div className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group print:border-slate-300 print:rounded-xl print:shadow-none">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full transition-transform group-hover:scale-110 print:hidden"></div>
          <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 mb-3 relative z-10">
            <div className="p-2 bg-blue-50 dark:bg-slate-800 rounded-lg text-blue-600 dark:text-blue-400 print:bg-transparent print:p-0">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold print:text-slate-700">زمان تقریبی اجرا</span>
          </div>
          <div className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white relative z-10 print:text-slate-900">
            {new Intl.NumberFormat('fa-IR').format(result.timeEstimateDays)} <span className="text-base md:text-lg font-medium text-slate-500 dark:text-slate-500">روز کاری</span>
          </div>
          <div className="text-xs text-slate-400 dark:text-slate-500 mt-2 relative z-10">تیم ۲ نفره استاندارد</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group print:border-slate-300 print:rounded-xl print:shadow-none">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-bl-full transition-transform group-hover:scale-110 print:hidden"></div>
          <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 mb-3 relative z-10">
            <div className="p-2 bg-purple-50 dark:bg-slate-800 rounded-lg text-purple-600 dark:text-purple-400 print:bg-transparent print:p-0">
              <ClipboardList className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold print:text-slate-700">تعداد کل نقاط</span>
          </div>
          <div className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white relative z-10 print:text-slate-900">
             {new Intl.NumberFormat('fa-IR').format(result.totalPoints.lighting + result.totalPoints.sockets + result.totalPoints.switches)} <span className="text-base md:text-lg font-medium text-slate-500 dark:text-slate-500">نقطه</span>
          </div>
          <div className="text-xs text-slate-400 dark:text-slate-500 mt-2 relative z-10">شامل روشنایی، پریز و کلید</div>
        </div>
      </div>

      {/* Cost Estimate - Dark Themed Gradient (Becomes simple border on Print) */}
      <div className="relative overflow-hidden bg-slate-900 dark:bg-slate-950 text-white rounded-2xl md:rounded-[2rem] p-5 md:p-8 shadow-2xl shadow-slate-300/50 dark:shadow-black/50 border border-slate-800 print:bg-white print:text-black print:border-2 print:border-slate-800 print:shadow-none print:rounded-xl">
        {/* Background Effects (Hidden on Print) */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-600/20 blur-[80px] rounded-full print:hidden"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-purple-600/20 blur-[80px] rounded-full print:hidden"></div>
        
        <div className="relative z-10 flex items-center gap-3 mb-4 md:mb-6 print:mb-4">
          <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm print:bg-slate-200">
            <Banknote className="w-5 h-5 md:w-6 md:h-6 text-emerald-400 print:text-slate-800" />
          </div>
          <h3 className="text-lg md:text-xl font-bold print:text-slate-900">برآورد هزینه نهایی پروژه</h3>
        </div>
        
        <div className="relative z-10 space-y-4 md:space-y-5 print:space-y-2">
          <div className="flex justify-between items-center pb-3 border-b border-white/10 print:border-slate-300">
            <span className="text-slate-400 text-xs md:text-sm font-medium print:text-slate-600">هزینه مصالح و تجهیزات</span>
            <span className="font-bold text-sm md:text-lg dir-ltr text-right text-slate-200 print:text-slate-900">
              {formatPrice(result.costs.materialsLow)} - {formatPrice(result.costs.materialsHigh)} <span className="text-[10px] md:text-xs text-slate-500">تومان</span>
            </span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-white/10 print:border-slate-300">
            <span className="text-slate-400 text-xs md:text-sm font-medium print:text-slate-600">اجرت اجرا (نصب و سیم‌کشی)</span>
            <span className="font-bold text-sm md:text-lg dir-ltr text-right text-slate-200 print:text-slate-900">
              {formatPrice(result.costs.laborLow)} - {formatPrice(result.costs.laborHigh)} <span className="text-[10px] md:text-xs text-slate-500">تومان</span>
            </span>
          </div>
          <div className="pt-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-blue-400 font-bold text-xs md:text-sm print:text-blue-700">مجموع کل (تخمینی)</span>
            </div>
            <div className="flex flex-col md:block text-center bg-white/5 dark:bg-white/5 border border-white/10 p-4 md:p-6 rounded-2xl backdrop-blur-md mt-2 shadow-inner print:bg-slate-100 print:border-slate-300 print:p-4">
               <div className="text-2xl sm:text-3xl md:text-4xl font-black text-white print:text-slate-900 leading-tight">
                  <span className="block md:inline">{formatPrice(result.costs.totalLow)}</span> 
                  <span className="text-sm md:text-lg mx-2 text-slate-500 font-light my-1 md:my-0 block md:inline">تا</span> 
                  <span className="block md:inline">{formatPrice(result.costs.totalHigh)}</span>
               </div>
               <div className="text-xs md:text-sm font-normal text-slate-400 mt-2 print:text-slate-600">تومان</div>
            </div>
          </div>
        </div>
      </div>

      {/* Materials List Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl md:rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm print:rounded-xl print:border-slate-300 print:shadow-none">
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 md:p-5 border-b border-slate-200 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-200 flex justify-between items-center print:bg-slate-100 print:text-slate-900 print:border-slate-300">
          <span className="flex items-center gap-2 text-sm md:text-base">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
            لیست مصالح و تجهیزات
          </span>
          <span className="text-[10px] font-normal bg-white dark:bg-slate-800 border dark:border-slate-700 px-2 py-1 rounded-full text-slate-500 dark:text-slate-400 print:border-slate-300 print:bg-white">مقادیر تقریبی</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm text-right">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 print:bg-slate-50 print:text-slate-700 print:border-slate-300">
              <tr>
                <th className="p-3 md:p-4 font-medium min-w-[120px]">شرح کالا</th>
                <th className="p-3 md:p-4 font-medium text-center">واحد</th>
                <th className="p-3 md:p-4 font-medium text-center">مقدار</th>
                <th className="p-3 md:p-4 font-medium text-left hidden sm:table-cell print:table-cell">قیمت واحد (تومان)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 print:divide-slate-200">
              {result.materials.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition duration-150 print:hover:bg-transparent">
                  <td className="p-3 md:p-4 text-slate-800 dark:text-slate-300 font-medium print:text-slate-900">{item.name}</td>
                  <td className="p-3 md:p-4 text-slate-500 dark:text-slate-500 text-center print:text-slate-700">{item.unit}</td>
                  <td className="p-3 md:p-4 text-blue-600 dark:text-blue-400 font-bold text-center text-base md:text-lg print:text-slate-900">{formatPrice(item.quantity)}</td>
                  <td className="p-3 md:p-4 text-slate-500 dark:text-slate-400 text-left hidden sm:table-cell print:table-cell print:text-slate-700">
                    {formatPrice(item.unitPriceLow)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Points Breakdown */}
      <div className="grid grid-cols-3 gap-2 md:gap-3 text-center text-xs text-slate-600 dark:text-slate-400 print:text-slate-700">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-2 md:p-3 rounded-xl md:rounded-2xl border border-blue-100 dark:border-blue-800/50 print:border-slate-300 print:bg-white">
          <div className="font-bold text-lg md:text-xl text-blue-700 dark:text-blue-400 mb-1 print:text-slate-900">{result.totalPoints.lighting}</div>
          <div>سرخط روشنایی</div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-2 md:p-3 rounded-xl md:rounded-2xl border border-blue-100 dark:border-blue-800/50 print:border-slate-300 print:bg-white">
          <div className="font-bold text-lg md:text-xl text-blue-700 dark:text-blue-400 mb-1 print:text-slate-900">{result.totalPoints.sockets}</div>
          <div>سرخط پریز</div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-2 md:p-3 rounded-xl md:rounded-2xl border border-blue-100 dark:border-blue-800/50 print:border-slate-300 print:bg-white">
          <div className="font-bold text-lg md:text-xl text-blue-700 dark:text-blue-400 mb-1 print:text-slate-900">{result.totalPoints.switches}</div>
          <div>کلید برق</div>
        </div>
      </div>

      {/* Warnings */}
      <div className="bg-white dark:bg-slate-900 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-200 dark:border-slate-800 print:border-slate-300 print:rounded-xl">
        <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2 print:text-slate-900 text-sm md:text-base">
          <CheckCircle2 className="text-emerald-600 dark:text-emerald-500 w-5 h-5 print:text-slate-700" />
          نکات فنی و ایمنی الزامی
        </h4>
        <ul className="space-y-3 md:space-y-4 print:space-y-2">
          {result.warnings.map((warn, idx) => (
            <li key={idx} className="flex gap-3 text-xs md:text-sm text-slate-600 dark:text-slate-400 items-start leading-relaxed print:text-slate-800">
              <span className="block min-w-[6px] h-[6px] rounded-full bg-slate-300 dark:bg-slate-600 mt-2 print:bg-slate-400"></span>
              {warn}
            </li>
          ))}
        </ul>
      </div>

      <div className="hidden print:block text-center text-xs text-slate-400 mt-8 border-t border-slate-200 pt-4">
        این برگه به صورت اتوماتیک توسط سامانه هوشمند برق‌یار صادر شده است.
      </div>

    </div>
  );
};

export default EstimateResults;