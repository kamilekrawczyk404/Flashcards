export const FormContainer = ({ className, children, ...props }) => {
  return (
    <div
      className={
        "flex items-start justify-center relative before:absolute before:w-3 before:aspect-square before:bg-indigo-500 before:top-1/2 before:-translate-y-1/2 before:rounded-full before:-left-[1.5rem] " +
        className
      }
    >
      {children}
    </div>
  );
};