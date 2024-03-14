import { MainButton } from "@/Components/Buttons/MainButton.jsx";
import React, { useContext, useEffect, useMemo } from "react";
import { CancelButton } from "@/Components/Modals/CancelButton.jsx";
import TextInput from "@/Components/Form/TextInput.jsx";
import { useForm } from "react-hook-form";
import InputError from "@/Components/Form/InputError.jsx";
import { router } from "@inertiajs/react";
import TranslationsData from "@/TranslationsData.js";
import { GradientAndLines } from "@/Components/GradientAndLines.jsx";
import { ThemeContext } from "@/ThemeContext.jsx";
import { ModalLayout } from "@/Components/Modals/ModalLayout.jsx";
import { ModalButtons } from "@/Components/Modals/ModalButtons.jsx";

export const PopUpEdit = ({
  modalId = "",
  translation,
  set,
  cancelEditing,
}) => {
  const { properties } = useContext(ThemeContext);
  const {
    formState: { errors, dirtyFields, isDirty },
    handleSubmit,
    register,
    reset,
  } = useForm({
    defaultValues: {
      term: translation.term,
      definition: translation.definition,
    },
  });

  const onSubmit = (data) => {
    router.put(
      `/set/${set.id}/update-translation/${translation.id}`,
      { translation: data },
      {
        preserveScroll: true,
        preserveState: false,
      },
    );
  };

  useEffect(() => {
    reset(translation);
  }, [translation]);

  return (
    <ModalLayout modalId={modalId}>
      <header className="flex justify-between items-center">
        <h2 className="font-bold text-2xl text-indigo-500">Edit translation</h2>
        <CancelButton
          isModal={true}
          modalId={modalId}
          className={"modal__close"}
          onClick={(e) => {
            e.preventDefault();
            cancelEditing();
            MicroModal.close(modalId);
          }}
        />
      </header>
      <form className={"flex gap-6 flex-col"} onSubmit={handleSubmit(onSubmit)}>
        <GradientAndLines
          className={"p-4"}
          from={"from-indigo-600"}
          to={"to-indigo-400"}
          hasLines={true}
          linesColor={"bg-gray-100"}
        >
          <div className="flex flex-col gap-4">
            <div className="w-full">
              <span className={"text-gray-100 text-xl font-semibold"}>
                Term
              </span>
              <TextInput
                placeholder="Term"
                className="w-full text-lg mt-2"
                {...register("term", {
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
            <div className="w-full">
              <span className={"text-gray-100 text-xl font-semibold"}>
                Definition
              </span>
              <TextInput
                placeholder="Definition"
                className="w-full text-lg mt-2"
                {...register("definition", {
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
        <ModalButtons cancelEditing={cancelEditing} />
      </form>
    </ModalLayout>
  );
};