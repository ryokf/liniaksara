import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

interface FilterOption {
    label: string;
    value: string;
}

interface FilterDropdownProps {
    label: string;
    options: FilterOption[];
    value: string;
    onChange: (value: string) => void;
}

export default function FilterDropdown({ label, options, value, onChange }: FilterDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);

    const selectedLabel = options.find(opt => opt.value === value)?.label || 'All';

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <span className="flex items-center">
                    <span className="text-gray-500 dark:text-gray-400 mr-2">{label}:</span>
                    <span>{selectedLabel}</span>
                </span>
                <ChevronDown className="w-4 h-4 ml-2" />
            </button>

            {isOpen && (
                <>
                    <div 
                        className="fixed inset-0 z-30" 
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute z-40 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <span>{option.label}</span>
                                {value === option.value && (
                                    <Check className="w-4 h-4 text-blue-600" />
                                )}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
