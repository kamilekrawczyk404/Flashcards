export const SectionWithVerticalMargin = ({ className, children }) => {
  return (
    <div className={"lg:h-[calc(100vh-4rem)] w-full relative " + className}>
      {children}
    </div>
  );
};