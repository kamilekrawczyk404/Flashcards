export const isTheLastTranslation = (current, groups) => {
  return (
    current.groupIndex === groups?.length - 1 &&
    current.translationIndex ===
      groups[groups.length - 1]?.translationsCount - 1
  );
};