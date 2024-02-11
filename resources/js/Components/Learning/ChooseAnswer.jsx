import { CurrentIndexIndicator } from "@/Components/Translations/CurrentIndexIndicator.jsx";
import { useState } from "react";

export const ChooseAnswer = ({
  isClicked,
  isCorrect,
  isTest = false,
  isEnd,
  isForeignLanguage,
  translation,
  onClickAnswer,
  className = "",
  addAnswer,
  componentIndex,
  length,
  ...props
}) => {
  const [selectedButtonIndex, setSelectedButtonIndex] = useState(null);
  const buttons = isForeignLanguage
    ? translation.answers.targetAnswers
    : translation.answers.sourceAnswers;

  const styling =
    "bg-indigo-100 h-14 rounded-md transition-all relative flex flex-col justify-center text-gray-700 " +
    (isEnd || isClicked ? "" : "hover:bg-indigo-300");

  return (
    <form {...props} className={"relative " + className} id={componentIndex}>
      {isTest && (
        <CurrentIndexIndicator index={componentIndex} length={length} />
      )}
      <span className="text-sm text-gray-500 block font-semibold">Term</span>
      <div className="flex flex-col mt-12">
        <span className="text-2xl text-indigo-500 font-semibold">
          {translation.term.word}
        </span>
        {!isClicked && <p className="mt-8">Select the correct definition</p>}
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
                    : " bg-indigo-100"
                  : !isClicked
                    ? " hover:cursor-pointer"
                    : element ===
                        (isForeignLanguage
                          ? translation.definition.word
                          : translation.term.word)
                      ? " bg-lime-500 bg-opacity-60 hover:cursor-not-allowed"
                      : " bg-red-500 bg-opacity-60 hover:cursor-not-allowed")
              }
              key={index}
              onClick={() => {
                isTest
                  ? addAnswer(
                      componentIndex,
                      "ChooseAnswer",
                      translation,
                      element,
                    )
                  : onClickAnswer(
                      isForeignLanguage
                        ? translation.definition.word
                        : translation.term.word,
                      element,
                      componentIndex,
                    );
                setSelectedButtonIndex(index);
              }}
              disabled={isClicked}
            >
              <span className="text-gray-900 absolute left-4">{index + 1}</span>
              <span className="ml-10 inline-block">{element}</span>
            </button>
          ))}
        </div>
      </div>
    </form>
  );
};