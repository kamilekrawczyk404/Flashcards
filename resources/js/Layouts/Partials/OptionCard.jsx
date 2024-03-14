import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const OptionCard = ({
  className = "",
  icon,
  text,
  children,
  ...props
}) => {
  return (
    <button
      type={"button"}
      {...props}
      className={
        "flex flex-col items-center justify-center hover:brightness-[1.05] w-full hover:-translate-y-1 hover:scale-[1.025] transition-all lg:h-full h-1/2 py-12"
      }
    >
      <div
        className={
          "flex items-center text-indigo-500 text-2xl font-bold self-justify-center"
        }
      >
        <p>{text}</p>
        <FontAwesomeIcon icon={icon} className={"text-amber-500 ml-2"} />
      </div>
      {children}
    </button>
  );
};