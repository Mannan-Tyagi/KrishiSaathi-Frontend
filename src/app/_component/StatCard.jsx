// Updated StatCard component with improved design
export const StatCard = ({ title, value, change, up, Icon, description }) => {
  return (
    <div className="group relative bg-white rounded-xl shadow-sm p-6 border border-emerald-100 hover:shadow-lg transition-all duration-200">
      {/* Gradient background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
      
      <div className="relative">
        <div className="flex justify-between items-start">
          {/* Icon with gradient background */}
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500 rounded-lg blur opacity-20"></div>
            <div className="relative w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Icon className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          
          {/* Change indicator */}
          <div className={`flex items-center gap-1 ${up ? 'text-emerald-600 bg-emerald-50' : 'text-red-500 bg-red-50'} px-2 py-1 rounded-full`}>
            {up ? '↑' : '↓'}
            <span className="text-xs font-medium">{change}</span>
          </div>
        </div>

        {/* Title and value */}
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-500">
            {title}
          </h3>
          <p className="mt-2 text-2xl font-bold text-gray-900 group-hover:scale-105 transition-transform">
            {value}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};