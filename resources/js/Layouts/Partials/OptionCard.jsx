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
        "flex flex-col items-center hover:scale-[1.025] transition-all sm:h-full h-1/2 justify-center"
      }
    >
      <div
        className={
          "flex items-center justify-center text-indigo-500 md:text-2xl text-xl font-bold h-fit gap-2"
        }
      >
        <p>{text}</p>
        <FontAwesomeIcon icon={icon} className={"text-amber-500"} />
      </div>
      {children}
    </button>
  );
};