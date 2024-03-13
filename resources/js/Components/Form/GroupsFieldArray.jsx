import { useFieldArray } from "react-hook-form";
import TranslationsFieldArray from "@/Components/Form/TranslationsFieldArray.jsx";
import { AddButton } from "@/Components/Form/AddButton.jsx";
import { GradientAndLines } from "@/Components/GradientAndLines.jsx";
import TextInput from "@/Components/Form/TextInput.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InputLabel from "@/Components/Form/InputLabel.jsx";
import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Animation from "@/Pages/Animation.js";
import gsap from "gsap/all";
import InputError from "@/Components/Form/InputError.jsx";
import { error } from "@splidejs/splide/src/js/utils";
import { ThemeContext } from "@/ThemeContext.jsx";

export default function ({
  control,
  register,
  setValue,
  getValues,
  errors,
  editingMode = false,
}) {
  const { properties } = useContext(ThemeContext);
  const { fields, append, remove } = useFieldArray({
    control,
    name: "groups",
  });

  const groupRef = useRef([]);
  const translationsRef = useRef([]);
  const addButtonRef = useRef(null);

  const [activeGroup, setActiveGroup] = useState(0);

  const [lastGroupIndex, setLastGroupIndex] = useState(
    getValues().groups.length,
  );

  const removingAnimation = (index) => {
    const removeSingleFieldAnimation = new Animation(
      [groupRef.current.at(index)],
      true,
    );
    removeSingleFieldAnimation.animateAll("", "", "");
  };

  const appendGroup = () => {
    append(
      editingMode
        ? {
            name: `Group ${lastGroupIndex + 1}`,
            translations: [
              { term: "", definition: "", isNew: true },
              { term: "", definition: "", isNew: true },
            ],
          }
        : {
            name: `Group ${lastGroupIndex + 1}`,
            translations: [
              { term: "", definition: "" },
              { term: "", definition: "" },
            ],
          },
    );
  };

  useLayoutEffect(() => {
    const buttonAnimation = new Animation([addButtonRef.current]);
    buttonAnimation.animateAll("", "", "<+.2");
  }, []);

  useLayoutEffect(() => {
    const groupAnimation = new Animation(groupRef.current);
    groupAnimation.animateAll("", "+.2", "+.3");
  }, [getValues().groups.length]);

  useEffect(() => {
    const show = new Animation([translationsRef.current[activeGroup]]);
    const hide = new Animation(
      [
        activeGroup === -1
          ? translationsRef.current
          : translationsRef.current.toSpliced(activeGroup, 1),
      ],
      true,
    );
    show.animateAll("", "+.2", "+.3");
    if (lastGroupIndex !== 1) hide.animateAll("+.3", "+.2", "");
  }, [activeGroup]);

  return (
    <>
      {fields.map((group, index) => (
        <section
          key={index}
          ref={(element) => (groupRef.current[index] = element)}
          className={
            "space-y-2 transform polygon-from-top opacity-0 translate-y-12"
          }
        >
          <GradientAndLines
            className={"p-4 flex justify-between items-center gap-2"}
            from={"from-amber-500"}
            to={"to-amber-300"}
          >
            <div className={"w-1/2"}>
              <InputLabel value={"Group name"} />
              <TextInput
                className={"w-full"}
                type="text"
                {...register(`groups[${index}].name`, {
                  required: {
                    value: true,
                    message: "Field group name is required",
                  },
                })}
              />

              {errors?.groups?.[index]?.name && (
                <InputError
                  className={"mt-4"}
                  message={errors?.groups?.[index]?.name?.message}
                />
              )}
            </div>
            <div className={"flex gap-2"}>
              {index > 0 && (
                <button
                  className={
                    properties.background +
                    " " +
                    properties.text +
                    " flex items-center justify-center p-2 rounded-sm shadow-lg"
                  }
                  type={"button"}
                  onClick={() => {
                    removingAnimation(index);
                    setLastGroupIndex((prev) => prev - 1);
                    setActiveGroup((prev) => prev - 1);

                    setTimeout(() => {
                      remove(index);
                    }, 700);
                  }}
                >
                  <FontAwesomeIcon
                    icon="fa-solid fa-trash"
                    className={"hover:text-red-500 transition text-lg"}
                  />
                </button>
              )}

              {lastGroupIndex > 1 && (
                <button
                  className={
                    properties.background +
                    " " +
                    properties.text +
                    " flex items-center justify-center rounded-sm shadow-lg " +
                    (activeGroup === index && "[&>span]:rotate-0")
                  }
                  type={"button"}
                  onClick={() => {
                    if (activeGroup === index) {
                      setActiveGroup(-1);
                    } else {
                      setActiveGroup(index);
                    }
                  }}
                >
                  <span
                    className={
                      "transform transition origin-[center,center] rotate-180 p-2"
                    }
                  >
                    <FontAwesomeIcon icon="fa-solid fa-arrow-up text-lg" />
                  </span>
                </button>
              )}
            </div>
          </GradientAndLines>

          <TranslationsFieldArray
            ref={(element) => (translationsRef.current[index] = element)}
            editingMode={true}
            translationIndex={index}
            {...{
              control,
              register,
              getValues,
              errors,
            }}
          />
        </section>
      ))}
      <AddButton
        ref={addButtonRef}
        text={"Add group"}
        className={"py-8 polygon-start opacity-0"}
        onClick={() => {
          appendGroup();

          setLastGroupIndex((prev) => prev + 1);
          setActiveGroup(lastGroupIndex);
        }}
      />
    </>
  );
}