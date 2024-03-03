import { AnimatedCheckbox } from "@/Components/AnimatedCheckbox.jsx";

export const FormSection = ({ title, children, className = "" }) => {
  return (
    <div className={"flex flex-col items-start ml-3 gap-8 " + className}>
      <span
        className={
          "bg-indigo-500 rounded-lg px-2 py-1 text-gray-100 font-bold w-fit"
        }
      >
        {title}
      </span>
      {children}
    </div>
  );
};