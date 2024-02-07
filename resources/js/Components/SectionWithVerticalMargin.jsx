export const SectionWithVerticalMargin = ({ className, children }) => {
    return (
        <div
            className={
                "lg:h-[calc(90vh-4.5rem)] lg:mb-[50vh] my-[calc(5vh)] h-[calc(90vh-4rem)] bg-white w-full relative " +
                className
            }
        >
            {children}
        </div>
    );
};