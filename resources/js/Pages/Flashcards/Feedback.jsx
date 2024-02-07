import { MainButton } from "@/Components/MainButton";
import { Table } from "@/Components/Table";
import { useEffect, useRef, useState } from "react";

export const Feedback = ({
    answersResults,
    length,
    barWidth,
    set,
    routeName,
    finishedTime = null,
    isTest = false,
    bestResult,
}) => {
    const infoAboutResults = [
        "Awesome work! \nYou're doing this brilliantly! Easy peasy!",
        "Not so bad! \nYou have to spend more time on these translations below. Keep them in mind!",
        "Oh no, your results look bad. \nYou definitely have to resume all translations before next test.",
    ];
    const letterRefs = useRef([]);
    const [temp, setTemp] = useState(0);
    let selectedIndex;

    if (barWidth <= 100 && barWidth >= 80) selectedIndex = 0;
    else if (barWidth >= 40) selectedIndex = 1;
    else selectedIndex = 2;

    const letterAnimation = (index, delay) => {
        letterRefs.current[index].classList.add("-translate-y-2");
        setTimeout(() => {
            letterRefs.current[index].classList.remove("-translate-y-2");
        }, delay);
    };

    const animationTimer = setInterval(() => {
        setTemp((prev) => prev + 1);
    }, 2000);

    useEffect(() => {
        for (let i = 1; i <= letterRefs.current.length; i++) {
            setTimeout(() => {
                letterAnimation(i - 1, 100);
            }, 100 * i);
        }

        return () => {
            clearInterval(animationTimer);
        };
    }, [temp]);

    return (
        <>
            <div className="rounded-md bg-gray-100 flex flex-col z-10 p-4">
                <p className="font-semibold text-xl text-gray-700 whitespace-pre-line">
                    {infoAboutResults[selectedIndex]}
                </p>
                <span className="mt-8 font-semibold text-gray-600">
                    {answersResults.correct} / {length} terms
                    {finishedTime && (
                        <span className="text-indigo-500 font-semibold ml-2">
                            ({finishedTime} sec)
                        </span>
                    )}
                </span>
                <div className="w-full rounded-full my-2 border-white p-[.25rem] border-4">
                    <div
                        style={{ "--barWidth": `${barWidth}%` }}
                        className={`bg-indigo-500 h-4 rounded-3xl animate-result-bar transition`}
                    ></div>
                </div>
            </div>
            {(bestResult === -1 || bestResult.matchingTime >= finishedTime) && (
                <div className={"bg-white p-4 rounded-md relative"}>
                    <div
                        className={
                            "text-xl font-semibold text-gray-700 flex gap-5 flex-col"
                        }
                    >
                        <div className={"flex items-center relative"}>
                            {"Congratulations!"
                                .split("")
                                .map((element, index) => {
                                    return (
                                        <span
                                            ref={(letter) => {
                                                letterRefs.current[index] =
                                                    letter;
                                            }}
                                            className={
                                                "text-2xl font-bold text-lime-500 transform transition-transform"
                                            }
                                        >
                                            {element}
                                        </span>
                                    );
                                })}
                            <i className="fa-solid fa-flag-checkered text-md transform animate-waving-flag text-2xl ml-2 text-indigo-500"></i>
                        </div>
                        You've finished with your best time so far. Keep going
                        your learning!
                    </div>
                </div>
            )}
            {answersResults.incorrect.count !== 0 && (
                <Table
                    isPresentingTranslations={true}
                    className="mt-8"
                    columns={Object.keys(
                        answersResults.incorrect.translations[0],
                    )}
                    data={answersResults.incorrect.translations}
                />
            )}

            {!isTest && (
                <div className="flex justify-center items-center mx-auto  left-0 right-0 gap-4 transition fixed animate-show-from-bottom">
                    <MainButton
                        className={
                            "bg-indigo-500 hover:bg-indigo-600 text-gray-100"
                        }
                        isRedirect={true}
                        href={route("flashcards.showSet", [set.id, set.title])}
                    >
                        Back to the set preview
                    </MainButton>
                    <MainButton
                        className={
                            "bg-indigo-500 hover:bg-indigo-600 text-gray-100"
                        }
                        isRedirect={true}
                        href={route(`flashcards.${routeName}`, [
                            set.id,
                            set.title,
                        ])}
                    >
                        Check yourself again
                    </MainButton>
                </div>
            )}
        </>
    );
};