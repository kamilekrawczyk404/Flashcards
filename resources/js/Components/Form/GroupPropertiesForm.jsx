import { AnimatedCheckbox } from "@/Components/Form/AnimatedCheckbox.jsx";
import InputLabel from "@/Components/Form/InputLabel.jsx";
import TextInput from "@/Components/Form/TextInput.jsx";
import { useState } from "react";
import InputError from "@/Components/Form/InputError.jsx";
import { FormChild } from "@/Components/Form/FormChild.jsx";

export const GroupPropertiesForm = ({
  group,
  register,
  id,
  errors,
  getValues = () => {},
  setValue = () => {},
  resetField = () => {},
  isTest = false,
}) => {
  const groupName = Object.entries(group).filter(
    ([key, value]) => key === group.group_name,
  )[0][0];

  const settingsOff = () => {
    if (getValues(`groupsProperties.${id}.settings_on`))
      setValue(`groupsProperties.${id}.settings_on`, false);
  };

  const resetFields = () => {
    resetField(`groupsProperties.${id}.maxValue`);
    resetField(`groupsProperties.${id}.minValue`);
  };
  return (
    <>
      <AnimatedCheckbox
        id={groupName}
        onClick={() => {
          resetFields();
          settingsOff();
        }}
        {...register(`groupsProperties.${id}.${groupName}`)}
      />
      <InputLabel
        htmlFor={groupName}
        value={groupName}
        className={"font-bold text-gray-700"}
      />

      <AnimatedCheckbox
        disabled={!getValues(`groupsProperties.${id}.${groupName}`)}
        id={`${groupName}.settings`}
        className={""}
        onClick={() => {
          resetFields();
        }}
        {...register(`groupsProperties.${id}.settings_on`)}
      />
      <InputLabel
        value={"Settings"}
        className={"text-gray-700"}
        htmlFor={`${groupName}.settings`}
      />

      {!isTest && (
        <section
          className={
            "flex items-center justify-center transition-all ml-2 " +
            (getValues(`groupsProperties.${id}.settings_on`) &&
            getValues(`groupsProperties.${id}.${groupName}`)
              ? "h-16 mb-8"
              : "h-0 overflow-hidden")
          }
        >
          <div>
            <InputLabel value={"From:"} className={"text-gray-700"} />
            <TextInput
              type="number"
              placeholder={"From:"}
              {...register(`groupsProperties.${id}.minValue`, {
                required: true,
                min: {
                  value: 1,
                  message: "Minimum value is 1",
                },
                max: {
                  value: group.maxValue - 1,
                  message: `Maximum value is ${group.maxValue - 1}`,
                },
                valueAsNumber: true,
              })}
            />
            {errors?.groupsProperties?.[id]?.minValue && (
              <InputError
                className={"absolute mt-2 w-fit"}
                message={errors?.groupsProperties?.[id]?.minValue?.message}
              />
            )}
          </div>
          <div className={"ml-16"}>
            <InputLabel value={"To:"} className={"text-gray-700"} />

            <TextInput
              type="number"
              placeholder={"To:"}
              {...register(`groupsProperties.${id}.maxValue`, {
                required: true,
                min: {
                  value: 2,
                  message: "Minimum value is 2",
                },
                max: {
                  value: group.maxValue,
                  message: `Maximum value is ${group.maxValue}`,
                },
                valueAsNumber: true,
              })}
            />
            {errors?.groupsProperties?.[id]?.maxValue && (
              <InputError
                className={"absolute mt-2 w-fit whitespace-nowrap"}
                message={errors?.groupsProperties?.[id]?.maxValue?.message}
              />
            )}
          </div>
        </section>
      )}
    </>
  );
};