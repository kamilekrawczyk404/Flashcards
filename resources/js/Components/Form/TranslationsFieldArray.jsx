import { useFieldArray } from "react-hook-form";
import { TranslationForm } from "@/Components/Translations/TranslationForm.jsx";
import { AddButton } from "@/Components/Form/AddButton.jsx";
import Animation from "@/Pages/Animation.js";
import { forwardRef, useContext, useLayoutEffect, useRef } from "react";

export default forwardRef(
  (
    {
      translationIndex,
      control,
      register,
      getValues,
      errors,
      className = "",
      editingMode = false,
    },
    ref,
  ) => {
    const { fields, remove, append } = useFieldArray({
      control,
      name: `groups[${translationIndex}].translations`,
    });

    const translationRef = useRef([]);

    useLayoutEffect(() => {
      const groupAnimation = new Animation(translationRef.current);
      groupAnimation.animateAll("", "+.2", "+.3");
    }, [getValues(`groups[${translationIndex}].translations`).length]);

    const removingAnimation = (index) => {
      const removeSingleFieldAnimation = new Animation(
        [translationRef.current.at(index)],
        true,
      );
      removeSingleFieldAnimation.animateAll("+.2", "", "");
    };

    return (
      <div
        ref={ref}
        className={
          "space-y-2 transform opacity-0 polygon-start translate-y-12 flex flex-col " +
          className
        }
      >
        {fields.map((translation, index) => (
          <TranslationForm
            ref={(element) => {
              if (index > 1) translationRef.current[index] = element;
            }}
            key={index}
            index={index}
            termRegister={register(
              `groups[${translationIndex}].translations[${index}].term`,
              {
                required: { value: true, message: "Field term is required" },
              },
            )}
            definitionRegister={register(
              `groups[${translationIndex}].translations[${index}].definition`,
              {
                required: {
                  value: true,
                  message: "Field definition is required",
                },
              },
            )}
            handleDeleteTranslation={remove}
            handleRemovingAnimation={removingAnimation}
            errors={errors?.groups?.[translationIndex]?.translations?.[index]}
          />
        ))}
        <AddButton
          onClick={() =>
            append(
              editingMode
                ? {
                    term: "",
                    definition: "",
                    isNew: true,
                  }
                : {
                    term: "",
                    definition: "",
                  },
            )
          }
          text={"Add translation"}
          className={"py-4"}
        />
      </div>
    );
  },
);