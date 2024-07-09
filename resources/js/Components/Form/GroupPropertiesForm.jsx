import { AnimatedCheckbox } from "@/Components/Form/AnimatedCheckbox.jsx";
import InputLabel from "@/Components/Form/InputLabel.jsx";
import TextInput from "@/Components/Form/TextInput.jsx";
import { useContext, useEffect, useState } from "react";
import InputError from "@/Components/Form/InputError.jsx";
import { FormChild } from "@/Components/Form/FormChild.jsx";
import { ThemeContext } from "@/ThemeContext.jsx";

export const GroupPropertiesForm = ({
  group,
  register,
  id,
  errors,
  disabled = false,
  getValues = () => {},
  resetField = () => {},
  isTest = false,
}) => {
  const { properties } = useContext(ThemeContext);

  const groupName = Object.entries(group).filter(
    ([key, value]) => key === group.group_name,
  )[0][0];

  const switchOffSettings = () => {
    resetRangeFields();
    resetDifficult();
  };

  const resetRangeFields = () => {
    resetField(`groupsProperties.${id}.range.range_on`);
    resetField(`groupsProperties.${id}.range.maxValue`);
    resetField(`groupsProperties.${id}.range.minValue`);
  };

  const resetDifficult = () => {
    resetField(`groupsProperties.${id}.difficult.difficult_on`);
  };

  useEffect(() => {
    switchOffSettings();
  }, [disabled]);

  return (
    <>
      <div className={"flex gap-x-2"}>
        <AnimatedCheckbox
          disabled={disabled}
          id={groupName}
          onClick={() => switchOffSettings()}
          {...register(`groupsProperties.${id}.${groupName}`)}
        />
        <InputLabel
          className={properties.labelTextl}
          htmlFor={groupName}
          value={groupName}
        />
      </div>

      {!isTest && (
        <>
          <section
            className={
              "transition-all flex flex-col gap-y-2 items-start " +
              (getValues(`groupsProperties.${id}.${groupName}`)
                ? "h-16 " +
                  (!getValues(`groupsProperties.${id}.difficult.disabled`)
                    ? "mb-16 "
                    : "")
                : "h-0 overflow-hidden")
            }
          >
            <section className={"flex items-center justify-center gap-x-16"}>
              <div className={"flex gap-x-2"}>
                <AnimatedCheckbox
                  disabled={
                    getValues(
                      `groupsProperties.${id}.difficult.difficult_on`,
                    ) || disabled
                  }
                  {...register(`groupsProperties.${id}.range.range_on`)}
                />
                <InputLabel value={"Range"} />
              </div>
              <div
                className={
                  "transition-all flex items-center gap-x-16 transform origin-top ease-in-out " +
                  (getValues(`groupsProperties.${id}.range.range_on`)
                    ? "scale-y-100"
                    : "scale-y-0")
                }
              >
                <div>
                  <InputLabel value={"From:"} />
                  <TextInput
                    disabled={
                      !getValues(`groupsProperties.${id}.range.range_on`) ||
                      disabled
                    }
                    type="number"
                    placeholder={"From:"}
                    {...register(`groupsProperties.${id}.range.minValue`, {
                      required: true,
                      min: {
                        value: 1,
                        message: "Minimum value is 1",
                      },
                      max: {
                        value: group?.range?.maxValue - 1,
                        message: `Maximum value is ${
                          group?.range?.maxValue - 1
                        }`,
                      },
                      valueAsNumber: true,
                    })}
                  />
                  {errors?.groupsProperties?.[id]?.range?.minValue && (
                    <InputError
                      className={"absolute mt-2 w-fit"}
                      message={
                        errors?.groupsProperties?.[id]?.range?.minValue?.message
                      }
                    />
                  )}
                </div>
                <div>
                  <InputLabel value={"To:"} />

                  <TextInput
                    type="number"
                    disabled={
                      !getValues(`groupsProperties.${id}.range.range_on`) ||
                      disabled
                    }
                    placeholder={"To:"}
                    {...register(`groupsProperties.${id}.range.maxValue`, {
                      required: true,
                      min: {
                        value: 2,
                        message: "Minimum value is 2",
                      },
                      max: {
                        value: group?.range?.maxValue,
                        message: `Maximum value is ${group?.range?.maxValue}`,
                      },
                      valueAsNumber: true,
                    })}
                  />
                  {errors?.groupsProperties?.[id]?.range?.maxValue && (
                    <InputError
                      className={"absolute mt-2 w-fit whitespace-nowrap"}
                      message={
                        errors?.groupsProperties?.[id]?.range?.maxValue?.message
                      }
                    />
                  )}
                </div>
              </div>
            </section>
            {!getValues(`groupsProperties.${id}.difficult.disabled`) && (
              <div className={"relative flex items-start gap-x-2 "}>
                <AnimatedCheckbox
                  disabled={
                    getValues(`groupsProperties.${id}.range.range_on`) ||
                    disabled
                  }
                  {...register(`groupsProperties.${id}.difficult.difficult_on`)}
                />
                <InputLabel value={"Only difficult"} />
              </div>
            )}
          </section>
        </>
      )}
    </>
  );
};