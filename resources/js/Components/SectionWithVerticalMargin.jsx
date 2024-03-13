export const SectionWithVerticalMargin = ({ className, children }) => {
  return (
    <div
      className={
        "lg:h-[calc(90vh-4.25rem)] lg:mb-[50vh] my-[calc(5vh)] sm:h-[calc(90vh-4rem)] overflow-x-hidden h-[100vh] w-full relative min-h-content " +
        className
      }
    >
      {children}
    </div>
  );
};