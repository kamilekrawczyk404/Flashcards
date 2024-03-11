import { MainButton } from "@/Components/Buttons/MainButton.jsx";
import { Table } from "@/Components/Buttons/Feedback/Table.jsx";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Animation from "@/Pages/Animation.js";
import { Container } from "@/Components/Container.jsx";
import { getFilePath } from "@/getFilePath.jsx";
import { faFlagCheckered } from "@fortawesome/free-solid-svg-icons";

export const Feedback = ({
  answersResults,
  set,
  routeName,
  finishedTime = null,
  isTest = false,
  bestResult = {},
  groups,
}) => {
  const barWidth = Math.round(
    (answersResults.correctIds.length /
      (answersResults.correctIds.length + answersResults.incorrectIds.length)) *
      100,
  );

  const infoAboutResults = [
    "Awesome work! \nYou're doing this brilliantly! Easy peasy!",
    "Not so bad! \nYou have to spend more time on these translations below. Keep them in mind!",
    "Oh no, your results look bad. \nYou definitely have to resume all translations before next test.",
  ];

  const letterRefs = useRef([]);
  const feedbackRef = useRef(null);
  const [temp, setTemp] = useState(0);
  let selectedIndex;

  if (barWidth <= 100 && barWidth >= 80) selectedIndex = 0;
  else if (barWidth >= 40) selectedIndex = 1;
  else selectedIndex = 2;

  const letterAnimation = (index, delay) => {
    if (barWidth !== 0) {
      letterRefs.current[index].classList.add("-translate-y-2");
      setTimeout(() => {
        letterRefs.current[index].classList.remove("-translate-y-2");
      }, delay);
    }
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

  useLayoutEffect(() => {
    let feedbackAnimation = new Animation([feedbackRef.current]);
    feedbackAnimation.animateAll("", "", "");
  }, [finishedTime]);

  return (
    <>
      <Container
        ref={feedbackRef}
        className="rounded-md bg-gray-100 flex flex-col z-10 p-4 polygon-from-top opacity-0 -translate-y-12 mt-4"
      >
        <div>
          <p className="font-semibold text-xl text-gray-700 whitespace-pre-line">
            {infoAboutResults[selectedIndex]}
          </p>
          <span className="mt-8 font-semibold text-gray-500">
            {answersResults.correctIds.length} /{" "}
            {answersResults.correctIds.length +
              answersResults.incorrectIds.length}{" "}
            (correct answers)
            {finishedTime && (
              <span className="text-indigo-500 ml-2 font-bold">
                ({finishedTime} sec)
              </span>
            )}
          </span>
          <div className="w-full rounded-full my-2 p-[.3rem] bg-gray-100">
            <div
              style={{ "--barWidth": `${barWidth}%` }}
              className={`bg-indigo-500 h-4 rounded-3xl animate-result-bar transition`}
            ></div>
          </div>
        </div>
        {!answersResults.incorrectIds.length && (
          <div
            className={
              "bg-white mt-4 relative flex sm:flex-row flex-col-reverse items-center justify-evenly"
            }
          >
            <img
              className={"w-[25rem]"}
              src={getFilePath("/images/success.jpg")}
              alt="success"
            />
            <div
              className={
                "text-xl bg-gray-100 p-4 rounded-md font-semibold text-gray-700 flex gap-2 flex-col sm:w-fit w-full"
              }
            >
              <div className={"flex items-center relative mb-4"}>
                {"Congratulations!".split("").map((element, index) => {
                  return (
                    <span
                      key={index}
                      ref={(letter) => {
                        letterRefs.current[index] = letter;
                      }}
                      className={
                        "text-2xl font-bold text-lime-500 transform transition-transform"
                      }
                    >
                      {element}
                    </span>
                  );
                })}
                <FontAwesomeIcon
                  icon={faFlagCheckered}
                  className={
                    "text-md transform animate-waving-flag text-2xl ml-2 text-indigo-500"
                  }
                />
              </div>
              <p>You've finished test with no mistakes!</p>
              {bestResult.matching_time > finishedTime && (
                <p>It's your best time!</p>
              )}
            </div>
          </div>
        )}
        {answersResults.incorrectIds.length !== 0 && (
          <Table
            className="mt-8"
            data={answersResults.incorrectIds}
            groups={groups}
          />
        )}
      </Container>

      {!isTest && (
        <div className="flex justify-center items-center mx-auto left-1/2 -translate-x-1/2 gap-4 transition fixed animate-show-from-bottom bottom-0 ">
          <MainButton
            className={"bg-indigo-500 hover:bg-indigo-600 text-gray-100"}
            isRedirect={true}
            href={route("flashcards.showSet", [set.id])}
          >
            Back to the set preview
          </MainButton>
          <MainButton
            className={"bg-indigo-500 hover:bg-indigo-600 text-gray-100"}
            isRedirect={true}
            href={route(`flashcards.${routeName}`, [set.id])}
          >
            Check yourself again
          </MainButton>
        </div>
      )}
    </>
  );
};