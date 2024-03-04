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
import { ProgressModal } from "@/Components/ProgressModal.jsx";
import { useGetGroups } from "@/useGetGroups.js";
import { useFakeLoading } from "@/useFakeLoading.js";
import { TestChooseGroups } from "@/Components/Learning/TestChooseGroups.jsx";
const Test = ({ set, groupsProperties }) => {
  const [unfilledArray, setUnfilledArray] = useState([]);
  const [testLength, setTestLength] = useState(0);
  const [isEnd, setIsEnd] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [wasCheckedOnce, setWasCheckedOnce] = useState(false);

  const [isChoosingGroups, setIsChoosingGroups] = useState(true);
  const [componentProperties, setComponentProperties] = useState(null);
  const anchors = useRef([]);

  const { groups, loading } = useGetGroups(
    set,
    isChoosingGroups,
    componentProperties,
    "/get-groups-for-test/",
  );

  const fakeLoading = useFakeLoading(loading);

  useEffect(() => {
    if (groups.length !== 0) {
      let sum = 0;
      groups.forEach((group) => (sum += group.translationsCount));
      setTestLength(sum);
    }
  }, [groups]);

  // const [answerResults, setAnswerResults] = useState({
  //   correct: 0,
  //   incorrect: {
  //     count: 0,
  //     translations: [],
  //   },
  // });

  // useEffect(() => {
  //   if (!isStarted) {
  //     setUnfilledArray(new Array(testProperties?.testLength).fill(0));
  //   }
  // }, [testProperties]);

  // const checkAnswers = () => {
  //   anchors.current[0].scrollIntoView({
  //     behavior: "smooth",
  //   });
  //   setWasCheckedOnce(true);
  //   let copy = [...components];
  //
  //   // user hasn't filled all fields so scroll his view to the first unfilled field in the test
  //   if (userAnswers.length < testProperties.testLength) {
  //     // move user to first unfilled component
  //     if (!isEnd)
  //       anchors.current[unfilledArray.indexOf(0)].scrollIntoView({
  //         behavior: "smooth",
  //         block: "center",
  //       });
  //
  //     userAnswers.forEach((userAnswer) => {
  //       let seekingIndex = components.findIndex(
  //         (component) => component.data.id === userAnswer.id,
  //       );
  //       copy.splice(
  //         components.findIndex(
  //           (component) => component.data.id === userAnswer.id,
  //         ),
  //         1,
  //         {
  //           name: components[seekingIndex].name,
  //           data: userAnswer,
  //           isFilled: true,
  //         },
  //       );
  //       setComponents(copy);
  //     });
  //   } else {
  //     setIsEnd(true);
  //
  //     userAnswers.forEach((userAnswer, index) => {
  //       let seekingIndex = components.findIndex(
  //         (component) => component.data.id === userAnswer.id,
  //       );
  //       let data = new TranslationsData(userAnswer);
  //
  //       copy.splice(
  //         components.findIndex(
  //           (component) => component.data.id === userAnswer.id,
  //         ),
  //         1,
  //         {
  //           name: components[seekingIndex].name,
  //           data: userAnswer,
  //           isFilled: true,
  //           isCorrect:
  //             userAnswer.answer === data.definition.word ||
  //             components[index].data.answer === userAnswer.answer,
  //           isDisabled: true,
  //         },
  //       );
  //
  //       setComponents(copy);
  //       fillAnswersResults(userAnswer, index);
  //     });
  //   }
  // };

  // const fillAnswersResults = (userAnswer, index, count) => {
  //   const correct = new TranslationsData(
  //     shuffledTranslations
  //       .filter((translation) => translation.id === userAnswer.id)
  //       .at(0),
  //   );
  //   const data = new TranslationsData(userAnswer);
  //
  //   if (
  //     userAnswer.answer === data.definition.word ||
  //     userAnswer.answer === components[index].data.answer
  //   ) {
  //     setAnswerResults((prev) => ({
  //       ...prev,
  //       correct: prev.correct + 1,
  //     }));
  //   } else {
  //     setAnswerResults((prev) => ({
  //       ...prev,
  //       incorrect: {
  //         count: prev.incorrect.count + 1,
  //         translations: [
  //           ...prev.incorrect.translations,
  //           {
  //             id: index + 1,
  //             term: {
  //               word: data.term.word,
  //             },
  //             definition: {
  //               word: testProperties.isForeignLanguage
  //                 ? correct.definition.word
  //                 : correct.term.word,
  //             },
  //           },
  //         ],
  //       },
  //     }));
  //   }
  // };

  const addAnswer = (
    groupIndex,
    componentIndex,
    componentType,
    data,
    answerFromComponent,
    event,
  ) => {
    console.log(data);
    if (event) event.preventDefault();

    // if (userAnswers.length !== testLength) {
    //   let copyOfUnfilled = [...unfilledArray];
    //   copyOfUnfilled.splice(componentIndex, 1, 1);
    //   setUnfilledArray(copyOfUnfilled);
    // }

    let copy = [...userAnswers];

    let answer = {
      groupIndex: groupIndex,
      componentIndex: componentIndex,
      id: data.id,
      term: data.term,
      definition: data.definition,
      answer: answerFromComponent,
    };

    if (
      copy.some(
        (answer) =>
          answer.groupIndex === groupIndex &&
          answer.componentIndex === componentIndex,
      )
    ) {
      copy.splice(
        copy.findIndex(
          (answer) =>
            answer.groupIndex === groupIndex &&
            answer.componentIndex === componentIndex,
        ),
        1,
        answer,
      );
      setUserAnswers(copy);
    } else {
      setUserAnswers((prev) => [...prev, answer]);
    }
  };

  console.log(userAnswers);

  return (
    <>
      <GamesNavigation set={set}>
        <span className="text-indigo-500 font-bold">Test</span>
      </GamesNavigation>

      {isChoosingGroups ? (
        <TestChooseGroups
          set={set}
          groupsProperties={groupsProperties}
          handleSetComponentProperties={setComponentProperties}
          handleSetIsChoosingGroups={setIsChoosingGroups}
          isTest={true}
        />
      ) : loading || fakeLoading ? (
        <ProgressModal
          inProgress={loading || fakeLoading}
          text={"We're preparing your learning plan."}
        />
      ) : (
        <Container className={"flex flex-col gap-4"}>
          {groups.map((group, groupIndex) => {
            return group.components.map((component, componentIndex) => {
              switch (component.type) {
                case "EnterAnswer":
                  return (
                    <EnterAnswer
                      key={`${groupIndex}.${componentIndex}`}
                      ref={(element) => {
                        anchors.current.push(element);
                      }}
                      componentIndex={componentIndex}
                      groupIndex={groupIndex}
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
                      // isCorrect={component.isCorrect}
                      isSeen={isEnd}
                      isEnd={isEnd}
                      translation={component.translation}
                      length={testLength}
                      addAnswer={addAnswer}
                      isForeignLanguage={componentProperties.isForeignLanguage}
                    />
                  );
                case "ChooseAnswer":
                  return (
                    <ChooseAnswer
                      key={`${groupIndex}.${componentIndex}`}
                      ref={(element) => {
                        anchors.current.push(element);
                      }}
                      componentIndex={componentIndex}
                      groupIndex={groupIndex}
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
                      // isCorrect={component.isCorrect}
                      isForeignLanguage={componentProperties.isForeignLanguage}
                      isTest={true}
                      length={testLength}
                      translation={component.translation}
                      answers={component.answers}
                      addAnswer={addAnswer}
                    />
                  );
                case "TrueOrFalseAnswer":
                  return (
                    <TrueOrFalseAnswer
                      key={`${groupIndex}.${componentIndex}`}
                      ref={(element) => {
                        anchors.current.push(element);
                      }}
                      componentIndex={componentIndex}
                      groupIndex={groupIndex}
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
                      isClicked={isEnd}
                      isEnd={isEnd}
                      translation={component.translation}
                      isDisabled={component.isDisabled}
                      isCorrect={component.isCorrect}
                      length={testLength}
                      addAnswer={addAnswer}
                    />
                  );
              }
            });
          })}
          <div className={"mx-auto mt-4"}>
            {isEnd ? (
              <>
                <MainButton
                  className={"bg-indigo-500 hover:bg-indigo-600 text-gray-100"}
                  isRedirect={true}
                  href={route("flashcards.showSet", [set.id])}
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