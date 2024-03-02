export const getFormGroupsSettingsErrors = (properties) => {
  console.log(properties);
  const defaultValues = {
    minBiggerThanMax: {
      message: "The 'To' field must be bigger than the 'From' field",
    },
    anyChecked: {
      message: "At least one group must be checked.",
    },
  };

  if (
    properties.filter((property) => property?.minValue >= property?.maxValue)
      .length !== 0
  ) {
    return [defaultValues.minBiggerThanMax];
  }
  if (
    // first property has value whether the user checked group (true / false)
    Object.values(properties).every(
      (property) => Object.values(property)[0] === false,
    )
  ) {
    return [defaultValues.anyChecked];
  }

  return [];
};