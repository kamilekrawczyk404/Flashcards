export const SectionWithVerticalMargin = ({ className, children }) => {
  return (
    <div
      className={
        "lg:h-[calc(90vh-4.5rem)] lg:mb-[50vh] my-[calc(5vh)] sm:h-[calc(90vh-4rem)] h-[100vh] bg-white w-full relative min-h-content  " +
        className
      }
    >
      {children}
    </div>
  );
};