export const OptionCard = ({ className = "", children, ...props }) => {
  return (
    <button
      type={"button"}
      {...props}
      className={
        "xl:w-[30rem] lg:w-[25rem] w-[16rem] xl:h-[30rem] lg:h-[25rem] h-[16rem] aspect-square p-4 flex hover:opacity-[95%] hover:scale-[1.015] transition flex-col border-indigo-500 border-4 rounded-md hover:shadow-xl relative"
      }
    >
      {children}
    </button>
  );
};