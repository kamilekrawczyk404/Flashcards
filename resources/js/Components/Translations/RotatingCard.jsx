import { SoundButton } from "@/Components/Translations/SoundButton.jsx";
import { EditButton } from "@/Components/EditButton.jsx";
import MicroModal from "micromodal";
import React from "react";
import { Phonetics } from "@/Components/Translations/Phonetics.jsx";

export const RotatingCard = ({
    permissions,
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
            <div className={"absolute top-2 right-2 flex gap-3 z-30"}>
                {translation.type === "term" ? (
                    <SoundButton audioPath={translation.term.audioPath} />
                ) : (
                    <SoundButton audioPath={translation.definition.audioPath} />
                )}

                {permissions.canEdit && (
                    <EditButton
                        onClick={(e) => {
                            e.stopPropagation();

                            handleSetEditing(true);
                            MicroModal.show("modal-1");
                        }}
                    />
                )}
            </div>
            <div className={"flex flex-col items-center [&:has(span)]:mt-4"}>
                {translation.type === "term" ? (
                    <>
                        {translation.term.word}
                        <Phonetics text={translation.term.phonetics} />
                    </>
                ) : (
                    <>
                        {translation.definition.word}
                        <Phonetics text={translation.definition.phonetics} />
                    </>
                )}
                {children}
            </div>
        </div>
    );
};