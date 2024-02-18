import { SoundButton } from "@/Components/Translations/SoundButton.jsx";
import { EditButton } from "@/Components/EditButton.jsx";
import MicroModal from "micromodal";
import React from "react";
import { Phonetics } from "@/Components/Translations/Phonetics.jsx";

export const RotatingCard = ({
  className = "",
  isFront = false,
  handleSetEditing,
  translation,
  children,
  ...props
}) => {
  return (
    <div
      {...props}
      className={
        "text-center w-full h-full absolute flex justify-center items-center " +
        (isFront ? "front rotate-x-180 " : "back " + className)
      }
    >
      <div
        className={
          "absolute top-0 px-2 flex justify-between items-center gap-3 z-100 w-full"
        }
      >
        <p className={"text-lg"}>Group: {translation.group_name}</p>
        <div className={"space-x-3"}>
          {translation.type === "term" ? (
            <SoundButton audioPath={translation.term_audio} />
          ) : (
            <SoundButton audioPath={translation.definition_audio} />
          )}
        </div>
      </div>
      <div className={"flex flex-col items-center [&:has(span)]:mt-4"}>
        {translation.type === "term" ? (
          <>
            {translation.term}
            <Phonetics text={translation.term_phonetic} />
          </>
        ) : (
          <>
            {translation.definition}
            <Phonetics text={translation.definition_phonetic} />
          </>
        )}
        {children}
      </div>
    </div>
  );
};