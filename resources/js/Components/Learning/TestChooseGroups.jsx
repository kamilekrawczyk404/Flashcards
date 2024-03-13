import { Container } from "@/Components/Container.jsx";
import { FormChild } from "@/Components/Form/FormChild.jsx";
import { useForm } from "react-hook-form";
import { FormSection } from "@/Components/Form/FormSection.jsx";
import { PlanningForm } from "@/Components/Form/PlanningForm.jsx";
import { GroupPropertiesForm } from "@/Components/Form/GroupPropertiesForm.jsx";
import { AnimatedCheckbox } from "@/Components/Form/AnimatedCheckbox.jsx";
import InputLabel from "@/Components/Form/InputLabel.jsx";

export const TestChooseGroups = ({
  set,
  groupsProperties,
  handleSetComponentProperties,
  handleSetIsChoosingGroups,
  isTest = false,
}) => {
  const testModes = isTest
    ? {
        TrueOrFalseAnswer: true,
        EnterAnswer: true,
        ChooseAnswer: true,
      }
    : {};
  const {
    formState: { errors, dirtyFields },
    register,
    handleSubmit,
    getValues,
    setError,
  } = useForm({
    defaultValues: {
      groupsProperties,
      answersLanguage: [set.source_language, set.target_language],
      ...testModes,
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
        setError={setError}
        set={set}
        title={"Set up your learning plan"}
        isTest={true}
      >
        <FormSection title={"Groups"}>
          {groupsProperties.map((group, index) => (
            <FormChild key={index}>
              <GroupPropertiesForm
                group={group}
                errors={errors}
                register={register}
                id={index}
                getValues={getValues}
                isTest={true}
              />
            </FormChild>
          ))}
        </FormSection>
        {isTest && (
          <FormSection title={"Test modes"}>
            <FormChild>
              <AnimatedCheckbox {...register("TrueOrFalseAnswer")} />
              <InputLabel value={"True / false"} />
            </FormChild>
            <FormChild>
              <AnimatedCheckbox {...register("ChooseAnswer")} />
              <InputLabel value={"Multiple choice"} />
            </FormChild>
            <FormChild>
              <AnimatedCheckbox {...register("EnterAnswer")} />
              <InputLabel value={"Written"} />
            </FormChild>
          </FormSection>
        )}
      </PlanningForm>
    </Container>
  );
};