import { forwardRef, useEffect, useRef, useState } from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

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
    const input = ref ? ref : useRef();
    const [isPasswordHidden, setIsPasswordHidden] = useState(true);

    const eyesOpened = <FontAwesomeIcon icon="fa-solid fa-eye" />
    const eyesClosed = <FontAwesomeIcon icon="fa-solid fa-eye-slash" />

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
        <div className={"relative"}>
            <input
                {...props}
                type={type}
                className={
                    "border-gray-300 rounded-md shadow-sm " +
                    (error ? "bg-red-400 bg-opacity-60 " : "") +
                    className
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
                        "absolute top-[.5rem] text-indigo-500 right-10 text-xl flex items-center justify-center"
                    }
                >
                    <span
                        className={
                            !isPasswordHidden
                                ? "hidden"
                                : "absolute right-[-.05rem] top-[.0rem]"
                        }
                    >
                        {eyesClosed}
                    </span>
                    <span className={isPasswordHidden ? "hidden" : ""}>
                        {eyesOpened}
                    </span>
                </button>
            )}
        </div>
    );
});