import { MainButton } from "@/Components/Buttons/MainButton.jsx";
import { useContext, useLayoutEffect, useRef, useState } from "react";
import Animation from "@/Pages/Animation.js";
import { FormSection } from "@/Components/Form/FormSection.jsx";
import { FormChild } from "@/Components/Form/FormChild.jsx";
import { Select } from "@/Components/Form/Select.jsx";
import InputError from "@/Components/Form/InputError.jsx";
import { getFormCustomErrors } from "@/getFormCustomErrors.js";
import { ThemeContext } from "@/ThemeContext.jsx";

export const PlanningForm = ({
  handleSubmit,
  set,
  title,
  handleSetComponentProperties,
  handleSetIsChoosingGroups,
  register,
  errors,
  setError,
  children,
  isTest = false,
}) => {
  const { properties } = useContext(ThemeContext);
  const refs = useRef([]);

  const onSubmit = (data) => {
    const customErrors = getFormCustomErrors(data, isTest);

    if (customErrors.length === 0) {
      handleSetComponentProperties(data);
      handleSetIsChoosingGroups(false);
    } else {
      setError("root.custom", ...customErrors);
    }
  };

  useLayoutEffect(() => {
    const animation = new Animation([refs.current]);
    animation.animateAll("", "", "");
  }, []);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={
        "flex gap-4 flex-col relative polygon-start opacity-0 translate-y-12 text-md"
      }
      ref={(element) => {
        refs.current[1] = element;
      }}
    >
      <div>
        <p className="text-xl font-semibold bg-indigo-500 rounded-md text-gray-100 p-2 w-fit">
          {set.title}
        </p>
        <p className="text-2xl text-indigo-500 font-semibold mt-2">{title}</p>
      </div>
      <div
        className={
          properties.background +
          " relative flex flex-col items-start py-4 rounded-md polygon-start opacity-0 translate-y-12 before:absolute before:w-1 before:h-full before:bg-indigo-400 before:top-0 before:left-4 pl-6 pr-4 text-gray-700"
        }
        ref={(element) => {
          refs.current[2] = element;
        }}
      >
        {children}
        <FormSection title={"Answer with"}>
          <FormChild className={"flex items-center gap-2"}>
            <Select
              id={"answersLanguage"}
              options={[set.source_language, set.target_language]}
              {...register("answersLanguage", {
                required: "This field is required",
              })}
            />
          </FormChild>

          {errors.answersLanguage && (
            <InputError message={errors.answersLanguage.message} />
          )}
          {errors?.root?.custom && (
            <InputError message={errors?.root?.custom?.message} />
          )}
        </FormSection>
      </div>
      <div
        className={"opacity-0 polygon-start ml-auto translate-y-12"}
        ref={(element) => {
          refs.current[3] = element;
        }}
      >
        <MainButton
          className={"bg-indigo-500 hover:bg-indigo-600 text-gray-100"}
          isRedirect={false}
        >
          Start
        </MainButton>
      </div>
    </form>
  );
};