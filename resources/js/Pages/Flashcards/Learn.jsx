import { useEffect, useRef, useState } from "react";
import { Feedback } from "@/Pages/Flashcards/Feedback.jsx";
import ProgressBar from "@/Components/Loading/ProgressBar.jsx";
import { ChooseAnswer } from "@/Components/Learning/ChooseAnswer.jsx";
import { EnterAnswer } from "@/Components/Learning/EnterAnswer.jsx";
import { MainButton } from "@/Components/Buttons/MainButton.jsx";
import { Container } from "@/Components/Container";
import GamesNavigation from "@/Components/Learning/GamesNavigation.jsx";
import { LearnChooseGroups } from "@/Components/Learning/LearnChooseGroups.jsx";
import { useGetGroups } from "@/useGetGroups.js";
import { ProgressModal } from "@/Components/Loading/ProgressModal.jsx";
import { useFakeLoading } from "@/useFakeLoading.js";
import { updateTranslationStatus } from "@/updateTranslationStatus.js";
import { isTheLastTranslation } from "@/isTheLastTranslation.js";
import { useFeedbackResults } from "@/useFeedbackResults.js";

export default function Learn({ auth, set, groupsProperties }) {
  const [isCorrect, setIsCorrect] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isSeen, setIsSeen] = useState(false);
  const [isChoosingGroups, setIsChoosingGroups] = useState(true);
  const [feedbackData, setFeedbackData] = useState({});
  const [componentProperties, setComponentProperties] = useState(null);
  const [current, setCurrent] = useState({
    groupIndex: 0,
    componentIndex: 0,
  });

  const secondsToAnswer = 10000;
  const ref = useRef();

  const { groups, loading } = useGetGroups(
    set,
    isChoosingGroups,
    componentProperties,
    "/get-groups-for-learning/",
  );

  const fakeLoading = useFakeLoading(loading);

  const onSubmit = (event, userAnswer, correctAnswer) => {
    event.preventDefault();
    check(userAnswer, correctAnswer);
  };

  const onClickAnswer = (userAnswer, correctAnswer) => {
    check(userAnswer, correctAnswer);
  };

  const next = () => {
    setCurrent((prev) => {
      return groups[current.groupIndex]?.translationsCount - 1 ===
        current.componentIndex && groups.length > prev.groupIndex + 1
        ? {
            groupIndex: prev.groupIndex + 1,
            componentIndex: 0,
          }
        : {
            groupIndex: prev.groupIndex,
            componentIndex: prev.componentIndex + 1,
          };
    });
  };

  const check = (userAnswer, correctAnswer) => {
    ref.current.style.animationPlayState = "paused";
    setIsClicked(true);

    if (correctAnswer === userAnswer) {
      setIsCorrect(true);
    } else {
      setIsSeen(true);
    }

    setFeedbackData(
      useFeedbackResults(
        feedbackData,
        groups,
        current.groupIndex,
        current.componentIndex,
        correctAnswer,
        userAnswer,
      ),
    );

    updateTranslationStatus(
      auth.user.id,
      set.id,
      groups[current.groupIndex]?.components[current.componentIndex].translation
        .id,
      correctAnswer === userAnswer,
    );
  };

  const refreshProgressAnimation = () => {
    setIsClicked(true);

    if (
      current.componentIndex !== groups[current.groupIndex]?.translationsCount
    ) {
      ref.current.style.animationName = "none";

      requestAnimationFrame(() => {
        ref.current.style.animationName = "";
        ref.current.style.animationPlayState = "running";
      });
    }
  };

  useEffect(() => {
    // the last index were causing problems
    // (it was calling the check function even after the learning session had ended)
    if (
      !isChoosingGroups &&
      !fakeLoading &&
      !loading &&
      current.componentIndex !== groups[current.groupIndex]?.translationsCount
    ) {
      setIsClicked(false);
      setIsCorrect(false);
      setIsSeen(false);

      const timer = setTimeout(() => {
        setIsClicked(true);
        setIsSeen(true);
        // If user didn't enter any answer, check two not equals strings
        check("4", "2");
      }, secondsToAnswer);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [current, fakeLoading, loading]);

  return (
    <>
      <GamesNavigation set={set}>
        <span className="text-indigo-500 font-bold">Learn</span>
      </GamesNavigation>

      {isChoosingGroups ? (
        <LearnChooseGroups
          set={set}
          groupsProperties={groupsProperties}
          handleSetComponentProperties={setComponentProperties}
          handleSetIsChoosingGroups={setIsChoosingGroups}
        />
      ) : loading || fakeLoading ? (
        <ProgressModal
          inProgress={loading || fakeLoading}
          text={"We're preparing your learning plan."}
        />
      ) : (
        <>
          {current.componentIndex !==
          groups[current.groupIndex]?.translationsCount ? (
            <>
              <ProgressBar ref={ref} className="top-0 h-4 bg-indigo-500" />
              <Container>
                {groups?.map((group, groupIndex) =>
                  group?.components.map((component, componentIndex) => {
                    if (
                      current.componentIndex === componentIndex &&
                      current.groupIndex === groupIndex
                    ) {
                      if (component.type === "ChooseAnswer") {
                        return (
                          <ChooseAnswer
                            answers={component.answers}
                            key={componentIndex}
                            translation={component.translation}
                            isClicked={isClicked}
                            isCorrect={isCorrect}
                            onClickAnswer={onClickAnswer}
                            componentIndex={componentIndex}
                            isForeignLanguage={
                              componentProperties.answersLanguage ===
                              set.target_language
                            }
                          />
                        );
                      } else {
                        return (
                          <EnterAnswer
                            key={componentIndex}
                            translation={component.translation}
                            isClicked={isClicked}
                            isCorrect={isCorrect}
                            isSeen={isSeen}
                            handleOnSubmit={onSubmit}
                            componentIndex={componentIndex}
                            isForeignLanguage={
                              componentProperties.answersLanguage ===
                              set.target_language
                            }
                          />
                        );
                      }
                    }
                  }),
                )}
              </Container>
              <MainButton
                className="mx-auto left-0 right-0 transition fixed opacity-0 bg-indigo-500 hover:bg-indigo-600 text-gray-100"
                isClicked={isClicked}
                onClick={() => {
                  if (!isTheLastTranslation(current, groups)) {
                    refreshProgressAnimation();
                  }
                  next();
                }}
              >
                {!isTheLastTranslation(current, groups)
                  ? "Move to next"
                  : "Show results"}
              </MainButton>
            </>
          ) : (
            <Feedback
              set={set}
              answersResults={feedbackData}
              routeName={"learn"}
              groups={groups}
            />
          )}
        </>
      )}
    </>
  );
}