import GamesNavigation from "@/Components/Learning/GamesNavigation.jsx";
import { MainButton } from "@/Components/MainButton.jsx";
import React, { useEffect, useRef, useState } from "react";
import { EnterAnswer } from "@/Components/Learning/EnterAnswer.jsx";
import { ChooseAnswer } from "@/Components/Learning/ChooseAnswer.jsx";
import { TrueOrFalseAnswer } from "@/Components/Learning/TrueOrFalseAnswer.jsx";
import { Feedback } from "@/Pages/Flashcards/Feedback.jsx";
import { Container } from "@/Components/Container.jsx";
import TranslationsData from "@/TranslationsData.js";
import { TestForm } from "@/Components/Learning/TestForm.jsx";
const Test = ({ set, translations, shuffledTranslations, trueOrFalseData }) => {
  const [unfilledArray, setUnfilledArray] = useState([]);
  const [isStarted, setIsStarted] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [wasCheckedOnce, setWasCheckedOnce] = useState(false);
  const [components, setComponents] = useState([]);
  const anchors = useRef([]);
  const [testProperties, setTestProperties] = useState({
    isForeignLanguage: true,
    testTypes: ["TrueOrFalse", "ChooseAnswer", "EnterAnswer"],
    testLength: translations.length,
  });

  const [answerResults, setAnswerResults] = useState({
    correct: 0,
    incorrect: {
      count: 0,
      translations: [],
    },
  });

  const [fetchedTranslations] = useState(
    translations.map((translation) => new TranslationsData(translation)),
  );

  useEffect(() => {
    if (!isStarted) {
      setUnfilledArray(new Array(testProperties?.testLength).fill(0));
    }
  }, [testProperties]);

  const checkAnswers = () => {
    anchors.current[0].scrollIntoView({
      behavior: "smooth",
    });
    setWasCheckedOnce(true);
    let copy = [...components];

    // user hasn't filled all fields so scroll his view to the first unfilled field in the test
    if (userAnswers.length < testProperties.testLength) {
      // move user to first unfilled component
      if (!isEnd)
        anchors.current[unfilledArray.indexOf(0)].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

      userAnswers.forEach((userAnswer) => {
        let seekingIndex = components.findIndex(
          (component) => component.data.id === userAnswer.id,
        );
        copy.splice(
          components.findIndex(
            (component) => component.data.id === userAnswer.id,
          ),
          1,
          {
            name: components[seekingIndex].name,
            data: userAnswer,
            isFilled: true,
          },
        );
        setComponents(copy);
      });
    } else {
      setIsEnd(true);

      userAnswers.forEach((userAnswer, index) => {
        let seekingIndex = components.findIndex(
          (component) => component.data.id === userAnswer.id,
        );
        let data = new TranslationsData(userAnswer);

        copy.splice(
          components.findIndex(
            (component) => component.data.id === userAnswer.id,
          ),
          1,
          {
            name: components[seekingIndex].name,
            data: userAnswer,
            isFilled: true,
            isCorrect:
              userAnswer.answer === data.definition.word ||
              components[index].data.answer === userAnswer.answer,
            isDisabled: true,
          },
        );

        setComponents(copy);
        fillAnswersResults(userAnswer, index);
      });
    }
  };

  const fillAnswersResults = (userAnswer, index, count) => {
    const correct = new TranslationsData(
      shuffledTranslations
        .filter((translation) => translation.id === userAnswer.id)
        .at(0),
    );
    const data = new TranslationsData(userAnswer);

    if (
      userAnswer.answer === data.definition.word ||
      userAnswer.answer === components[index].data.answer
    ) {
      setAnswerResults((prev) => ({
        ...prev,
        correct: prev.correct + 1,
      }));
    } else {
      setAnswerResults((prev) => ({
        ...prev,
        incorrect: {
          count: prev.incorrect.count + 1,
          translations: [
            ...prev.incorrect.translations,
            {
              id: index + 1,
              term: {
                word: data.term.word,
              },
              definition: {
                word: testProperties.isForeignLanguage
                  ? correct.definition.word
                  : correct.term.word,
              },
            },
          ],
        },
      }));
    }
  };

  const addAnswer = (
    componentIndex,
    componentType,
    data,
    answerFromComponent,
    event,
  ) => {
    if (event) event.preventDefault();

    if (userAnswers.length !== testProperties.testLength) {
      let copyOfUnfilled = [...unfilledArray];
      copyOfUnfilled.splice(componentIndex, 1, 1);
      setUnfilledArray(copyOfUnfilled);
    }

    let copy = [...userAnswers];

    if (copy.some((element) => element.id === data.id)) {
      copy.splice(
        copy.findIndex((userAnswer) => userAnswer.index === data.id),
        1,
        {
          id: data.id,
          term: data.term,
          definition: data.definition,
          answers: data.answers,
          answer: answerFromComponent,
        },
      );
      setUserAnswers(copy);
    } else {
      setUserAnswers((prev) => {
        return [
          ...prev,
          {
            id: data.id,
            term: data.term,
            definition: data.definition,
            answers: data.answers,
            answer: answerFromComponent,
          },
        ];
      });
    }
  };

  return (
    <>
      <GamesNavigation set={set}>
        <span className="text-indigo-500 font-bold">Test</span>
      </GamesNavigation>
      {!isStarted && (
        <TestForm
          trueOrFalseData={trueOrFalseData}
          shuffledTranslations={shuffledTranslations.map(
            (translation) => new TranslationsData(translation),
          )}
          set={set}
          translations={fetchedTranslations}
          wasCheckedOnce={wasCheckedOnce}
          setIsStarted={setIsStarted}
          setComponents={setComponents}
          setTestProperties={setTestProperties}
        />
      )}
      <div
        ref={(element) => {
          anchors.current[0] = element;
        }}
        className={"!scroll-smooth"}
      ></div>
      {isEnd && (
        <Container>
          <Feedback
            length={testProperties.testLength}
            set={set}
            routeName={"test"}
            answersResults={answerResults}
            barWidth={Math.round(
              (answerResults.correct / testProperties.testLength) * 100,
            )}
            isTest={true}
          />
        </Container>
      )}

      {isStarted && (
        <Container className={"flex flex-col gap-4"}>
          {components.map((component, index) => {
            switch (component.name) {
              case "EnterAnswer":
                return (
                  <div
                    key={index}
                    ref={(element) => {
                      anchors.current[index] = element;
                    }}
                  >
                    <EnterAnswer
                      className={
                        (wasCheckedOnce && !component.isFilled
                          ? "bg-red-300 "
                          : "bg-gray-100 ") +
                        (isEnd
                          ? component.isCorrect
                            ? "border-2 border-lime-500"
                            : "border-2 border-red-500"
                          : "") +
                        " rounded-md p-4"
                      }
                      isTest={true}
                      isClicked={isEnd}
                      isCorrect={component.isCorrect}
                      isSeen={isEnd}
                      isEnd={isEnd}
                      translation={component.data}
                      length={testProperties.testLength}
                      componentIndex={index}
                      addAnswer={addAnswer}
                    />
                  </div>
                );
              case "ChooseAnswer":
                return (
                  <div
                    key={index}
                    ref={(element) => {
                      anchors.current[index] = element;
                    }}
                  >
                    <ChooseAnswer
                      className={
                        (wasCheckedOnce && !component.isFilled
                          ? "bg-red-300 "
                          : "bg-gray-100 ") +
                        (isEnd
                          ? component.isCorrect
                            ? "border-2 border-lime-500"
                            : "border-2 border-red-500"
                          : "") +
                        " rounded-md p-4"
                      }
                      isEnd={isEnd}
                      isClicked={isEnd}
                      isCorrect={component.isCorrect}
                      isForeignLanguage={testProperties.isForeignLanguage}
                      isTest={true}
                      length={testProperties.testLength}
                      translation={component.data}
                      componentIndex={index}
                      addAnswer={addAnswer}
                    />
                  </div>
                );
              case "TrueOrFalseAnswer":
                return (
                  <div
                    key={index}
                    ref={(element) => {
                      anchors.current[index] = element;
                    }}
                  >
                    <TrueOrFalseAnswer
                      // is filled up
                      className={
                        (wasCheckedOnce && !component.isFilled
                          ? "bg-red-300 "
                          : "bg-gray-100 ") +
                        (isEnd
                          ? component.isCorrect
                            ? "border-2 border-lime-500"
                            : "border-2 border-red-500"
                          : "") +
                        " rounded-md p-2 relative transition"
                      }
                      isTest={true}
                      isClicked={isEnd}
                      isEnd={isEnd}
                      data={component.data}
                      isDisabled={component.isDisabled}
                      isCorrect={component.isCorrect}
                      length={testProperties.testLength}
                      componentIndex={index}
                      addAnswer={addAnswer}
                    />
                  </div>
                );
            }
          })}
          <div className={"mx-auto mt-4"}>
            {isEnd ? (
              <>
                <MainButton
                  className={"bg-indigo-500 hover:bg-indigo-600 text-gray-100"}
                  isRedirect={true}
                  href={route("flashcards.showSet", [set.id, set.title])}
                >
                  Back to the set preview
                </MainButton>
              </>
            ) : (
              <MainButton
                className={"bg-indigo-500 hover:bg-indigo-600 text-gray-100"}
                onClick={() => {
                  checkAnswers();
                }}
              >
                Submit your test
              </MainButton>
            )}
          </div>
        </Container>
      )}
    </>
  );
};
export default Test;