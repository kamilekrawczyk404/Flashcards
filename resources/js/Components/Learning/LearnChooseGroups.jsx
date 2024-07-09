import { Container } from "@/Components/Container.jsx";
import { FormChild } from "@/Components/Form/FormChild.jsx";
import { useForm } from "react-hook-form";
import { FormSection } from "@/Components/Form/FormSection.jsx";
import { PlanningForm } from "@/Components/Form/PlanningForm.jsx";
import { GroupPropertiesForm } from "@/Components/Form/GroupPropertiesForm.jsx";
import { AnimatedCheckbox } from "@/Components/Form/AnimatedCheckbox.jsx";
import InputLabel from "@/Components/Form/InputLabel.jsx";
import { useState } from "react";

export const LearnChooseGroups = ({
  set,
  groupsProperties,
  handleSetComponentProperties,
  handleSetIsChoosingGroups,
}) => {
  const {
    formState: { errors, dirtyFields },
    register,
    handleSubmit,
    getValues,
    resetField,
    setError,
  } = useForm({
    defaultValues: {
      onlyDifficult: false,
      groupsProperties,
      answersLanguage: [set.source_language, set.target_language],
    },
  });

  const [onlyDifficult, setOnlyDifficult] = useState(false);

  return (
    <Container className={"mt-4"}>
      <PlanningForm
        handleSubmit={handleSubmit}
        handleSetIsChoosingGroups={handleSetIsChoosingGroups}
        handleSetComponentProperties={handleSetComponentProperties}
        register={register}
        errors={errors}
        setError={setError}
        set={set}
        title={"Set up your learning plan"}
      >
        {!groupsProperties.every((group) => group.difficult.disabled) && (
          <FormSection title={"Only difficult"}>
            <FormChild>
              <AnimatedCheckbox
                disabled={dirtyFields?.groupsProperties ?? false}
                onClick={() => setOnlyDifficult((prev) => !prev)}
                id={"onlyDifficult"}
                {...register(`onlyDifficult`)}
              />
              <InputLabel
                value={
                  "Create a learning set containing difficult translations only [from all groups]"
                }
                htmlFor={"onlyDifficult"}
              />
            </FormChild>
          </FormSection>
        )}

        <FormSection title={"Groups"} className={"gap-2"}>
          {groupsProperties.map((group, index) => (
            <FormChild className={"gap-2 flex-col"} key={index}>
              <GroupPropertiesForm
                disabled={onlyDifficult}
                group={group}
                errors={errors}
                register={register}
                id={index}
                getValues={getValues}
                resetField={resetField}
              />
            </FormChild>
          ))}
        </FormSection>
      </PlanningForm>
    </Container>
  );
};