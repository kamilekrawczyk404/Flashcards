export const CurrentIndexIndicator = ({ index, length }) => {
    return (
        <span className={"absolute top-3 right-3 text-sm text-gray-900"}>
            {index + 1} / {length}
        </span>
    );
};