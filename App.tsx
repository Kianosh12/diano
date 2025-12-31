import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { UserInputs, KitchenType, ProjectType, CityType, QualityLevel, EstimateResult } from './types';
import InputForm from './components/InputForm';
import EstimateResults from './components/EstimateResults';
import { Zap, Moon, Sun, BrainCircuit, AlertOctagon, RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  // Default to Dark Mode
  const [isDark, setIsDark] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Apply dark mode class to html tag for better browser integration
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const [inputs, setInputs] = useState<UserInputs>({
    area: 80,
    bedrooms: 2,
    bathrooms: 1,
    kitchenType: KitchenType.NORMAL,
    hasParking: false,
    projectType: ProjectType.NEW_BUILD,
    cityType: CityType.METROPOLIS,
    quality: QualityLevel.STANDARD,
  });

  const [result, setResult] = useState<EstimateResult | null>(null);

  const handleCalculate = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    // Scroll to results on mobile immediately
    if (window.innerWidth < 1024) { 
        setTimeout(() => {
             const resultElement = document.getElementById('results-section');
             resultElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }

    try {
      // Initialize GoogleGenAI client with the API key injected via vite.config.ts
      // The define plugin replaces process.env.API_KEY with the string.
      // @ts-ignore
      const apiKey = process.env.API_KEY;

      if (!apiKey) {
        throw new Error("کلید API یافت نشد. لطفاً تنظیمات پروژه را بررسی کنید.");
      }

      const ai = new GoogleGenAI({ apiKey: apiKey });
      
      const prompt = `
        Act as a senior expert Electrical Engineer in Iran with 20 years of experience in residential wiring estimation.
        Analyze the following project details and provide a precise estimation of materials, labor, and costs based on the CURRENT market rates in Iran (Tomans).

        Project Details:
        - Area: ${inputs.area} square meters
        - Bedrooms: ${inputs.bedrooms}
        - Bathrooms: ${inputs.bathrooms}
        - Kitchen Type: ${inputs.kitchenType === KitchenType.HIGH_CONSUMPTION ? 'High Consumption (Fully Electric)' : 'Normal'}
        - Parking: ${inputs.hasParking ? 'Yes' : 'No'}
        - Project Type: ${inputs.projectType === ProjectType.NEW_BUILD ? 'New Construction' : 'Renovation (Rewiring)'}
        - City Type: ${inputs.cityType === CityType.METROPOLIS ? 'Metropolis (Tehran/Major City)' : 'Small Town'}
        - Quality Level: ${inputs.quality}

        Rules for Estimation:
        1. Calculate the exact number of points (lighting, sockets, switches) based on standard engineering norms (Mabhas 13).
        2. Estimate cable lengths (1.5mm for lighting, 2.5mm for sockets, Earth wire) and conduit pipes accurately.
        3. Determine labor costs based on the project type (Renovation is harder/more expensive) and city.
        4. Provide a price range (Low/High) for materials and labor to account for market volatility.
        5. Time estimate should be realistic for a 2-person team.
        6. Provide expert warnings specific to this configuration.

        CRITICAL OUTPUT RULES:
        1. The 'name' of materials and 'warnings' MUST BE IN PERSIAN (FARSI).
        2. Use Iranian market terminology (e.g., "سیم نمره ۱.۵", "فیوز مینیاتوری", "لوله پی‌وی‌سی").
        3. Do NOT use English for material names.
        4. Prices must be in Tomans.

        Return the data strictly in the following JSON structure.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              totalPoints: {
                type: Type.OBJECT,
                properties: {
                  lighting: { type: Type.INTEGER },
                  sockets: { type: Type.INTEGER },
                  switches: { type: Type.INTEGER },
                },
                required: ["lighting", "sockets", "switches"]
              },
              materials: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING, description: "Name of material in PERSIAN/FARSI" },
                    unit: { type: Type.STRING, description: "Unit in Persian (e.g. متر, عدد)" },
                    quantity: { type: Type.NUMBER },
                    unitPriceLow: { type: Type.NUMBER },
                    unitPriceHigh: { type: Type.NUMBER },
                  },
                  required: ["name", "unit", "quantity", "unitPriceLow", "unitPriceHigh"]
                }
              },
              costs: {
                type: Type.OBJECT,
                properties: {
                  materialsLow: { type: Type.NUMBER },
                  materialsHigh: { type: Type.NUMBER },
                  laborLow: { type: Type.NUMBER },
                  laborHigh: { type: Type.NUMBER },
                  totalLow: { type: Type.NUMBER },
                  totalHigh: { type: Type.NUMBER },
                },
                required: ["materialsLow", "materialsHigh", "laborLow", "laborHigh", "totalLow", "totalHigh"]
              },
              timeEstimateDays: { type: Type.NUMBER },
              warnings: {
                type: Type.ARRAY,
                items: { type: Type.STRING, description: "Warning text in PERSIAN/FARSI" }
              }
            },
            required: ["totalPoints", "materials", "costs", "timeEstimateDays", "warnings"]
          }
        }
      });

      if (response.text) {
        const data = JSON.parse(response.text);
        setResult(data as EstimateResult);
      }
    } catch (err: any) {
      console.error("AI Estimation Failed:", err);
      let errorMessage = "مشکلی در ارتباط با هوش مصنوعی پیش آمده است.";
      if (err.message) {
          if (err.message.includes("401") || err.message.includes("API key")) {
             errorMessage = "کلید API معتبر نیست (401).";
          } else if (err.message.includes("Must be set") || err.message.includes("must be set")) {
             errorMessage = "کلید API تنظیم نشده است. لطفاً فایل کانفیگ را بررسی کنید.";
          } else if (err.message.includes("503") || err.message.includes("Overloaded")) {
             errorMessage = "سرویس موقتاً در دسترس نیست. لطفاً دوباره تلاش کنید.";
          } else {
             errorMessage = err.message;
          }
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="transition-colors duration-300">
      <div className="min-h-screen flex flex-col font-sans text-right bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        
        {/* Header - Glassmorphism (Hidden on Print) */}
        <header className="sticky top-0 z-20 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md print:hidden">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 dark:bg-blue-500 p-2 rounded-xl shadow-lg shadow-blue-500/20">
                  <Zap className="text-white w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">برق‌یار</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">دستیار هوشمند برآورد برق</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
               <div className="hidden sm:flex items-center gap-2 text-[11px] font-medium bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-500/20">
                <BrainCircuit className="w-3 h-3" />
                متصل به Gemini AI
              </div>
              <button 
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-3 md:p-6 lg:p-8 print:p-0 print:bg-white">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 print:block">
            
            {/* Left Column: Input Form (Hidden on Print) */}
            <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit z-10 print:hidden">
              <InputForm 
                inputs={inputs} 
                setInputs={setInputs} 
                onCalculate={handleCalculate} 
                isLoading={isLoading}
              />
            </div>

            {/* Right Column: Results (Full width on Print) */}
            <div id="results-section" className="lg:col-span-8 print:w-full scroll-mt-24">
              {isLoading ? (
                 <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                    <div className="relative w-20 h-20 md:w-24 md:h-24 mb-6">
                      <div className="absolute inset-0 border-4 border-slate-200 dark:border-slate-800 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BrainCircuit className="w-8 h-8 md:w-10 md:h-10 text-blue-500 animate-pulse" />
                      </div>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">در حال تحلیل هوشمند</h3>
                    <p className="text-sm md:text-base text-slate-500 dark:text-slate-400">مهندس هوشمند در حال بررسی قیمت‌های روز و محاسبه مقادیر است...</p>
                 </div>
              ) : error ? (
                <div className="bg-red-50 dark:bg-red-900/10 border-2 border-red-200 dark:border-red-900/30 rounded-3xl p-8 md:p-12 flex flex-col items-center justify-center text-center h-full min-h-[400px] animate-in fade-in zoom-in duration-300">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-red-100 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-full flex items-center justify-center mb-6">
                    <AlertOctagon className="w-8 h-8 md:w-10 md:h-10" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-red-700 dark:text-red-300 mb-3">خطا در پردازش</h3>
                  <p className="text-sm md:text-base text-red-600 dark:text-red-400 max-w-md leading-relaxed mb-6 dir-ltr">
                    {error}
                  </p>
                  <button 
                    onClick={handleCalculate}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium transition shadow-lg shadow-red-500/20"
                  >
                    <RefreshCw className="w-4 h-4" />
                    تلاش مجدد
                  </button>
                </div>
              ) : result ? (
                <EstimateResults result={result} />
              ) : (
                <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 flex flex-col items-center justify-center text-center h-full min-h-[400px] transition-colors duration-300 print:hidden">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-50 dark:bg-slate-800 text-blue-400 dark:text-blue-500 rounded-full flex items-center justify-center mb-6">
                    <Zap className="w-8 h-8 md:w-10 md:h-10" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-slate-700 dark:text-slate-200 mb-3">منتظر اطلاعات پروژه شما هستم</h3>
                  <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
                    لطفاً مشخصات ساختمان را وارد کنید تا هوش مصنوعی بر اساس <span className="text-blue-500 font-bold">قیمت‌های روز بازار</span> و استانداردهای مهندسی، برآورد دقیق را به شما ارائه دهد.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Footer (Hidden on Print) */}
        <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 md:py-8 mt-auto transition-colors duration-300 print:hidden">
          <div className="max-w-6xl mx-auto px-4 text-center">
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
                  طراحی شده با ❤️ توسط ایجنت هوشمند Gemini | نسخه 1.3 | <span className="font-bold text-slate-700 dark:text-slate-300">تحلیل آنلاین بازار</span>
              </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;