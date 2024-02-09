import { SoundButton } from "@/Components/Translations/SoundButton.jsx";
import { EditButton } from "@/Components/EditButton.jsx";
import MicroModal from "micromodal";
import { router } from "@inertiajs/react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const Translation = ({
  permissions,
  translation,
  set,
  handleSetChosenIndex,
}) => {
  const submit = (e) => {
    e.preventDefault();

    router.put(
      `/set/${set.id}/setFavourite/${translation.id}/${set.title}`,
      !translation.isFavourite,
      { preserveScroll: true, preserveState: false },
    );
  };

  return (
    <form
      onSubmit={submit}
      className={
        "bg-gradient-to-tl from-indigo-600 to-indigo-400 p-3 rounded-md flex flex-col justify-between relative overflow-hidden gap-2"
      }
    >
      <div className={"relative font-bold flex flex-col"}>
        <div className={"flex gap-2"}>
          <span className={"text-lg text-gray-700 "}>Term</span>
          <SoundButton audioPath={translation.term.audioPath} />
        </div>
        <div className={"flex gap-2 items-center"}>
          <span className={"text-2xl text-white"}>{translation.term.word}</span>
          <span className={"text-lg text-gray-100"}>
            {translation.term.phonetics}
          </span>
        </div>
      </div>
      <div className={"relative font-bold flex flex-col"}>
        <div className={"flex gap-2 items-center"}>
          <span className={"text-lg text-gray-700 "}>Definition</span>
          <SoundButton
            className={"text-lg"}
            audioPath={translation.definition.audioPath}
          />
        </div>
        <div className={"flex gap-2 items-center"}>
          <span className={"text-2xl text-white"}>
            {translation.definition.word}
          </span>
          <span className={"text-lg text-gray-100"}>
            {translation.definition.phonetics}
          </span>
        </div>
      </div>
      <div
        className={
          "absolute w-1 h-[20rem] transform rotate-45 bg-gray-100 right-[-2rem] bottom-[-6rem]"
        }
      ></div>
      <div
        className={
          "absolute w-1 h-[20rem] transform rotate-45 bg-gray-100 right-0 bottom-[-6rem]"
        }
      ></div>
      {permissions.canEdit && (
        <div
          className={"absolute flex gap-2 top-3 right-3 text-2xl items-center"}
        >
          <EditButton
            onClick={() => {
              handleSetChosenIndex(translation.id - 1);
              MicroModal.show("modal-2");
            }}
            className={"text-gray-100"}
          />
          <button>
            {translation.isFavourite ? (
              <FontAwesomeIcon
                icon="fa-solid fa-star"
                className={"text-amber-500"}
              />
            ) : (
              <FontAwesomeIcon
                icon="fa-regular fa-star"
                className={"text-gray-100"}
              />
            )}
          </button>
        </div>
      )}
    </form>
  );
};