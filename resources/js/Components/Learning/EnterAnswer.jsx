import { useState } from "react";
import TextInput from "../Form/TextInput.jsx";
import { CurrentIndexIndicator } from "@/Components/CurrentIndexIndicator.jsx";
import TranslationsData from "@/TranslationsData.js";

export const EnterAnswer = ({
    className = "",
    isClicked,
    isCorrect,
    isSeen,
    translation,
    handleOnSubmit,
    componentIndex,
    addAnswer,
    isTest = false,
    isEnd,
    length,
    ...props
}) => {
    const [isHintShown, setIsHintShown] = useState(false);

    const [userDefinition, setUserDefinition] = useState("");
    const [userTranslation, setUserTranslation] = useState("");

    console.log(translation);

    const showHint = (data) => {
        return data[0] + data.slice(1).replaceAll(/[a-z]/gi, "_");
    };
    return (
        <div {...props} className={"relative " + className} id={componentIndex}>
            {isTest && (
                <CurrentIndexIndicator index={componentIndex} length={length} />
            )}
            <span className="text-sm text-gray-500 block font-semibold">
                Term
            </span>
            <button
                onClick={() => setIsHintShown(true)}
                className={
                    "mt-2 px-4 py-2 text-white font-medium bg-indigo-500 transition rounded-md w-fit " +
                    (isEnd || isHintShown
                        ? "cursor-not-allowed"
                        : "hover:bg-indigo-600")
                }
                disabled={isHintShown || isEnd}
            >
                Hint
                <i className="fa-solid fa-paintbrush ml-2"></i>
            </button>
            {isHintShown && (
                <p className="text-gray-700 mt-2 tracking-widest font-medium">
                    {showHint(translation.definition.word)}
                </p>
            )}
            <div className="flex flex-col mt-12">
                <span className="text-2xl text-indigo-500 font-semibold">
                    {translation.term.word}
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
                                  componentIndex,
                                  "EnterAnswer",
                                  translation,
                                  userDefinition,
                                  event,
                              )
                            : handleOnSubmit(
                                  event,
                                  userTranslation,
                                  translation.definition.word,
                                  componentIndex,
                              )
                    }
                >
                    <TextInput
                        isFocused={true}
                        value={isTest ? userDefinition : userTranslation}
                        onChange={(event) => {
                            if (isTest) {
                                addAnswer(
                                    componentIndex,
                                    "EnterAnswer",
                                    translation,
                                    event.target.value,
                                    event,
                                );
                                setUserDefinition(event.target.value);
                            } else {
                                setUserTranslation(event.target.value);
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
                    <div className="mt-4 bg-lime-500 md:w-1/2 w-full bg-opacity-60 rounded-md px-4 py-2">
                        {translation.definition.word}
                    </div>
                )}
            </div>
        </div>
    );
};