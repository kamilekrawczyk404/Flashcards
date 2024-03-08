import { SoundButton } from "@/Components/Translations/SoundButton.jsx";
import { EditButton } from "@/Components/Buttons/EditButton.jsx";
import MicroModal from "micromodal";
import { router } from "@inertiajs/react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

export const Translation = ({
  permissions,
  translation,
  groupIndex,
  set,
  handleSetChosenTranslation,
}) => {
  const submit = (e) => {
    e.preventDefault();

    router.put(
      `/set/setFavourite/`,
      {
        value: !Boolean(parseInt(translation.is_favourite)),
        translation_id: translation.id,
        set_id: set.id,
      },
      {
        preserveScroll: true,
        preserveState: true,
      },
    );
  };

  return (
    <form
      onSubmit={submit}
      className={
        "bg-gradient-to-tl from-indigo-600 to-indigo-400 p-3 rounded-md flex sm:flex-row flex-col justify-between relative overflow-hidden gap-2 w-[calc(100%-2rem)]"
      }
    >
      <div className={"relative w-1/2 font-bold flex flex-col"}>
        <div className={"flex gap-2 items-center"}>
          <span className={"text-lg text-gray-700 "}>Term</span>
          <SoundButton audioPath={translation.term_audio} />
        </div>
        <div className={"flex gap-2 items-center"}>
          <span className={"text-2xl text-white"}>{translation.term}</span>
          <span className={"text-lg text-gray-100"}>
            {translation.term_phonetic}
          </span>
        </div>
      </div>
      <div className={"relative w-1/2 font-bold flex flex-col"}>
        <div className={"flex gap-2 items-center"}>
          <span className={"text-lg text-gray-700 "}>Definition</span>
          <SoundButton
            className={"text-lg"}
            audioPath={translation.definition_audio}
          />
        </div>
        <div className={"flex gap-2 items-center"}>
          <span className={"text-2xl text-white"}>
            {translation.definition}
          </span>
          <span className={"text-lg text-gray-100"}>
            {translation.definition_phonetic}
          </span>
        </div>
      </div>
      {permissions.canEdit && (
        <div
          className={
            "sm:flex sm:self-start sm:gap-2 absolute space-x-2 top-3 right-3 text-2xl items-center"
          }
        >
          <EditButton
            onClick={() => {
              handleSetChosenTranslation({
                translationIndex: translation.id,
                groupIndex: groupIndex,
              });
              MicroModal.show("modal-edit-translation");
            }}
            className={"text-gray-100"}
          />
          <button>
            {parseInt(translation.is_favourite) ? (
              <FontAwesomeIcon icon={faStar} className={"text-amber-500"} />
            ) : (
              <FontAwesomeIcon icon={faStar} className={"text-gray-100"} />
            )}
          </button>
        </div>
      )}
      <div
        className={
          "absolute w-1 h-[20rem] transform rotate-45 bg-gray-100 right-[-2.5rem] bottom-[-6rem]"
        }
      ></div>
      <div
        className={
          "absolute w-1 h-[20rem] transform rotate-45 bg-gray-100 right-[-1rem] bottom-[-6rem]"
        }
      ></div>
    </form>
  );
};