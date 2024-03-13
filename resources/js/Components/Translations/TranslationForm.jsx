import React, { forwardRef, useContext } from "react";
import TextInput from "@/Components/Form/TextInput.jsx";
import InputLabel from "@/Components/Form/InputLabel.jsx";
import { GradientAndLines } from "@/Components/GradientAndLines.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InputError from "@/Components/Form/InputError.jsx";
import { ThemeContext } from "@/ThemeContext.jsx";

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
    const { properties } = useContext(ThemeContext);

    return (
      <div className={"w-[calc(100%-2rem)] self-center"}>
        <GradientAndLines
          className={
            "p-4 flex gap-4 justify-between items-center " +
            (index > 1 && "polygon-start opacity-0 -translate-y-12")
          }
          ref={ref}
          hasLines={true}
          linesColor={"bg-gray-100"}
          from={"from-indigo-600"}
          to={"to-indigo-400"}
        >
          <span
            className={
              properties.text +
              " " +
              properties.container +
              " font-semibold text-lg text-indigo-500 p-2 rounded-sm shadow-lg bg-gray-100"
            }
          >
            #{index + 1}
          </span>

          <div className="flex w-full flex-col md:flex-row gap-4">
            <div className="md:w-1/2">
              <InputLabel value={"Term"} />
              <TextInput
                {...termRegister}
                placeholder="Term"
                className="w-full z-10"
              />
              {errors?.term && (
                <InputError
                  className={"mt-2"}
                  message={errors?.term?.message}
                />
              )}
            </div>
            <div className="md:w-1/2">
              <InputLabel value={"Definition"} />
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
                properties.background +
                " " +
                properties.text +
                " flex items-center justify-center p-2 rounded-sm shadow-lg"
              }
              type={"button"}
              onClick={() => {
                handleRemovingAnimation(index);
                setTimeout(() => {
                  handleDeleteTranslation(index);
                }, 800);
              }}
            >
              <FontAwesomeIcon
                icon="fa-solid fa-trash"
                className={"hover:text-red-500 transition text-lg"}
              />
            </button>
          )}
        </GradientAndLines>
      </div>
    );
  },
);