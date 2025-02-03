import { Sprout } from 'lucide-react';

export const Logo = () => (
  <div className="flex items-center gap-2">
    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
      <Sprout className="w-6 h-6 text-white" />
    </div>
    <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
      Krishi Saathi
    </span>
  </div>
);
