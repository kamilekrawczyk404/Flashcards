import { useEffect, useRef, useState } from "react";
import { Feedback } from "@/Pages/Flashcards/Feedback.jsx";
import ProgressBar from "@/Components/ProgressBar";
import { ChooseAnswer } from "@/Components/Learning/ChooseAnswer.jsx";
import { EnterAnswer } from "@/Components/Learning/EnterAnswer.jsx";
import { router } from "@inertiajs/react";
import { MainButton } from "@/Components/MainButton";
import { Container } from "@/Components/Container";
import GamesNavigation from "@/Components/Learning/GamesNavigation.jsx";
import TranslationsData from "@/TranslationsData.js";

export default function Learn({ set, translations, title }) {
  const [isCorrect, setIsCorrect] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isSeen, setIsSeen] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [kind, setKind] = useState("");
  const [userAnswers, setUserAnswers] = useState({
    correct: 0,
    incorrect: {
      count: 0,
      translations: [],
    },
  });
  const [fetchedTranslations] = useState(
    translations.map((translation) => new TranslationsData(translation)),
  );

  const kinds = ["choose", "type"];
  const secondsToAnswer = 10000;
  const ref = useRef(null);
  const div = ref.current;

  useEffect(() => {
    if (currentIndex === fetchedTranslations.length) {
      setIsEnd(true);
      div.style.animationPlayState = "paused";
      router.put(`/set/${title}/updateHardTranslations`, userAnswers);
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
  }, [currentIndex]);

  const onSubmit = (event, userAnswer, correctAnswer, index) => {
    event.preventDefault();
    check(userAnswer, correctAnswer, index);
  };

  const onClickAnswer = (userAnswer, correctAnswer, index) => {
    check(userAnswer, correctAnswer, index);
  };

  const check = (userAnswer, correctAnswer, index) => {
    setIsClicked(true);
    div.style.animationPlayState = "paused";

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
              id: index + 1,
              term: {
                word: fetchedTranslations[index].term.word,
              },
              definition: { word: correctAnswer },
            },
          ],
        },
      }));
    }
  };

  const refreshProgressAnimation = () => {
    setIsClicked(true);
    div.style.animationName = "none";

    if (currentIndex !== translations.length - 1) {
      requestAnimationFrame(() => {
        setTimeout(() => {
          div.style.animationName = "";
          div.style.animationPlayState = "running";
        }, 0);
      });
    }
  };

  return (
    <>
      <GamesNavigation set={set}>
        <span className="text-indigo-500 font-bold">Learn</span>
      </GamesNavigation>
      <ProgressBar ref={ref} className="top-0 h-4 bg-indigo-500" />
      <Container>
        {fetchedTranslations.map((translation, index) => {
          if (currentIndex === index) {
            if (kind === "choose") {
              return (
                <ChooseAnswer
                  key={index}
                  translation={translation}
                  isClicked={isClicked}
                  isCorrect={isCorrect}
                  onClickAnswer={onClickAnswer}
                  componentIndex={index}
                  isForeignLanguage={true}
                />
              );
            } else {
              return (
                <EnterAnswer
                  key={index}
                  translation={translation}
                  isClicked={isClicked}
                  isCorrect={isCorrect}
                  isSeen={isSeen}
                  handleOnSubmit={onSubmit}
                  componentIndex={index}
                />
              );
            }
          }
        })}
        {isEnd && (
          <Feedback
            set={set}
            answersResults={userAnswers}
            length={translations.length}
            barWidth={Math.round(
              (userAnswers.correct / translations.length) * 100,
            )}
            routeName={"learn"}
          />
        )}
      </Container>
      {currentIndex !== translations.length && (
        <MainButton
          className="mx-auto left-0 right-0 transition fixed opacity-0 bg-indigo-500 hover:bg-indigo-600 text-gray-100"
          isClicked={isClicked}
          onClick={() => {
            refreshProgressAnimation();
            setCurrentIndex((prev) => (prev += 1));
          }}
        >
          {currentIndex !== translations.length - 1
            ? "Move to next term"
            : "Show results"}
        </MainButton>
      )}
    </>
  );
}