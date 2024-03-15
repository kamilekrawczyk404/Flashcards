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
        "flex flex-col items-center hover:scale-[1.025] transition-all"
      }
    >
      <div className={"flex items-center text-indigo-500 text-2xl font-bold"}>
        <p>{text}</p>
        <FontAwesomeIcon icon={icon} className={"text-amber-500 ml-2"} />
      </div>
      {children}
    </button>
  );
};