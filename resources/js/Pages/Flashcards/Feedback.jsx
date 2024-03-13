import { MainButton } from "@/Components/Buttons/MainButton.jsx";
import { Table } from "@/Components/Buttons/Feedback/Table.jsx";
import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Animation from "@/Pages/Animation.js";
import { Container } from "@/Components/Container.jsx";
import { getFilePath } from "@/getFilePath.jsx";
import { faFlagCheckered } from "@fortawesome/free-solid-svg-icons";
import { ThemeContext } from "@/ThemeContext.jsx";

export const Feedback = ({
  answersResults,
  set,
  routeName,
  finishedTime = null,
  isTest = false,
  bestResult = {},
  groups,
}) => {
  const { properties } = useContext(ThemeContext);
  const barWidth = Math.round(
    (answersResults.correctIds.length /
      (answersResults.correctIds.length + answersResults.incorrectIds.length)) *
      100,
  );

  const feedbackProperties = {
    well: {
      headers: [
        "Wow! You absolutely nailed the test!",
        "Congratulations on acing the test!",
        "Test completed with flying colors!",
        "Bravo! Your performance on the test was outstanding! ",
      ],
      headerColor: "text-lime-500",
      messages: [
        "You're doing this brilliantly! Easy peasy!",
        "Your performance was exceptional and truly impressive. Keep up the fantastic work!",
        "Your hard work and dedication definitely paid off. Keep shining bright!",
        "Your knowledge and skills shine through brightly. Keep up the amazing work and continue to excel!",
      ],
    },
    average: {
      headers: [
        "Well done on finishing the test!",
        "Congratulations on completing the test!",
        "Great job on completing the test! Your dedication is evident.",
      ],
      headerColor: "text-lime-500",
      messages: [
        "While your score may be average, remember that every step forward counts towards progress. Keep up the good work!",
        "Remember, improvement often comes with persistence and determination. Keep pushing forward!",
        "Remember, every experience, including average scores, contributes to your development. Keep moving forward with confidence!",
      ],
    },
    bad: {
      headers: [
        "Your low score doesn't define your potential!",
        "Don't let fear of failure hold you back.",
        "Remember, learning is a journey, not a destination.",
      ],
      headerColor: "text-amber-500",
      messages: [
        "Every setback is an opportunity for growth. With determination and effort, you can improve significantly.",
        "Each step you take towards improvement, no matter how small, brings you closer to your goals.",
        "With dedication and a positive mindset, you can turn your weaknesses into strengths.",
      ],
    },
  };

  const letterRefs = useRef([]);
  const feedbackRef = useRef(null);
  const [temp, setTemp] = useState(0);
  const [feedback, setFeedback] = useState({});

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

  useEffect(() => {
    if (barWidth <= 100 && barWidth >= 80) {
      setFeedback({
        score: "well",
        index: Math.floor(
          Math.random() * feedbackProperties.well.headers.length,
        ),
      });
    } else if (barWidth >= 40) {
      setFeedback({
        score: "average",
        index: Math.floor(
          Math.random() * feedbackProperties.average.headers.length,
        ),
      });
    } else {
      setFeedback({
        score: "bad",
        index: Math.floor(
          Math.random() * feedbackProperties.bad.headers.length,
        ),
      });
    }
  }, []);

  useLayoutEffect(() => {
    let feedbackAnimation = new Animation([feedbackRef.current]);
    feedbackAnimation.animateAll("", "", "");
  }, [finishedTime]);

  return (
    <>
      <Container
        ref={feedbackRef}
        className={
          "rounded-md flex flex-col z-10 p-4 polygon-from-top opacity-0 -translate-y-12 mt-4"
        }
      >
        <div>
          <section
            className={
              properties.text + " font-semibold text-xl whitespace-pre-line"
            }
          >
            {Object.entries(feedbackProperties).map(([key, value]) => {
              if (feedback.score === key)
                return (
                  <>
                    <p className={value.headerColor}>
                      {value.headers[feedback.index]}
                    </p>
                    <p>{value.messages[feedback.index]}</p>
                  </>
                );
            })}
          </section>
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
          <div
            className={
              properties.background + " w-full rounded-full my-2 p-[.3rem]"
            }
          >
            <div
              style={{ "--barWidth": `${barWidth}%` }}
              className={`bg-indigo-500 h-4 rounded-3xl animate-result-bar transition`}
            ></div>
          </div>
        </div>
        {!answersResults.incorrectIds.length && (
          <div
            className={
              properties.background +
              " mt-4 relative flex sm:flex-row flex-col-reverse items-center justify-evenly rounded-md"
            }
          >
            <img
              className={"w-[25rem]"}
              src={getFilePath("/images/success.jpg")}
              alt="success"
            />
            <div
              className={
                properties.container +
                " " +
                properties.text +
                " text-xl p-4 rounded-md font-semibold flex gap-2 flex-col sm:w-fit w-full"
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
        <div className="flex justify-center items-center mx-auto left-1/2 -translate-x-1/2 gap-4 transition fixed animate-show-from-bottom bottom-0 z-10">
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