import { MainButton } from "@/Components/MainButton.jsx";
import React, { useEffect, useMemo } from "react";
import { CancelButton } from "@/Components/Modals/CancelButton.jsx";
import TextInput from "@/Components/Form/TextInput.jsx";
import { useForm } from "react-hook-form";
import InputError from "@/Components/Form/InputError.jsx";
import { router } from "@inertiajs/react";
import TranslationsData from "@/TranslationsData.js";
import { GradientAndLines } from "@/Components/GradientAndLines.jsx";

export const PopUpEdit = ({
  modalId = "",
  translation,
  set,
  cancelEditing,
  handleFetchTranslations,
}) => {
  const {
    formState: { errors, dirtyFields, isDirty },
    handleSubmit,
    register,
    reset,
  } = useForm({
    defaultValues: {
      term: translation.term.word,
      definition: translation.definition.word,
    },
  });

  useEffect(() => {
    reset(translation);
  }, [translation]);

  const onSubmit = (data) => {
    router.put(
      `/set/${set.id}/update-translation/${translation.id}/${set.title}`,
      { translation: data },
      {
        preserveScroll: true,
        preserveState: false,
        onFinish: () => {
          handleFetchTranslations();
        },
      },
    );
  };

  return (
    <div
      className="micromodal-slide modal m-10 absolute z-10"
      id={modalId}
      aria-hidden="true"
    >
      <div
        className="modal__overlay fixed top-0 left-0 right-0 bg-opacity-gray bottom-0 flex items-center justify-center"
        tabIndex="-1"
        data-micromodal-close={modalId}
      >
        <div
          className="modal__container flex gap-6 flex-col bg-white md:w-1/2 w-full md:m-0 m-4 p-4 rounded-md overflow-y-auto border-b relative z-10"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-1-title"
        >
          <header className="flex justify-between items-center">
            <h2 className="font-bold text-2xl text-indigo-500">Edit</h2>
            <CancelButton
              isModal={true}
              modalId={"modal-1"}
              className={"modal__close"}
              onClick={(e) => {
                e.preventDefault();
                cancelEditing();
                MicroModal.close(modalId);
              }}
            />
          </header>
          <form
            className={"flex gap-6 flex-col"}
            onSubmit={handleSubmit(onSubmit)}
          >
            <GradientAndLines className={"p-4"}>
              <div className="flex md:flex-row flex-col gap-4">
                <div className="md:w-1/2 w-full">
                  <span className={"text-gray-100 text-xl font-semibold"}>
                    Term
                  </span>
                  <TextInput
                    placeholder="Term"
                    className="w-full text-lg mt-2"
                    {...register("term.word", {
                      required: "This field is required",
                    })}
                  />
                  {errors.term && (
                    <InputError
                      message={"This field is required"}
                      className={"mt-2"}
                    />
                  )}
                </div>
                <div className="md:w-1/2 w-full">
                  <span className={"text-gray-100 text-xl font-semibold"}>
                    Definition
                  </span>
                  <TextInput
                    placeholder="Definition"
                    className="w-full text-lg mt-2"
                    {...register("definition.word", {
                      required: "This field is required",
                    })}
                  />
                  {errors.definition && (
                    <InputError
                      message={"This field is required"}
                      className={"mt-2"}
                    />
                  )}
                </div>
              </div>
            </GradientAndLines>
            <div className={"self-end"}>
              <button
                type={"button"}
                onClick={(e) => {
                  e.preventDefault();
                  MicroModal.close(modalId);
                  cancelEditing();
                }}
                className={"border-b-2 tracking-widest mr-8 border-indigo-500"}
              >
                Cancel
              </button>
              <MainButton
                onClick={() => {
                  MicroModal.close(modalId);
                  cancelEditing();
                }}
                className={"bg-indigo-500 text-gray-100 hover:bg-indigo-600"}
              >
                Save
              </MainButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};