import { useEffect, useRef, useState } from "react";
import { Feedback } from "@/Pages/Flashcards/Feedback.jsx";
import ProgressBar from "@/Components/ProgressBar";
import { ChooseAnswer } from "@/Components/Learning/ChooseAnswer.jsx";
import { EnterAnswer } from "@/Components/Learning/EnterAnswer.jsx";
import { MainButton } from "@/Components/MainButton";
import { Container } from "@/Components/Container";
import GamesNavigation from "@/Components/Learning/GamesNavigation.jsx";
import { ChooseGroups } from "@/Components/Learning/ChooseGroups.jsx";
import { router } from "@inertiajs/react";

export default function Learn({ set, groups }) {
  const [isCorrect, setIsCorrect] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isSeen, setIsSeen] = useState(false);
  const [isChoosingGroups, setIsChoosingGroups] = useState(true);
  const [learningProperties, setLearningProperties] = useState(null);
  const [current, setCurrent] = useState({
    groupIndex: 0,
    translationIndex: 0,
  });
  const [kind, setKind] = useState("");
  const [translationsCount, setTranslationCount] = useState(0);
  const [userAnswers, setUserAnswers] = useState({
    correct: 0,
    incorrect: {
      count: 0,
      translations: [],
    },
  });

  const kinds = ["choose", "type"];
  const secondsToAnswer = 10000;
  const ref = useRef();

  const onSubmit = (
    event,
    userAnswer,
    correctAnswer,
    groupIndex,
    translationIndex,
  ) => {
    event.preventDefault();
    check(userAnswer, correctAnswer, groupIndex, translationIndex);
  };

  const onClickAnswer = (
    userAnswer,
    correctAnswer,
    groupIndex,
    translationIndex,
  ) => {
    check(userAnswer, correctAnswer, groupIndex, translationIndex);
  };

  const next = () => {
    setCurrent((prev) =>
      groups[current.groupIndex].translationsCount - 1 ===
        current.translationIndex && groups.length > prev.groupIndex + 1
        ? {
            groupIndex: prev.groupIndex + 1,
            translationIndex: 0,
          }
        : {
            groupIndex: prev.groupIndex,
            translationIndex: prev.translationIndex + 1,
          },
    );
  };

  const check = (userAnswer, correctAnswer, groupIndex, translationIndex) => {
    ref.current.style.animationPlayState = "paused";
    setIsClicked(true);

    if (correctAnswer === userAnswer) {
      setUserAnswers((prev) => ({ ...prev, correct: prev.correct + 1 }));
      setIsCorrect(true);
    } else {
      setIsSeen(true);
      setUserAnswers((prev) => ({
        ...prev,
        incorrect: {
          count: prev.incorrect.count + 1,
          translations: [
            ...prev.incorrect.translations,
            {
              id: learningProperties.groups[groupIndex].translations[
                translationIndex
              ].id,
              group: groups.at(groupIndex).name,
              term: learningProperties.groups[groupIndex].translations[
                translationIndex
              ].term,
              definition: correctAnswer,
            },
          ],
        },
      }));
    }
  };

  const refreshProgressAnimation = () => {
    setIsClicked(true);

    if (
      current.translationIndex !== groups[current.groupIndex].translationsCount
    ) {
      ref.current.style.animationName = "none";

      requestAnimationFrame(() => {
        ref.current.style.animationName = "";
        ref.current.style.animationPlayState = "running";
      });
    }
  };

  useEffect(() => {
    learningProperties?.groups.forEach((group) =>
      setTranslationCount((prev) => prev + group.translationsCount),
    );
  }, [learningProperties]);

  useEffect(() => {
    if (!isChoosingGroups) {
      if (
        current.translationIndex ===
        groups[current.groupIndex].translationsCount
      ) {
        router.put(
          `/set/${set.id}/updateProgress`,
          userAnswers.incorrect.translations,
        );
      }

      const timer = setTimeout(() => {
        setIsClicked(true);
        setIsSeen(true);
      }, secondsToAnswer);

      setKind(kinds[Math.floor(Math.random() * kinds.length)]);
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
          groups={groups}
          handleSetLearningProperties={setLearningProperties}
          handleSetIsChoosingGroups={setIsChoosingGroups}
        />
      ) : (
        <>
          {current.translationIndex !==
          groups[current.groupIndex].translationsCount ? (
            <>
              <ProgressBar ref={ref} className="top-0 h-4 bg-indigo-500" />

              <Container>
                {learningProperties.groups.map((group, groupIndex) =>
                  group.translations.map((translation, translationIndex) => {
                    if (
                      current.translationIndex === translationIndex &&
                      current.groupIndex === groupIndex
                    ) {
                      if (kind === "choose") {
                        return (
                          <ChooseAnswer
                            groupIndex={groupIndex}
                            answers={group.answers}
                            key={translationIndex}
                            translation={translation}
                            isClicked={isClicked}
                            isCorrect={isCorrect}
                            onClickAnswer={onClickAnswer}
                            componentIndex={translationIndex}
                            isForeignLanguage={
                              learningProperties.answersLanguage ===
                              set.target_language
                            }
                          />
                        );
                      } else {
                        return (
                          <EnterAnswer
                            key={translationIndex}
                            groupIndex={groupIndex}
                            translation={translation}
                            isClicked={isClicked}
                            isCorrect={isCorrect}
                            isSeen={isSeen}
                            handleOnSubmit={onSubmit}
                            componentIndex={translationIndex}
                            isForeignLanguage={
                              learningProperties.answersLanguage ===
                              set.target_language
                            }
                          />
                        );
                      }
                    }
                  }),
                )}
              </Container>
            </>
          ) : (
            <Feedback
              set={set}
              answersResults={userAnswers}
              length={translationsCount}
              barWidth={Math.round((userAnswers.correct / 12) * 100)}
              routeName={"learn"}
            />
          )}

          {current.translationIndex !==
            groups[current.groupIndex].translationsCount && (
            <MainButton
              className="mx-auto left-0 right-0 transition fixed opacity-0 bg-indigo-500 hover:bg-indigo-600 text-gray-100"
              isClicked={isClicked}
              onClick={() => {
                refreshProgressAnimation();
                next();
              }}
            >
              {current.translationIndex !==
              groups[current.groupIndex].translationsCount - 1
                ? "Move to next"
                : "Show results"}
            </MainButton>
          )}
        </>
      )}
    </>
  );
}