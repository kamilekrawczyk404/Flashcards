import React, { forwardRef } from "react";
import TextInput from "@/Components/Form/TextInput.jsx";
import InputLabel from "@/Components/Form/InputLabel.jsx";
import { GradientAndLines } from "@/Components/GradientAndLines.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export const TranslationForm = forwardRef(
    (
        {
            index,
            handleIsDeletedAnyTranslation = () => {},
            handleDeleteTranslation,
            termRegister,
            definitionRegister,
            title,
            translationId,
            handleRemovingAnimation,
        },
        ref,
    ) => {
        return (
            <GradientAndLines
                className="p-4 polygon-start opacity-0 translate-y-12"
                ref={ref}
                hasLines={true}
                linesColor={"bg-gray-100"}
            >
                <div className="flex justify-between">
                    <span className="font-semibold text-lg text-indigo-500 p-2 rounded-sm shadow-lg bg-gray-100">
                        #{index + 1}
                    </span>
                    {index > 1 && (
                        <button
                            className={
                                "flex items-center justify-center bg-gray-100 p-2 rounded-sm shadow-lg"
                            }
                            type={"button"}
                            onClick={() => {
                                handleRemovingAnimation(index);

                                setTimeout(() => {
                                    handleIsDeletedAnyTranslation(true);
                                    handleDeleteTranslation(
                                        translationId,
                                        title,
                                        index,
                                    );
                                }, 800);
                            }}
                        >
                            <FontAwesomeIcon icon="fa-solid fa-trash" className={'hover:text-red-500 transition text-gray-700 text-lg'}/>
                        </button>
                    )}
                </div>
                <div className="flex flex-col md:flex-row gap-4 mt-4">
                    <div className="md:w-1/2 shadow-lg">
                        <InputLabel
                            className={"text-white font-bold text-md"}
                            value={"Term"}
                        />
                        <TextInput
                            {...termRegister}
                            placeholder="Term"
                            className="w-full z-10"
                        />
                    </div>
                    <div className="md:w-1/2 shadow-lg">
                        <InputLabel
                            className={"text-white"}
                            value={"Definition"}
                        />
                        <TextInput
                            {...definitionRegister}
                            placeholder="Definition"
                            className="w-full z-10"
                        />
                    </div>
                </div>
            </GradientAndLines>
        );
    },
);