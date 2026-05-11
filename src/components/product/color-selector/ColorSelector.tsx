import clsx from 'clsx';

interface Props {
  selectedColor?: string;
  availableColors: string[];
  onColorChanged: (color: string) => void;
}

function parseColor(colorStr: string): { name: string; hex: string } {
  const idx = colorStr.lastIndexOf(':');
  if (idx !== -1 && colorStr[idx + 1] === '#') {
    return { name: colorStr.slice(0, idx), hex: colorStr.slice(idx + 1) };
  }
  return { name: colorStr, hex: '#cccccc' };
}

export const ColorSelector = ({ selectedColor, availableColors, onColorChanged }: Props) => {
  return (
    <div className="my-5">
      <h3 className="font-bold mb-3">Color disponible</h3>
      <div className="flex flex-wrap gap-3">
        {availableColors.map((colorStr) => {
          const { name, hex } = parseColor(colorStr);
          const isSelected = colorStr === selectedColor;
          return (
            <button
              key={colorStr}
              onClick={() => onColorChanged(colorStr)}
              title={name}
              className={clsx(
                'flex flex-col items-center gap-1 group focus:outline-none'
              )}
            >
              <span
                className={clsx(
                  'w-8 h-8 rounded-full border-2 transition-all',
                  isSelected
                    ? 'border-blue-500 scale-110 shadow-md'
                    : 'border-gray-300 hover:border-gray-500'
                )}
                style={{ backgroundColor: hex }}
              />
              <span
                className={clsx(
                  'text-xs transition-colors',
                  isSelected ? 'font-semibold text-blue-600' : 'text-gray-500'
                )}
              >
                {name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
