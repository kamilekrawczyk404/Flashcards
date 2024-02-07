export default function InputLabel({
    value,
    className = "",
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={`block font-medium text-gray-100 text-md ` + className}
        >
            {value ? value : children}
        </label>
    );
}