// components/SearchableDropdown.jsx
import { Combobox } from '@headlessui/react';
import { useState, useMemo } from 'react';

export default function SearchableDropdown({
  label,
  options,
  selected,
  onSelect,
  disabled
}) {
  const [query, setQuery] = useState('');

  // Safely filter only string options
  const filteredOptions = useMemo(() => {
    const cleanQuery = query.toLowerCase().trim();
    const validStrings = options.filter((opt) => typeof opt === 'string');

    return !cleanQuery
      ? validStrings
      : validStrings.filter((opt) =>
          opt.toLowerCase().includes(cleanQuery)
        );
  }, [query, options]);

  return (
    <div className="relative w-full max-w-md space-y-2">
      {/* Label */}
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      {/* Combobox Wrapper */}
      <Combobox value={selected} onChange={onSelect} disabled={disabled}>
        {({ open }) => (
          <div className="relative">
            {/* Input field */}
            <Combobox.Button as="div" className="cursor-text">
              <Combobox.Input
                className="w-full rounded-lg border border-emerald-100
                           bg-white/80 py-2.5 px-4 text-gray-700
                           shadow-sm transition-colors duration-200
                           focus:border-emerald-500 focus:outline-none
                           focus:ring-2 focus:ring-emerald-500
                           md:text-base"
                displayValue={(opt) => opt || ''}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${label}…`}
              />
            </Combobox.Button>

            {/* Options Panel */}
            {open && (
              <Combobox.Options
                static
                className="absolute z-50 mt-1 w-full rounded-lg bg-white
                           shadow-md ring-1 ring-black/5
                           max-h-60 overflow-auto focus:outline-none
                           transition-all duration-200"
              >
                {/* If no results */}
                {filteredOptions.length === 0 ? (
                  <div className="px-4 py-2 text-sm text-gray-500">
                    No results found
                  </div>
                ) : (
                  filteredOptions.map((option) => (
                    <Combobox.Option key={option} value={option}>
                      {({ active }) => (
                        <div
                          className={`cursor-pointer px-4 py-2 text-sm md:text-base
                            ${
                              active
                                ? 'bg-emerald-100 text-emerald-900'
                                : 'text-gray-700'
                            }`}
                        >
                          {option}
                        </div>
                      )}
                    </Combobox.Option>
                  ))
                )}
              </Combobox.Options>
            )}
          </div>
        )}
      </Combobox>
    </div>
  );
}