interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
}

export function Input({
  label,
  helperText,
  id,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-1 block font-medium text-gray-700 text-sm dark:text-gray-300"
      >
        {label}
      </label>
      <input
        id={id}
        className="w-full rounded border bg-gray-50 p-2 outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-60 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
        {...props}
      />
      {helperText && <p className="mt-1 text-gray-500 text-xs">{helperText}</p>}
    </div>
  );
}
