import clsx from 'clsx';

export interface ColorOption {
  id?: string;
  label: string;
  hex: string;
  disabled?: boolean;
}

interface Props {
  selectedId?: string;
  options: ColorOption[];
  onColorChanged: (option: ColorOption) => void;
}

export const ColorSelector = ({ selectedId, options, onColorChanged }: Props) => {
  return (
    <div className="my-5">
      <h3 className="font-bold mb-3">Color disponible</h3>
      <div className="flex flex-wrap gap-3">
        {options.map((option) => {
          const key = option.id ?? option.label;
          const isSelected = key === selectedId;
          return (
            <button
              key={key}
              onClick={() => !option.disabled && onColorChanged(option)}
              title={option.label}
              disabled={option.disabled}
              className={clsx(
                'flex flex-col items-center gap-1 focus:outline-none',
                option.disabled ? 'cursor-not-allowed opacity-50' : 'group'
              )}
            >
              <span
                className={clsx(
                  'w-8 h-8 rounded-full border-2 transition-all',
                  isSelected
                    ? 'border-blue-500 scale-110 shadow-md'
                    : !option.disabled && 'border-gray-300 hover:border-gray-500',
                  option.disabled && 'border-gray-200'
                )}
                style={{ backgroundColor: option.hex }}
              />
              <span
                className={clsx(
                  'text-xs transition-colors',
                  isSelected && !option.disabled ? 'font-semibold text-blue-600' : 'text-gray-500',
                  option.disabled && 'line-through'
                )}
              >
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
