import { useState } from "react";
import { CurrentIndexIndicator } from "@/Components/Translations/CurrentIndexIndicator.jsx";
import TranslationsData from "@/TranslationsData.js";

export const TrueOrFalseAnswer = ({
  isClicked,
  isCorrect,
  isDisabled,
  isEnd,
  data,
  className = "",
  isTest = false,
  length,
  addAnswer,
  componentIndex,
  ...props
}) => {
  const [selectedButtonIndex, setSelectedButtonIndex] = useState(null);
  const buttons = ["False", "True"];
  const styling =
    "md:w-1/2 w-full block h-14 rounded-md transition text-start bg-indigo-100 " +
    (isEnd ? "" : "hover:bg-indigo-300");

  return (
    <div {...props} className={"relative " + className} id={componentIndex}>
      {isTest && (
        <CurrentIndexIndicator index={componentIndex} length={length} />
      )}
      <div className="flex flex-col">
        <div className="flex justify-items-stretch w-full text-xl p-2">
          <div
            className={
              "py-20 w-1/2 text-center relative before:w-[2px] before:rounded-md before:absolute before:right-0 before:top-0 before:h-full before:bg-indigo-500 text-gray-900"
            }
          >
            <span className="absolute top-0 left-0 text-sm text-gray-500 font-semibold">
              Term
            </span>
            <span>{data.term.word}</span>
          </div>
          <div className={"py-20 w-1/2 text-center relative"}>
            <span className="absolute top-0 left-2 text-sm text-gray-500 font-semibold">
              Definition
            </span>
            <span>{data.definition.word}</span>
          </div>
        </div>
        {!isClicked && (
          <p className="mt-2 ml-2">Select the correct definition</p>
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
      </div>
      <div className={"flex flex-col md:flex-row gap-2 my-2 mx-2"}>
        {buttons.map((button, index) => (
          <button
            key={index}
            onClick={() => {
              addAnswer(componentIndex, "TrueOrFalseAnswer", data, index === 1);
              setSelectedButtonIndex(index);
            }}
            disabled={isDisabled}
            className={
              (selectedButtonIndex === index
                ? styling +
                  (isEnd
                    ? isCorrect
                      ? " bg-lime-500 bg-opacity-60"
                      : " bg-red-500 bg-opacity-60"
                    : "") +
                  " border-[3px] border-indigo-500 "
                : styling) +
              (isEnd ? " hover:cursor-not-allowed" : " bg-indigo-100")
            }
          >
            <span className={"ml-4"}>{button}</span>
          </button>
        ))}
      </div>
    </div>
  );
};