export const SectionWithVerticalMargin = ({ className, children }) => {
  return (
    <div className={"h-[calc(100vh-2rem)] w-full relative " + className}>
      {children}
    </div>
  );
};