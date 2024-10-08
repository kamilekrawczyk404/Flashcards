export const getFormCustomErrors = (properties, isTest = false) => {
  const defaultValues = {
    minBiggerThanMax: {
      message: "The 'To' field must be bigger than the 'From' field",
    },
    anyGroupChecked: {
      message: "At least one group must be checked.",
    },
    anyModeChecked: {
      message: "At least one test mode must be checked.",
    },
  };

  // console.log(properties.groupsProperties);
  if (
    properties.groupsProperties.filter(
      (groupProperty) =>
        groupProperty.range.minValue >= groupProperty.range.maxValue,
    ).length !== 0
  ) {
    return [defaultValues.minBiggerThanMax];
  }

  if (
    // only difficult checked or first property has value whether the user checked group (true / false)
    !properties?.onlyDifficult &&
    Object.values(properties.groupsProperties).every(
      (property) => Object.values(property)[0] === false,
    )
  ) {
    return [defaultValues.anyGroupChecked];
  }

  if (isTest && !Object.values(properties).some((value) => value === true)) {
    return [defaultValues.anyModeChecked];
  }

  return [];
};