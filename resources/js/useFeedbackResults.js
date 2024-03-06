export const useFeedbackResults = (
  prev,
  groups,
  groupIndex,
  componentIndex,
  correct,
  userAnswer,
  isMatch = false,
) => {
  let feedbackResults =
    Object.keys(prev).length === 0
      ? { correctIds: [], incorrectIds: [] }
      : { ...prev };

  if (
    !isMatch
      ? correct === userAnswer
      : correct.translation_id === userAnswer.translation_id
  ) {
    feedbackResults = {
      ...feedbackResults,
      correctIds: [
        ...feedbackResults.correctIds,
        !isMatch
          ? groups[groupIndex]?.components[componentIndex]?.translation.id
          : userAnswer.translation_id,
      ],
    };
  } else {
    feedbackResults = {
      ...feedbackResults,
      incorrectIds: [
        ...feedbackResults.incorrectIds,
        !isMatch
          ? groups[groupIndex]?.components[componentIndex]?.translation.id
          : userAnswer.translation_id,
      ],
    };
  }

  return feedbackResults;
};