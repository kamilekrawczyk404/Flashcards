import { useEffect, useRef, useState } from "react";
import { Feedback } from "@/Pages/Flashcards/Feedback.jsx";
import ProgressBar from "@/Components/ProgressBar";
import { ChooseAnswer } from "@/Components/Learning/ChooseAnswer.jsx";
import { EnterAnswer } from "@/Components/Learning/EnterAnswer.jsx";
import { MainButton } from "@/Components/MainButton";
import { Container } from "@/Components/Container";
import GamesNavigation from "@/Components/Learning/GamesNavigation.jsx";
import { ChooseGroups } from "@/Components/Learning/ChooseGroups.jsx";
import { useGetGroups } from "@/useGetGroups.js";
import { ProgressModal } from "@/Components/ProgressModal.jsx";
import { useFakeLoading } from "@/useFakeLoading.js";
import { updateTranslationStatus } from "@/updateTranslationStatus.js";
import { isTheLastTranslation } from "@/isTheLastTranslation.js";

export default function Learn({ auth, set, groupsNames }) {
  const [isCorrect, setIsCorrect] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isSeen, setIsSeen] = useState(false);
  const [isChoosingGroups, setIsChoosingGroups] = useState(true);
  const [componentProperties, setComponentProperties] = useState(null);
  const [kind, setKind] = useState("");
  const [current, setCurrent] = useState({
    groupIndex: 0,
    translationIndex: 0,
  });
  const [userAnswers, setUserAnswers] = useState({
    correctIds: [],
    incorrectIds: [],
  });

  const kinds = ["choose", "type"];
  const secondsToAnswer = 10000;
  const ref = useRef();

  const { groups, loading } = useGetGroups(
    set,
    isChoosingGroups,
    componentProperties,
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
        current.translationIndex && groups.length > prev.groupIndex + 1
        ? {
            groupIndex: prev.groupIndex + 1,
            translationIndex: 0,
          }
        : {
            groupIndex: prev.groupIndex,
            translationIndex: prev.translationIndex + 1,
          };
    });
  };

  const check = (userAnswer, correctAnswer) => {
    ref.current.style.animationPlayState = "paused";
    setIsClicked(true);

    if (correctAnswer === userAnswer) {
      setUserAnswers((prev) => ({
        ...prev,
        correctIds: [
          ...prev.correctIds,
          groups[current.groupIndex]?.translations[current.translationIndex]
            ?.id,
        ],
      }));
      setIsCorrect(true);
    } else {
      setUserAnswers((prev) => ({
        ...prev,
        incorrectIds: [
          ...prev.incorrectIds,
          groups[current.groupIndex]?.translations[current.translationIndex]
            ?.id,
        ],
      }));
      setIsSeen(true);
    }

    updateTranslationStatus(
      auth.user.id,
      set.id,
      groups[current.groupIndex]?.translations[current.translationIndex].id,
      correctAnswer === userAnswer,
    );
  };

  const refreshProgressAnimation = () => {
    setIsClicked(true);

    if (
      current.translationIndex !== groups[current.groupIndex]?.translationsCount
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
      current.translationIndex !== groups[groups.length - 1].translationsCount
    ) {
      const timer = setTimeout(() => {
        setIsClicked(true);
        setIsSeen(true);
        // If user didn't enter any answer, check two not equals strings
        check("4", "2");
      }, secondsToAnswer);

      setKind(kinds[Math.floor(Math.random() * kinds.length)]);
      setKind("choose");
      setIsClicked(false);
      setIsCorrect(false);
      setIsSeen(false);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [current]);

  return (
    <>
      <GamesNavigation set={set}>
        <span className="text-indigo-500 font-bold">Learn</span>
      </GamesNavigation>

      {isChoosingGroups ? (
        <ChooseGroups
          set={set}
          groupsNames={groupsNames}
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
          {current.translationIndex !==
          groups[current.groupIndex]?.translationsCount ? (
            <>
              <ProgressBar ref={ref} className="top-0 h-4 bg-indigo-500" />
              <Container>
                {groups?.map((group, groupIndex) =>
                  group?.translations.map((translation, translationIndex) => {
                    if (
                      current.translationIndex === translationIndex &&
                      current.groupIndex === groupIndex
                    ) {
                      if (kind === "choose") {
                        return (
                          <ChooseAnswer
                            answers={group.answers}
                            key={translationIndex}
                            translation={translation}
                            isClicked={isClicked}
                            isCorrect={isCorrect}
                            onClickAnswer={onClickAnswer}
                            componentIndex={translationIndex}
                            isForeignLanguage={
                              componentProperties.answersLanguage ===
                              set.target_language
                            }
                          />
                        );
                      } else {
                        return (
                          <EnterAnswer
                            key={translationIndex}
                            translation={translation}
                            isClicked={isClicked}
                            isCorrect={isCorrect}
                            isSeen={isSeen}
                            handleOnSubmit={onSubmit}
                            componentIndex={translationIndex}
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
                  if (!isTheLastTranslation(current, groups))
                    refreshProgressAnimation();
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
              answersResults={userAnswers}
              routeName={"learn"}
              groups={groups}
            />
          )}
        </>
      )}
    </>
  );
}