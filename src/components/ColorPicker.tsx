interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

const colors = [
  '#10b981', // emerald
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#f59e0b', // amber
  '#ef4444', // red
];

export default function ColorPicker({ color, onChange }: ColorPickerProps) {
  return (
    <div className="flex gap-1">
      {colors.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onChange(c)}
          className={`w-8 h-8 rounded-full ${
            color === c ? 'ring-2 ring-offset-2 ring-gray-400' : ''
          }`}
          style={{ backgroundColor: c }}
        />
      ))}
    </div>
  );
}
