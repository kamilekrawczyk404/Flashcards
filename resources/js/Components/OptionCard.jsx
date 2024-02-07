export const OptionCard = ({ className = "", children, ...props }) => {
    return (
        <button
            type={"button"}
            {...props}
            className={
                "xl:w-[35rem] lg:w-[30rem] w-[20rem] xl:h-[35rem] lg:h-[30rem] h-[20rem] aspect-square p-4 flex hover:opacity-[95%] hover:scale-[1.015] transition flex-col border-indigo-500 border-4 rounded-md hover:shadow-xl relative"
            }
        >
            {children}
        </button>
    );
};