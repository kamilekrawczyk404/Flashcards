import { CurrentIndexIndicator } from "@/Components/Translations/CurrentIndexIndicator.jsx";
import { forwardRef, useContext, useState } from "react";
import { ThemeContext } from "@/ThemeContext.jsx";

export const ChooseAnswer = forwardRef(
  (
    {
      isClicked,
      isCorrect,
      isEnd,
      isForeignLanguage,
      translation,
      answers,
      onClickAnswer,
      addAnswer,
      componentIndex,
      groupIndex,
      length,
      className = "",
      isTest = false,
      isEmpty = false,
      wasCheckedOnce = false,
      ...props
    },
    ref,
  ) => {
    const { properties } = useContext(ThemeContext);
    const [selectedButtonIndex, setSelectedButtonIndex] = useState(null);
    const buttons = isForeignLanguage
      ? answers.targetAnswers
      : answers.sourceAnswers;

    const styling =
      properties.text +
      " " +
      properties.background +
      " h-14 rounded-md transition-all relative flex flex-col justify-center " +
      (isEnd || isClicked ? "" : "hover:brightness-75 ");

    return (
      <form
        ref={ref}
        {...props}
        className={
          "relative " +
          (isTest
            ? (wasCheckedOnce && isEmpty
                ? "bg-red-300 "
                : properties.background + " ") +
              (isEnd
                ? isCorrect
                  ? "border-2 border-lime-500 "
                  : "border-2 border-red-500 "
                : "") +
              "rounded-md p-4 "
            : "") +
          className
        }
        id={componentIndex}
      >
        {isTest && (
          <CurrentIndexIndicator index={componentIndex} length={length} />
        )}
        <span className="text-sm text-gray-500 block font-semibold">Term</span>
        <div className="flex flex-col mt-12">
          <span className="text-2xl text-indigo-500 font-semibold">
            {isForeignLanguage ? translation.term : translation.definition}
          </span>
          {!isClicked && (
            <p className={properties.text + " mt-8"}>
              Select the correct definition
            </p>
          )}
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
          <div className="grid md:grid-cols-2 grid-cols-1 gap-2 mt-2">
            {buttons.map((element, index) => (
              <button
                type={"button"}
                className={
                  styling +
                  (isTest
                    ? selectedButtonIndex === index
                      ? (isEnd
                          ? isCorrect
                            ? " hover:cursor-not-allowed bg-lime-500 bg-opacity-60 border-none"
                            : " hover:cursor-not-allowed bg-red-500 bg-opacity-60 border-none"
                          : " ") + " border-[3px] border-indigo-500 "
                      : " " + properties.container
                    : !isClicked
                      ? " hover:cursor-pointer"
                      : element ===
                          (isForeignLanguage
                            ? translation.definition
                            : translation.term)
                        ? " bg-lime-500 bg-opacity-60 hover:cursor-not-allowed"
                        : " bg-red-700 bg-opacity-60 hover:cursor-not-allowed")
                }
                key={index}
                onClick={() => {
                  isTest
                    ? addAnswer(
                        groupIndex,
                        componentIndex,
                        "ChooseAnswer",
                        translation,
                        element,
                      )
                    : onClickAnswer(
                        isForeignLanguage
                          ? translation.definition
                          : translation.term,
                        element,
                      );
                  setSelectedButtonIndex(index);
                }}
                disabled={isClicked}
              >
                <span className={"text-lg absolute left-4 font-bold"}>
                  {index + 1}
                </span>
                <span className="ml-10 inline-block">{element}</span>
              </button>
            ))}
          </div>
        </div>
      </form>
    );
  },
);