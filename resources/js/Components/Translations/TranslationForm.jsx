import React, { forwardRef } from "react";
import TextInput from "@/Components/Form/TextInput.jsx";
import InputLabel from "@/Components/Form/InputLabel.jsx";
import { GradientAndLines } from "@/Components/GradientAndLines.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InputError from "@/Components/Form/InputError.jsx";

export const TranslationForm = forwardRef(
  (
    {
      index,
      handleIsDeletedAnyTranslation = () => {},
      handleDeleteTranslation,
      handleRemovingAnimation,
      termRegister,
      definitionRegister,
      translationId,
      errors,
    },
    ref,
  ) => {
    return (
      <GradientAndLines
        className={
          "p-4 flex gap-4 justify-between items-center " +
          (index > 1 && "polygon-start opacity-0 -translate-y-12")
        }
        ref={ref}
        hasLines={true}
        linesColor={"bg-gray-100"}
      >
        <span className="font-semibold text-lg text-indigo-500 p-2 rounded-sm shadow-lg bg-gray-100">
          #{index + 1}
        </span>

        <div className="flex w-full flex-col md:flex-row gap-4">
          <div className="md:w-1/2">
            <InputLabel
              className={"text-white font-bold text-md"}
              value={"Term"}
            />
            <TextInput
              {...termRegister}
              placeholder="Term"
              className="w-full z-10"
            />
            {errors?.term && (
              <InputError className={"mt-2"} message={errors?.term?.message} />
            )}
          </div>
          <div className="md:w-1/2">
            <InputLabel className={"text-white"} value={"Definition"} />
            <TextInput
              {...definitionRegister}
              placeholder="Definition"
              className="w-full z-10"
            />
            {errors?.definition && (
              <InputError
                message={errors?.definition?.message}
                className={"mt-2"}
              />
            )}
          </div>
        </div>

        {index > 1 && (
          <button
            className={
              "flex items-center justify-center bg-gray-100 p-2 rounded-sm shadow-lg"
            }
            type={"button"}
            onClick={() => {
              handleRemovingAnimation(index);
              setTimeout(() => {
                handleDeleteTranslation(index);
                // handleIsDeletedAnyTranslation(true);
                // handleDeleteTranslation(translationId, title, index);
              }, 800);
            }}
          >
            <FontAwesomeIcon
              icon="fa-solid fa-trash"
              className={"hover:text-red-500 transition text-gray-700 text-lg"}
            />
          </button>
        )}
      </GradientAndLines>
    );
  },
);