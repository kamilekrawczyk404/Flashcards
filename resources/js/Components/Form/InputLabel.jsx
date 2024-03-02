export default function InputLabel({
  value,
  className = "",
  children,
  ...props
}) {
  return (
    <label
      className={`block font-medium text-gray-100 text-md ` + className}
      {...props}
    >
      {value ? value : children}
    </label>
  );
}