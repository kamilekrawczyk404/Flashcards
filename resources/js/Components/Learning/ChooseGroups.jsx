import { Container } from "@/Components/Container.jsx";
import { FormContainer } from "@/Components/Form/FormContainer.jsx";
import { MainButton } from "@/Components/MainButton.jsx";
import { useLayoutEffect, useRef } from "react";
import Animation from "@/Pages/Animation.js";
import { AnimatedCheckbox } from "@/Components/AnimatedCheckbox.jsx";
import { useForm } from "react-hook-form";
import InputError from "@/Components/Form/InputError.jsx";
import { Select } from "@/Components/Form/Select.jsx";

export const ChooseGroups = ({
  set,
  groups,
  handleSetLearningProperties,
  handleSetIsChoosingGroups,
  className = "",
}) => {
  const refs = useRef([]);

  useLayoutEffect(() => {
    const animation = new Animation([refs.current]);
    animation.animateAll("", "", "");
  }, []);

  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm({
    defaultValues: {
      groups,
      answersLanguage: [set.source_language, set.target_language],
    },
  });

  const onSubmit = (data) => {
    handleSetLearningProperties(data);
    handleSetIsChoosingGroups(false);
  };

  return (
    <Container>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex gap-4 flex-col relative polygon-start opacity-0 translate-y-12 text-md"
        ref={(element) => {
          refs.current[1] = element;
        }}
      >
        <div>
          <p className="text-xl font-semibold bg-indigo-500 rounded-md text-gray-100 p-2 w-fit">
            {set.title}
          </p>
          <p className="text-2xl text-indigo-500 font-semibold mt-2">
            Set up your learning plan
          </p>
        </div>
        <div
          className="relative flex gap-4 flex-col items-start bg-gray-100 py-4 space-y-2 rounded-md polygon-start opacity-0 translate-y-12 before:absolute before:w-1 before:h-full before:bg-indigo-400 before:top-0 before:left-4 pl-6 pr-4 text-gray-700"
          ref={(element) => {
            refs.current[2] = element;
          }}
        >
          <div className={"flex flex-col gap-2 items-start ml-3"}>
            <span
              className={
                "bg-indigo-500 rounded-lg px-2 py-1 text-gray-100 font-bold w-fit"
              }
            >
              Groups
            </span>
            {groups.map((group, index) => (
              <FormContainer className={"space-x-4"} key={index}>
                <AnimatedCheckbox {...register(`groups[${index}].isChecked`)} />
                <span className={"font-bold"}>{group.name}</span>
              </FormContainer>
            ))}
          </div>
          <div className={"flex flex-col gap-2 ml-3"}>
            <span
              className={
                "bg-indigo-500 rounded-lg px-2 py-1 text-gray-100 font-bold w-fit"
              }
            >
              Answer with
            </span>
            <FormContainer className={"flex items-center gap-2"}>
              <Select
                id={"answersLanguage"}
                options={[set.source_language, set.target_language]}
                {...register("answersLanguage", {
                  required: "This field is required",
                })}
              />
            </FormContainer>
          </div>
          <div className={"ml-3"}>
            {errors.answersLanguage && (
              <InputError message={errors.answersLanguage.message} />
            )}
          </div>
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
            Start Learning
          </MainButton>
        </div>
      </form>
    </Container>
  );
};