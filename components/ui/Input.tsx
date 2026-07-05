type InputProps = {
  label: string;
  type?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function Input({
  label,
  type = "text",
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">{label}</label>

      <input
        type={type}
        className="rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
        {...props}
      />
    </div>
  );
}