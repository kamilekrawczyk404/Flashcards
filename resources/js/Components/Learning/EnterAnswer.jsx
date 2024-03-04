import { forwardRef, useLayoutEffect, useRef, useState } from "react";
import TextInput from "../Form/TextInput.jsx";
import { CurrentIndexIndicator } from "@/Components/Translations/CurrentIndexIndicator.jsx";
import Animation from "@/Pages/Animation.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const EnterAnswer = forwardRef(
  (
    {
      className = "",
      isClicked,
      isCorrect,
      isSeen,
      translation,
      groupIndex,
      handleOnSubmit,
      componentIndex,
      addAnswer,
      isTest = false,
      isEnd = false,
      length,
      isForeignLanguage,
      ...props
    },
    ref,
  ) => {
    const [isHintShown, setIsHintShown] = useState(false);
    const [userAnswer, setUserAnswer] = useState("");
    // const [userTranslation, setUserTranslation] = useState("");

    const hintRef = useRef(null);
    const correctAnswerRef = useRef(null);

    useLayoutEffect(() => {
      let hintAnimation = new Animation([hintRef.current]);
      let correctAnswerAnimation = new Animation([correctAnswerRef.current]);
      if (isHintShown) hintAnimation.animateAll("<-.2", "", "");
      if (isSeen) correctAnswerAnimation.animateAll("<-.1", "", "<+.1");
    }, [isHintShown, isSeen]);

    const showHint = (data) => {
      return data[0] + data.slice(1).replaceAll(/[A-z]/gi, "_");
    };

    return (
      <div
        ref={ref}
        {...props}
        className={"relative " + className}
        id={componentIndex}
      >
        {isTest && (
          <CurrentIndexIndicator index={componentIndex} length={length} />
        )}
        <span className="text-sm text-gray-500 block font-semibold">Term</span>
        <button
          onClick={() => setIsHintShown(true)}
          className={
            "mt-2 px-4 py-2 text-white font-medium bg-indigo-500 transition rounded-md w-fit " +
            (isEnd || isHintShown
              ? "cursor-not-allowed"
              : "hover:bg-indigo-600")
          }
          disabled={isHintShown || isEnd || isClicked}
        >
          Hint
          <FontAwesomeIcon icon="fa-solid fa-paintbrush" className={"ml-2"} />
        </button>

        <p
          className="text-gray-700 mt-2 tracking-widest font-medium polygon-from-top -translate-y-6 opacity-0 bg-lime-500 w-fit bg-opacity-60 rounded-md px-2 py-1"
          ref={hintRef}
        >
          {showHint(
            isForeignLanguage ? translation.definition : translation.term,
          )}
        </p>
        <div className={"bg-indigo-500 h-[.25rem] w-[100vw] -ml-4 mt-2 "}></div>
        <div className="flex flex-col mt-12">
          <span className="text-2xl text-indigo-500 font-semibold">
            {isForeignLanguage ? translation.term : translation.definition}
          </span>
          <div className="my-2">
            {!isClicked && <p className="mt-8">Your answer</p>}
            {isClicked && isCorrect && (
              <p className="font-semibold text-lime-600 mt-8">
                Brilliant! Your answer is correct!
              </p>
            )}
            {isClicked && !isCorrect && (
              <p className="font-semibold text-red-600 mt-8">
                Wrong! You'll get it next time!
              </p>
            )}
          </div>
          <form
            className="my-2"
            onSubmit={(event) =>
              isTest
                ? addAnswer(
                    groupIndex,
                    componentIndex,
                    "EnterAnswer",
                    translation,
                    userAnswer,
                    event,
                  )
                : handleOnSubmit(
                    event,
                    userAnswer,
                    isForeignLanguage
                      ? translation.definition
                      : translation.term,
                  )
            }
          >
            <TextInput
              isFocused={true}
              value={userAnswer}
              onChange={(event) => {
                if (isTest) {
                  addAnswer(
                    groupIndex,
                    componentIndex,
                    "EnterAnswer",
                    translation,
                    event.target.value,
                    event,
                  );
                  setUserAnswer(event.target.value);
                } else {
                  setUserAnswer(event.target.value);
                }
              }}
              disabled={isTest ? isEnd : isClicked}
              className={
                !isClicked
                  ? "md:w-1/2 w-full bg-indigo-100"
                  : isCorrect
                    ? "md:w-1/2 w-full bg-lime-500 opacity-60"
                    : "md:w-1/2 w-full bg-red-500 bg-opacity-60"
              }
              placeholder="Enter your translation"
            />
          </form>
          {!isCorrect && isSeen && (
            <div
              ref={correctAnswerRef}
              className="mt-2 bg-lime-500 md:w-1/2 w-full bg-opacity-60 rounded-md px-4 py-2 opacity-0 polygon-from-top -translate-y-12"
            >
              {isForeignLanguage ? translation.definition : translation.term}
            </div>
          )}
        </div>
      </div>
    );
  },
);