import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import TextInput from "@/Components/Form/TextInput.jsx";
import Textarea from "@/Components/Form/Textarea.jsx";
import InputError from "@/Components/Form/InputError.jsx";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { Container } from "@/Components/Container";
import { MainButton } from "@/Components/Buttons/MainButton.jsx";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap/all";
import InputLabel from "@/Components/Form/InputLabel.jsx";
import TranslationsData from "@/TranslationsData.js";
import { TranslationForm } from "@/Components/Translations/TranslationForm.jsx";
import { AddButton } from "@/Components/Form/AddButton.jsx";
import Animation from "@/Pages/Animation.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ProgressModal } from "@/Components/Loading/ProgressModal.jsx";
import GroupsFieldArray from "@/Components/Form/GroupsFieldArray.jsx";
import PrimaryButton from "@/Components/Buttons/PrimaryButton.jsx";

export default function EditSet({ auth, set, groups, errorsFromController }) {
  const mainInputsRefs = useRef([]);
  // validation on client side will prevent submitting form if occur errors on client side,
  // but we must prevent showing up LoadProgress if there occur some errors form server,
  // so we need to them in state and refresh it after each submission
  const [serverErrors, setServerErrors] = useState({});
  const [isSetBeingUpdated, setIsSetBeingUpdated] = useState(false);
  const [customErrors, setCustomErrors] = useState({
    uniqueGroupName: {
      value: false,
      message: "Group names must be unique",
    },
  });

  const { title, description } = set;

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm({
    defaultValues: {
      title: title.replaceAll("_", " "),
      description: description,
      groups: groups,
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "groups",
    control,
  });

  const listener = useWatch({ control, name: "groups" });

  const deleteTranslation = (translationId, title, currentTranslationIndex) => {
    remove(currentTranslationIndex);

    router.delete(`/set/${set.id}/delete/translation/${translationId}`);
  };

  const onSubmit = (data) => {
    if (!customErrors.uniqueGroupName.value) {
      data.set_id = set.id;
      router.put(`/update-set/${set.id}`, data);
      setServerErrors({});
      setIsSetBeingUpdated(true);
    }
  };

  useEffect(() => {
    setServerErrors(errorsFromController);
  }, [errorsFromController]);

  useEffect(() => {
    const names = getValues().groups.map((group) => group.name.trim());

    if (new Set(names).size !== names.length)
      setCustomErrors((prev) => ({
        ...prev,
        uniqueGroupName: { ...prev.uniqueGroupName, value: true },
      }));
    else
      setCustomErrors((prev) => ({
        ...prev,
        uniqueGroupName: { ...prev.uniqueGroupName, value: false },
      }));
  }, [listener]);

  useLayoutEffect(() => {
    const mainFieldsAnimation = new Animation(mainInputsRefs.current);

    mainFieldsAnimation.animateAll("", "", "<+.2");
  }, [serverErrors]);

  return (
    <AuthenticatedLayout
      fullScreen={true}
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-700 leading-tight">
          Editing set
          <Link
            href={route("flashcards.showSet", [set.id, set.title])}
            className="text-indigo-500"
          >
            {" "}
            {set.title.replaceAll("_", " ")}
          </Link>
        </h2>
      }
    >
      <Head title={`Editing set - ${set.title}`} />

      {(!isSetBeingUpdated || Object.values(serverErrors).length !== 0) && (
        <Container>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-2 text-gray-900 flex gap-4 flex-col"
          >
            <div
              className="bg-gradient-to-br from-indigo-600 to-indigo-400 rounded-md shadow-md p-4 polygon-start opacity-0 translate-y-12"
              ref={(element) => (mainInputsRefs.current[0] = element)}
            >
              <div className={"flex items-center justify-between gap-4"}>
                <div className={"shadow-lg w-full self-start"}>
                  <InputLabel htmlFor={"title"} className={"text-white"}>
                    Title
                  </InputLabel>
                  <TextInput
                    id={"title"}
                    placeholder={"Enter a title"}
                    className="w-full"
                    name="title"
                    {...register("title", {
                      required: {
                        value: true,
                        message: "Field title is required",
                      },
                    })}
                  />
                </div>
                <div className="shadow-lg w-full">
                  <InputLabel htmlFor={"description"} className={"text-white"}>
                    Description
                  </InputLabel>
                  <Textarea
                    placeholder="Add a description"
                    name="description"
                    {...register("description", {
                      required: {
                        value: true,
                        message: "Field description is required",
                      },
                    })}
                  />
                </div>
              </div>
              <div className={"space-y-4"}>
                {errors.title && <InputError message={errors.title.message} />}
                {errors.description && (
                  <InputError
                    message={errors.description.message}
                    className="mt-4"
                  />
                )}
                {errorsFromController.title && (
                  <InputError message={serverErrors.title} />
                )}
                {customErrors.uniqueGroupName.value && (
                  <InputError message={customErrors.uniqueGroupName.message} />
                )}
              </div>
            </div>

            <div className={"space-y-4"}>
              <GroupsFieldArray
                editingMode={true}
                {...{
                  control,
                  register,
                  setValue,
                  getValues,
                  errors,
                  groups,
                }}
              />
            </div>

            <div
              className="flex justify-end opacity-0 polygon-start translate-y-12"
              ref={(element) => (mainInputsRefs.current[1] = element)}
            >
              <PrimaryButton className="inline-block py-2 px-4 bg-indigo-500 hover:bg-indigo-600 hover:shadow-lg text-white rounded-md transition shadow-md">
                Update
              </PrimaryButton>
            </div>
          </form>
        </Container>
      )}

      <ProgressModal
        errors={serverErrors}
        inProgress={isSetBeingUpdated}
        text={"We're updating your set."}
      />
    </AuthenticatedLayout>
  );
}