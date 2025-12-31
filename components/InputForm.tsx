import React from 'react';
import { UserInputs, KitchenType, ProjectType, CityType, QualityLevel } from '../types';
import { Building2, Ruler, DoorOpen, Bath, ChefHat, Car, MapPin, Hammer, Award } from 'lucide-react';

interface InputFormProps {
  inputs: UserInputs;
  setInputs: React.Dispatch<React.SetStateAction<UserInputs>>;
  onCalculate: () => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ inputs, setInputs, onCalculate, isLoading }) => {
  
  const handleChange = (field: keyof UserInputs, value: any) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 h-full overflow-y-auto transition-colors duration-300">
      <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white mb-5 md:mb-6 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="bg-blue-100 dark:bg-blue-500/20 p-2 rounded-lg text-blue-600 dark:text-blue-400">
           <Building2 size={20} />
        </div>
        مشخصات پروژه
      </h2>

      <div className="space-y-5 md:space-y-6">
        
        {/* Area with Datalist - Fixed Typing Issue */}
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-2">
            <Ruler className="w-4 h-4" />
            متراژ واحد (متر مربع)
          </label>
          <div className="relative">
            <input
              type="number"
              list="area-options"
              value={inputs.area === 0 ? '' : inputs.area}
              onChange={(e) => {
                const val = e.target.value;
                handleChange('area', val === '' ? 0 : Number(val));
              }}
              className="w-full p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500 transition outline-none text-base text-slate-900 dark:text-white placeholder-slate-400 appearance-none"
              placeholder="مثلاً: 80"
              min={0}
              inputMode="numeric"
            />
            <datalist id="area-options">
              <option value="50">۵۰ متر - سوئیت</option>
              <option value="60">۶۰ متر - تک خواب</option>
              <option value="75">۷۵ متر - دو خواب کوچک</option>
              <option value="90">۹۰ متر - دو خواب استاندارد</option>
              <option value="110">۱۱۰ متر - سه خواب</option>
              <option value="140">۱۴۰ متر - لوکس</option>
              <option value="180">۱۸۰ متر</option>
              <option value="250">۲۵۰ متر</option>
            </datalist>
            <div className="absolute left-3 top-3.5 text-xs text-slate-400 pointer-events-none">
              m²
            </div>
          </div>
        </div>

        {/* Bedrooms & Baths */}
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-2">
              <DoorOpen className="w-4 h-4" />
              تعداد خواب
            </label>
            <select
              value={inputs.bedrooms}
              onChange={(e) => handleChange('bedrooms', Number(e.target.value))}
              className="w-full p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-base text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[0, 1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-2">
              <Bath className="w-4 h-4" />
              سرویس بهداشتی
            </label>
            <select
              value={inputs.bathrooms}
              onChange={(e) => handleChange('bathrooms', Number(e.target.value))}
              className="w-full p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-base text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>

        {/* Kitchen */}
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-2">
            <ChefHat className="w-4 h-4" />
            نوع آشپزخانه
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleChange('kitchenType', KitchenType.NORMAL)}
              className={`p-3 rounded-xl border text-sm transition font-medium ${
                inputs.kitchenType === KitchenType.NORMAL 
                ? 'bg-blue-50 dark:bg-blue-500/20 border-blue-500 dark:border-blue-500 text-blue-700 dark:text-blue-300' 
                : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              معمولی
            </button>
            <button
              onClick={() => handleChange('kitchenType', KitchenType.HIGH_CONSUMPTION)}
              className={`p-3 rounded-xl border text-sm transition font-medium ${
                inputs.kitchenType === KitchenType.HIGH_CONSUMPTION 
                ? 'bg-blue-50 dark:bg-blue-500/20 border-blue-500 dark:border-blue-500 text-blue-700 dark:text-blue-300' 
                : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              پرمصرف
            </button>
          </div>
        </div>

        {/* Parking */}
        <label className="flex items-center gap-3 p-3.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-950 cursor-pointer hover:border-blue-400 dark:hover:border-blue-600 transition">
          <Car className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200 flex-1">پارکینگ اختصاصی</span>
          <div className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={inputs.hasParking} 
              onChange={(e) => handleChange('hasParking', e.target.checked)}
              className="sr-only peer" 
            />
            <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </div>
        </label>

        {/* Project Type & City */}
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-2">
              <Hammer className="w-4 h-4" />
              نوع پروژه
            </label>
            <select
              value={inputs.projectType}
              onChange={(e) => handleChange('projectType', e.target.value)}
              className="w-full p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-base text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value={ProjectType.NEW_BUILD}>نوساز</option>
              <option value={ProjectType.RENOVATION}>بازسازی</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              موقعیت
            </label>
            <select
              value={inputs.cityType}
              onChange={(e) => handleChange('cityType', e.target.value)}
              className="w-full p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-base text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value={CityType.METROPOLIS}>کلان‌شهر</option>
              <option value={CityType.TOWN}>شهرستان</option>
            </select>
          </div>
        </div>

        {/* Quality */}
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-2">
            <Award className="w-4 h-4" />
            سطح کیفیت
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleChange('quality', QualityLevel.ECONOMY)}
              className={`p-2.5 rounded-xl border text-xs font-bold transition ${
                inputs.quality === QualityLevel.ECONOMY 
                ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-400' 
                : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              اقتصادی
            </button>
            <button
              onClick={() => handleChange('quality', QualityLevel.STANDARD)}
              className={`p-2.5 rounded-xl border text-xs font-bold transition ${
                inputs.quality === QualityLevel.STANDARD 
                ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-500 text-blue-700 dark:text-blue-400' 
                : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              معمولی
            </button>
            <button
              onClick={() => handleChange('quality', QualityLevel.PREMIUM)}
              className={`p-2.5 rounded-xl border text-xs font-bold transition ${
                inputs.quality === QualityLevel.PREMIUM 
                ? 'bg-purple-50 dark:bg-purple-500/10 border-purple-500 text-purple-700 dark:text-purple-400' 
                : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              درجه یک
            </button>
          </div>
        </div>

        <button
          onClick={onCalculate}
          disabled={isLoading}
          className={`w-full bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] mt-2 flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
             <>
               <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
               در حال تحلیل...
             </>
          ) : (
            <>
              <Hammer className="w-5 h-5" />
              محاسبه هوشمند
            </>
          )}
        </button>

      </div>
    </div>
  );
};

export default InputForm;