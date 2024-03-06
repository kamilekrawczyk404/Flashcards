export const Container = ({ className, children }) => {
  return (
    <div
      className={
        "relative overflow-hidden md:max-w-[62rem] max-w-[76rem] p-4 shadow-sm rounded-md lg:mx-auto bg-white " +
        className
      }
    >
      {children}
    </div>
  );
};