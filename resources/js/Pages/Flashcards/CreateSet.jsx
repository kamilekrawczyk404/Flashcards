import InputError from "@/Components/Form/InputError.jsx";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/Form/TextInput.jsx";
import Textarea from "@/Components/Form/Textarea.jsx";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { Container } from "@/Components/Container";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import gsap from "gsap/all";
import { Select } from "@/Components/Form/Select.jsx";
import InputLabel from "@/Components/Form/InputLabel.jsx";
import { TranslationForm } from "@/Components/Translations/TranslationForm.jsx";
import { AddTranslationButton } from "@/Components/Translations/AddTranslationButton.jsx";
import Animation from "@/Pages/Animation.js";
import { ProgressModal } from "@/Components/ProgressModal.jsx";

export default function CreateSet({ auth, errorsFromController }) {
  const selectOptions = ["English", "Polish", "Spanish", "German"];
  const [source, setSource] = useState(selectOptions.at(0));
  const [isBeingCreated, setIsBeingCreated] = useState(false);
  const [serverErrors, setServerErrors] = useState({});

  let refs = useRef([]);
  let fieldsRef = useRef([]);

  const emptyFields = {
    term: "",
    definition: "",
  };

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    title: "",
    description: "",
    languages: {
      source: source,
      target: selectOptions[1],
    },
    translations: [
      {
        emptyFields,
      },
    ],
  });

  const { fields, append, remove } = useFieldArray({
    name: "translations",
    control,
  });

  const removingAnimation = (index) => {
    let removeTl = gsap.timeline();

    removeTl.to(fieldsRef.current[index], {
      duration: 1,
      opacity: 0,
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      y: "-1rem",
    });
  };

  const deleteTranslation = (translationId, title, index) => {
    remove(index);
  };

  const appendField = () => {
    append({
      emptyFields,
    });
  };

  const onSubmit = (data) => {
    router.post("/create-set", data);

    setServerErrors({});
    setIsBeingCreated(true);
  };

  useEffect(() => {
    append([emptyFields, emptyFields]);
  }, []);

  useEffect(() => {
    setServerErrors(errorsFromController);
  }, [errorsFromController]);

  useLayoutEffect(() => {
    const mainFieldsAnimation = new Animation(refs.current);
    const translationsAnimation = new Animation(fieldsRef.current);

    mainFieldsAnimation.animateAll("", "", "<+.2");
    translationsAnimation.animateAll("", "", "<+.1");
  }, [fields]);

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={"Create a new set"}
      // fullScreen={true}
    >
      <Head title={`Creating a new set`} />

      {!isBeingCreated && (
        <Container>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-2 text-gray-900 flex gap-4 flex-col"
          >
            <div
              className="bg-gradient-to-br from-indigo-600 to-indigo-400 rounded-md space-y-4 shadow-md p-4 polygon-start opacity-0 translate-y-12"
              ref={(element) => (refs.current[0] = element)}
            >
              <div className={"shadow-lg"}>
                <InputLabel
                  htmlFor={"title"}
                  className={"text-white"}
                  value={"Title"}
                />
                <TextInput
                  id={"title"}
                  placeholder={"Enter a title"}
                  className={"w-full"}
                  {...register("title", {
                    required: {
                      value: true,
                      message: "Field title is required",
                    },
                  })}
                />
              </div>

              <div className="w-full flex sm:flex-row flex-col gap-2">
                <div className="md:w-1/2 w-full shadow-lg">
                  <InputLabel
                    htmlFor={"description"}
                    className={"text-white"}
                    value={"Description"}
                  />
                  <Textarea
                    id={"description"}
                    placeholder="Add a description"
                    {...register("description", {
                      required: {
                        value: true,
                        message: "Field description is required",
                      },
                    })}
                  />
                </div>
                <div className="md:w-1/2 w-full flex flex-col">
                  <InputLabel
                    htmlFor={"source"}
                    className={"text-white"}
                    value={"Languages (source - target)"}
                  />
                  <div
                    className={
                      "flex flex-col gap-4 items-center h-full justify-between"
                    }
                  >
                    <Select
                      id={"source"}
                      className={"w-full shadow-lg"}
                      options={selectOptions}
                      {...register("languages.source", {
                        onChange: (e) => {
                          setSource(e.target.value);
                          setValue("languages", {
                            source: e.target.value,
                            target: selectOptions.filter(
                              (element) => element !== e.target.value,
                            )[0],
                          });
                        },
                        required: "Those fields are required",
                      })}
                    />

                    <Select
                      className={"w-full shadow-lg"}
                      options={selectOptions.filter(
                        (element) => element !== source,
                      )}
                      {...register("languages.target", {
                        required: "Those fields are required",
                      })}
                    />
                  </div>
                </div>
              </div>

              <div className={"space-y-4"}>
                {errors.language && (
                  <InputError message={errors.language.message} />
                )}
                {errors.title && <InputError message={errors.title.message} />}
                {errorsFromController.title && (
                  <InputError
                    className="whitespace-pre-line"
                    message={errorsFromController.title}
                  />
                )}
                {errors.description && (
                  <InputError message={errors.description.message} />
                )}
                {errors.translations && (
                  <InputError message="Fields in translations must be filled" />
                )}
                {errorsFromController.translations && (
                  <InputError message={errorsFromController.translations} />
                )}
              </div>
            </div>

            <div className={"overflow-y-scroll max-h-[40vh] space-y-4"}>
              {fields.map((field, index) => (
                <TranslationForm
                  key={index}
                  index={index}
                  ref={(element) => (fieldsRef.current[index] = element)}
                  handleRemovingAnimation={removingAnimation}
                  handleDeleteTranslation={deleteTranslation}
                  definitionRegister={register(
                    `translations.${index}.definition`,
                    {
                      required: {
                        value: true,
                        message: "Field definition is required",
                      },
                    },
                  )}
                  termRegister={register(`translations.${index}.term`, {
                    required: {
                      value: true,
                      message: "Field term is required",
                    },
                  })}
                />
              ))}
            </div>
            <AddTranslationButton
              ref={(element) => (refs.current[1] = element)}
              handleAppendField={appendField}
            />
            <div
              className="flex justify-end opacity-0 polygon-start translate-y-12"
              ref={(element) => (refs.current[2] = element)}
            >
              <PrimaryButton className="inline-block py-2 px-4 bg-indigo-500 hover:bg-indigo-600 hover:shadow-lg text-white rounded-md transition shadow-md">
                Create
              </PrimaryButton>
            </div>
          </form>
        </Container>
      )}

      <ProgressModal
        errors={serverErrors}
        inProgress={isBeingCreated}
        text={"We're creating your new set."}
      />
    </AuthenticatedLayout>
  );
}