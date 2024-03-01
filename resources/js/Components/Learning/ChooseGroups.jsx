import { Container } from "@/Components/Container.jsx";
import { FormChild } from "@/Components/Form/FormChild.jsx";
import { MainButton } from "@/Components/MainButton.jsx";
import { useLayoutEffect, useRef } from "react";
import Animation from "@/Pages/Animation.js";
import { AnimatedCheckbox } from "@/Components/AnimatedCheckbox.jsx";
import { useForm } from "react-hook-form";
import InputError from "@/Components/Form/InputError.jsx";
import { Select } from "@/Components/Form/Select.jsx";
import { FormSection } from "@/Components/Form/FormSection.jsx";
import { PlanningForm } from "@/Components/Form/PlanningForm.jsx";

export const ChooseGroups = ({
  set,
  groupsNames,
  handleSetComponentProperties,
  handleSetIsChoosingGroups,
  className = "",
}) => {
  const {
    formState: { errors, dirtyFields },
    register,
    handleSubmit,
  } = useForm({
    defaultValues: {
      ...groupsNames,
      answersLanguage: [set.source_language, set.target_language],
    },
  });

  return (
    <Container>
      <PlanningForm
        handleSubmit={handleSubmit}
        handleSetIsChoosingGroups={handleSetIsChoosingGroups}
        handleSetComponentProperties={handleSetComponentProperties}
        register={register}
        errors={errors}
        set={set}
        title={"Set up your learning plan"}
      >
        <FormSection title={"Groups"}>
          {Object.keys(groupsNames).map((groupName, index) => (
            <FormChild className={"space-x-4"} key={index}>
              <AnimatedCheckbox {...register(groupName)} />
              <span className={"font-bold"}>{groupName}</span>
            </FormChild>
          ))}
        </FormSection>
      </PlanningForm>
    </Container>
  );
};