import { Select } from "@/Components/Form/Select.jsx";
import InputError from "@/Components/Form/InputError.jsx";
import { AnimatedCheckbox } from "@/Components/AnimatedCheckbox.jsx";
import { MainButton } from "@/Components/MainButton.jsx";
import { Container } from "@/Components/Container.jsx";
import { useForm } from "react-hook-form";
import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap/all";
import { router } from "@inertiajs/react";
import Animation from "@/Pages/Animation.js";
import { FormChild } from "@/Components/Form/FormChild.jsx";

export const TestForm = ({
  set,
  translations,
  shuffledTranslations,
  trueOrFalseData,
  setIsStarted,
  setComponents,
  setTestProperties,
}) => {
  // IF I WILL BE CHECKING THE LAST TRANSLATION IN THE TEST MAKE COMPONENT FOR CHECKING IT
  // For checking that at least one component has been checked by user
  const [isAnyOptionSelected, setIsAnyOptionSelected] = useState(true);
  const refs = useRef([]);
  const languages = [
    JSON.parse(set.languages).source,
    JSON.parse(set.languages).target,
  ];
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      questionsLength: translations.length,
      answersLanguage: languages,
      TrueOrFalseAnswer: true,
      EnterAnswer: true,
      ChooseAnswer: true,
    },
  });

  useLayoutEffect(() => {
    const animation = new Animation(refs.current);
    animation.animateAll("<", "<+.1", "<+.2");
  }, []);

  const onSubmit = (data) => {
    if (!Object.keys(data).some((key) => data[key] === true)) {
      setIsAnyOptionSelected(false);
    } else {
      const formData = {
        isForeignLanguage:
          data.answersLanguage !== JSON.parse(set.languages).source,
        testTypes: Object.keys(data).filter((key) => data[key] === true),
        testLength: data.questionsLength,
      };
      setTestProperties(formData);

      makeTest(shuffledTranslations.splice(0, data.questionsLength), formData);
      setIsStarted(true);
    }
  };

  const makeTest = (data, formData) => {
    data.forEach((component, index) => {
      let randomComponentName =
        formData.testTypes[
          Math.floor(Math.random() * formData.testTypes.length)
        ];

      if (formData.isForeignLanguage)
        setComponents((prev) =>
          [
            ...prev,
            {
              name: randomComponentName,
              data:
                randomComponentName !== "TrueOrFalseAnswer"
                  ? component
                  : trueOrFalseData[index],
              isFilled: false,
            },
          ].sort((a, b) => 0.5 - Math.random()),
        );
      else {
        const { definition, term, ...rest } = component;
        setComponents((prev) => {
          return [
            ...prev,
            {
              name: randomComponentName,
              data:
                randomComponentName !== "TrueOrFalseAnswer"
                  ? {
                      ...rest,
                      term: {
                        word: component.definition.word,
                      },
                      definition: {
                        word: component.term.word,
                      },
                    }
                  : {
                      ...trueOrFalseData[index],
                      term: {
                        word: trueOrFalseData[index].definition.word,
                      },
                      definition: {
                        word: trueOrFalseData[index].term.word,
                      },
                    },
              isFilled: false,
            },
          ].sort((a, b) => 0.5 - Math.random());
        });
      }
    });
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
            Set up your test
          </p>
        </div>
        <div
          className="relative flex flex-col gap-2 bg-gray-100 py-4 space-y-2 rounded-md polygon-start opacity-0 translate-y-12 before:absolute before:w-1 before:h-full before:bg-indigo-400 before:top-0 before:left-3 pl-6 pr-4 text-gray-700"
          ref={(element) => {
            refs.current[2] = element;
          }}
        >
          <FormChild>
            <label htmlFor="questionLength">
              Questions{" "}
              <span
                className={
                  "bg-indigo-500 p-2 rounded-lg text-gray-100 font-bold"
                }
              >
                max {translations.length}
              </span>
            </label>
            <input
              className={
                "w-20 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
              }
              id={"questionLength"}
              type="number"
              max={translations.length}
              min={1}
              {...register("questionsLength")}
            />
          </FormChild>
          <FormChild>
            <label htmlFor={"answersLanguage"}>Answer with</label>

            <Select
              id={"answersLanguage"}
              options={languages}
              {...register("answersLanguage", {
                required: "This field is required",
              })}
            />
          </FormChild>
          {errors.answersLanguage && (
            <InputError message={errors.answersLanguage.message} />
          )}
        </div>
        <div
          className={
            "flex gap-4 flex-col polygon-start opacity-0 translate-y-12 bg-gray-100 py-4 space-y-2 rounded-md before:absolute before:w-1 before:h-full before:bg-indigo-400 before:top-0 before:left-3 pl-6 pr-4 text-gray-700"
          }
          ref={(element) => {
            refs.current[3] = element;
          }}
        >
          <FormChild>
            True / false
            <AnimatedCheckbox {...register("TrueOrFalseAnswer")} />
          </FormChild>
          <FormChild>
            Multiple choice
            <AnimatedCheckbox {...register("ChooseAnswer")} />
          </FormChild>
          <FormChild>
            Written
            <AnimatedCheckbox {...register("EnterAnswer")} />
          </FormChild>
          {!isAnyOptionSelected && (
            <InputError
              message={
                "At least one selected option is required to start the test"
              }
            />
          )}
        </div>
        <div
          className={"opacity-0 polygon-start ml-auto translate-y-12"}
          ref={(element) => {
            refs.current[4] = element;
          }}
        >
          <MainButton
            className={"bg-indigo-500 hover:bg-indigo-600 text-gray-100"}
            isRedirect={false}
          >
            Start Test
          </MainButton>
        </div>
      </form>
    </Container>
  );
};