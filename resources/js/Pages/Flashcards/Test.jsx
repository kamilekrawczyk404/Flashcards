import GamesNavigation from "@/Components/Learning/GamesNavigation.jsx";
import { MainButton } from "@/Components/MainButton.jsx";
import React, { useEffect, useRef, useState } from "react";
import { EnterAnswer } from "@/Components/Learning/EnterAnswer.jsx";
import { ChooseAnswer } from "@/Components/Learning/ChooseAnswer.jsx";
import { TrueOrFalseAnswer } from "@/Components/Learning/TrueOrFalseAnswer.jsx";
import { Feedback } from "@/Pages/Flashcards/Feedback.jsx";
import { Container } from "@/Components/Container.jsx";
import { ProgressModal } from "@/Components/ProgressModal.jsx";
import { useGetGroups } from "@/useGetGroups.js";
import { useFakeLoading } from "@/useFakeLoading.js";
import { TestChooseGroups } from "@/Components/Learning/TestChooseGroups.jsx";
import { useFeedbackResults } from "@/useFeedbackResults.js";
const Test = ({ set, groupsProperties }) => {
  const [emptyFields, setEmptyFields] = useState([]);
  const [testLength, setTestLength] = useState(0);
  const [isEnd, setIsEnd] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [wasCheckedOnce, setWasCheckedOnce] = useState(false);
  const [isChoosingGroups, setIsChoosingGroups] = useState(true);
  const [componentProperties, setComponentProperties] = useState(null);
  const [feedbackData, setFeedbackData] = useState({});
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
      groups.forEach((group, groupIndex) => {
        sum += group.translationsCount;

        group.components.forEach((component, componentIndex) =>
          setEmptyFields((prev) => [
            ...prev,
            { groupIndex: groupIndex, componentIndex: componentIndex },
          ]),
        );
      });

      setTestLength(sum);
    }
  }, [groups]);

  const checkAnswers = () => {
    setWasCheckedOnce(true);

    // user hasn't filled all fields so scroll his view to the first unfilled field in the test
    if (emptyFields.length !== 0) {
      anchors.current[0].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } else {
      let final = [];
      let feedbackTemp = {};

      setIsEnd(true);

      userAnswers.forEach((userAnswer) => {
        let temp = [...final];
        temp.push({
          ...userAnswer,
          isCorrect:
            groups[userAnswer.groupIndex].components[userAnswer.componentIndex]
              .type === "TrueOrFalseAnswer"
              ? userAnswer.answerTOF === Boolean(userAnswer.answer)
              : userAnswer.answer ===
                (componentProperties.answersLanguage === set.target_language
                  ? userAnswer.definition
                  : userAnswer.term),
        });
        final = temp;

        feedbackTemp = useFeedbackResults(
          feedbackTemp,
          groups,
          userAnswer.groupIndex,
          userAnswer.componentIndex,
          groups[userAnswer.groupIndex].components[userAnswer.componentIndex]
            .type === "TrueOrFalseAnswer"
            ? userAnswer.answerTOF
            : componentProperties.answersLanguage === set.target_language
              ? userAnswer.definition
              : userAnswer.term,

          userAnswer.answer,
        );
      });

      setUserAnswers(final);
      setFeedbackData(feedbackTemp);
    }
  };

  const addAnswer = (
    groupIndex,
    componentIndex,
    componentType,
    data,
    answerFromComponent,
    event,
  ) => {
    if (event) event.preventDefault();

    // remove a filled field
    if (isFieldEmpty(groupIndex, componentIndex)) {
      let temp = [...emptyFields];
      temp.splice(
        emptyFields.findIndex(
          (element) =>
            element.groupIndex === groupIndex &&
            element.componentIndex === componentIndex,
        ),
        1,
      );

      setEmptyFields(temp);
    }

    // add an answer

    let answer = {
      groupIndex: groupIndex,
      componentIndex: componentIndex,
      id: data.id,
      term: data.term,
      definition: data.definition,
      // TrueOrFalse answer
      answerTOF: groups[groupIndex].components[componentIndex]?.answer ?? null,
      answer: answerFromComponent,
    };

    if (
      userAnswers.some(
        (answer) =>
          answer.groupIndex === groupIndex &&
          answer.componentIndex === componentIndex,
      )
    ) {
      let temp = [...userAnswers];
      temp.splice(
        userAnswers.findIndex(
          (answer) =>
            answer.groupIndex === groupIndex &&
            answer.componentIndex === componentIndex,
        ),
        1,
        answer,
      );
      setUserAnswers(temp);
    } else {
      setUserAnswers((prev) => [...prev, answer]);
    }
  };

  const isFieldEmpty = (groupIndex, componentIndex) => {
    return emptyFields.some(
      (field) =>
        field.groupIndex === groupIndex &&
        field.componentIndex === componentIndex,
    );
  };

  const checkIfFieldIsCorrect = (groupIndex, componentIndex) => {
    return userAnswers.at(
      userAnswers.findIndex(
        (answer) =>
          answer.groupIndex === groupIndex &&
          answer.componentIndex === componentIndex,
      ),
    )?.isCorrect;
  };

  // Progress bar in learning component
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
        <>
          {isEnd && (
            <Feedback
              set={set}
              isTest={true}
              groups={groups}
              answersResults={feedbackData}
            />
          )}
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
                        isTest={true}
                        wasCheckedOnce={wasCheckedOnce}
                        isEmpty={isFieldEmpty(groupIndex, componentIndex)}
                        isClicked={isEnd}
                        isCorrect={checkIfFieldIsCorrect(
                          groupIndex,
                          componentIndex,
                        )}
                        isSeen={isEnd}
                        isEnd={isEnd}
                        translation={component.translation}
                        length={testLength}
                        addAnswer={addAnswer}
                        isForeignLanguage={
                          componentProperties.answersLanguage ===
                          set.target_language
                        }
                      />
                    );
                  case "ChooseAnswer":
                    return (
                      <ChooseAnswer
                        wasCheckedOnce={wasCheckedOnce}
                        isEmpty={isFieldEmpty(groupIndex, componentIndex)}
                        key={`${groupIndex}.${componentIndex}`}
                        ref={(element) => {
                          anchors.current.push(element);
                        }}
                        componentIndex={componentIndex}
                        groupIndex={groupIndex}
                        isEnd={isEnd}
                        isClicked={isEnd}
                        isCorrect={checkIfFieldIsCorrect(
                          groupIndex,
                          componentIndex,
                        )}
                        isForeignLanguage={
                          componentProperties.answersLanguage ===
                          set.target_language
                        }
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
                        isClicked={isEnd}
                        isEmpty={isFieldEmpty(groupIndex, componentIndex)}
                        isEnd={isEnd}
                        wasCheckedOnce={wasCheckedOnce}
                        translation={component.translation}
                        isDisabled={isEnd}
                        isCorrect={checkIfFieldIsCorrect(
                          groupIndex,
                          componentIndex,
                        )}
                        length={testLength}
                        addAnswer={addAnswer}
                        isForeignLanguage={
                          componentProperties.answersLanguage ===
                          set.target_language
                        }
                      />
                    );
                }
              });
            })}
            <div className={"mx-auto mt-4"}>
              {isEnd ? (
                <>
                  <MainButton
                    className={
                      "bg-indigo-500 hover:bg-indigo-600 text-gray-100"
                    }
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
        </>
      )}
    </>
  );
};
export default Test;