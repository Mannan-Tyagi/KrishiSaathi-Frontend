import Image from 'next/image';

export const SearchResults = ({ results, onSelect, getImage }) => (
  <div className="absolute mt-1 w-full bg-white/90 backdrop-blur-md rounded-lg shadow-lg border border-emerald-100 max-h-96 overflow-y-auto">
    {results.map((commodity) => (
      <div
        key={commodity.commodity_id}
        className="flex items-center p-3 hover:bg-emerald-50/80 cursor-pointer transition-colors"
        onClick={() => onSelect(commodity)}
      >
        <Image
          src={getImage(commodity.commodity_name)}
          alt={commodity.commodity_name}
          className="w-12 h-12 rounded-lg object-cover"
          width={48}
          height={48}
        />
        <div className="ml-3 flex-1">
          <div className="text-gray-700 font-medium">{commodity.commodity_name}</div>
          <div className="text-sm text-gray-500">
            {[commodity.commodity_variety, commodity.commodity_grade]
              .filter(Boolean)
              .join(' • ')}
          </div>
          <div className="text-sm text-gray-500">
            {commodity.modal_price ? `₹${commodity.modal_price}` : 'N/A'}
          </div>
        </div>
      </div>
    ))}
  </div>
);