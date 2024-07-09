import { forwardRef, useContext, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { ThemeContext } from "@/ThemeContext.jsx";

export default forwardRef(function TextInput(
  {
    type = "text",
    className = "",
    isFocused = false,
    autofocus = false,
    error = false,
    ...props
  },
  ref,
) {
  const { properties } = useContext(ThemeContext);

  const input = ref ? ref : useRef();
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);

  const isDisabled = props?.disabled ?? false;

  console.log(isDisabled);

  const eyesOpened = <FontAwesomeIcon icon={faEye} />;
  const eyesClosed = <FontAwesomeIcon icon={faEyeSlash} />;

  const changeVisibility = () => {
    setIsPasswordHidden(!isPasswordHidden);
    input.current.type === "password"
      ? (input.current.type = "text")
      : (input.current.type = "password");
  };

  useEffect(() => {
    if (isFocused) {
      input.current.focus();
    }
  }, []);

  return (
    <div className={"relative w-full"}>
      <input
        {...props}
        type={type}
        className={
          `${
            isDisabled
              ? `${properties.disabledBackground} ${properties.disabledBorder} ${properties.disabledText} cursor-not-allowed`
              : `${properties.container} ${properties.text} ${properties.border} cursor-pointer`
          }  rounded-md shadow-sm ` +
          (error
            ? "bg-red-700 bg-opacity-60 "
            : "" + (type === "number" ? " w-24 " : " w-full ") + className)
        }
        ref={input}
        autoFocus={autofocus}
        autoComplete={undefined}
      />
      {type === "password" && (
        <button
          onClick={() => changeVisibility()}
          type={"button"}
          className={
            "absolute top-1/2 -translate-y-1/2 right-5 text-indigo-500 text-xl flex items-center justify-center"
          }
        >
          <span className={!isPasswordHidden ? "hidden" : "absolute"}>
            {eyesClosed}
          </span>
          <span className={isPasswordHidden ? "hidden" : "absolute"}>
            {eyesOpened}
          </span>
        </button>
      )}
    </div>
  );
});