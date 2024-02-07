export const Container = (props) => {
    return (
        <div
            className={
                "mt-8 max-w-[76rem] mx-auto p-4 bg-gray-100 shadow-sm sm:rounded-md " +
                props.className
            }
        >
            {props.children}
        </div>
    );
};