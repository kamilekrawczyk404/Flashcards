import { CancelButton } from "@/Components/CancelButton.jsx";
import MicroModal from "micromodal";
import TextInput from "@/Components/Form/TextInput.jsx";
import InputLabel from "@/Components/Form/InputLabel.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import { SocialButton } from "@/Components/UserEdit/SocialButton.jsx";
import InputError from "@/Components/Form/InputError.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export const SocialsPopUp = ({
    modalId,
    header,
    userSocialMedias,
    socialMedias,
}) => {
    const [activeSocial, setActiveSocial] = useState(socialMedias[0].name);

    const regexExpressions = {
        instagram: /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/,
        facebook:
            /(?:https?:\/\/)?(?:www\.)?(mbasic.facebook|m\.facebook|facebook|fb)\.(com|me)\/(?:(?:\w\.)*#!\/)?(?:pages\/)?(?:[\w\-\.]*\/)*([\w\-\.]*)/,
        x: /(?<=^|(?<=[^a-zA-Z0-9-_\.]))@([A-Za-z]+[A-Za-z0-9-_]+)/g,
        snapchat: /^(?=\S{3,15}$)[a-zA-Z][a-zA-Z0-9]*(?:[_.-][a-zA-Z0-9]+)?$/,
    };

    const [isMatching, setIsMatching] = useState({
        instagram: true,
        facebook: true,
        x: true,
        snapchat: true,
    });

    const { data, setData, setDefaults, reset, patch, errors, processing } =
        useForm({
            instagram: userSocialMedias.instagram,
            facebook: userSocialMedias.facebook,
            x: userSocialMedias.x,
            snapchat: userSocialMedias.snapchat,
        });

    const validate = (value, socialMediaName, index) => {
        if (value.length === 0) {
            setIsMatching((prev) => ({
                ...prev,
                [socialMediaName]: true,
            }));
            return;
        }

        setIsMatching((prev) => ({
            ...prev,
            [socialMediaName]: Object.values(regexExpressions)
                .at(index)
                .test(value),
        }));
    };

    const isValidatedBeforeSubmitting = () => {
        return !Object.values(isMatching).some((isCorrect) => !isCorrect);
    };

    const submit = (e) => {
        e.preventDefault();

        if (isValidatedBeforeSubmitting())
            patch(route("profile.updateSocials"), {
                preserveScroll: true,
                preserveState: false,
            });
    };

    return (
        <div
            className="micromodal-slide modal m-10 absolute z-10"
            id={modalId}
            aria-hidden="true"
        >
            <div
                className="modal__overlay fixed top-0 left-0 right-0 bg-opacity-gray bottom-0 flex items-center justify-center"
                tabIndex="-1"
                data-micromodal-close={modalId}
            >
                <div
                    className="modal__container flex gap-6 flex-col bg-white lg:w-[76rem] w-full m-6 p-4 rounded-md overflow-y-auto border-b relative z-10"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-1-title"
                >
                    <header className="flex justify-between items-center">
                        <h2 className="font-bold text-2xl text-indigo-500">
                            {header}
                        </h2>
                        <CancelButton
                            isModal={true}
                            modalId={"modal-1"}
                            className={"modal__close"}
                            onClick={(e) => {
                                e.preventDefault();
                                MicroModal.close(modalId);
                            }}
                        />
                    </header>
                    <form
                        onSubmit={submit}
                        className={
                            "bg-gray-50 p-4 rounded-md shadow-md space-y-4 relative"
                        }
                    >
                        <div
                            className={
                                "space-x-4 p-4 bg-white shadow-md rounded-md w-fit z-0"
                            }
                        >
                            {socialMedias.map((element, index) => (
                                <SocialButton
                                    usedInForm={true}
                                    key={index}
                                    handleSetActiveSocial={setActiveSocial}
                                    activeSocial={activeSocial}
                                    element={element}
                                />
                            ))}
                        </div>
                        {socialMedias.map(
                            (element, index) =>
                                activeSocial === element.name && (
                                    <div
                                        key={index}
                                        className={
                                            "bg-white p-4 shadow-md rounded-md space-y-4"
                                        }
                                    >
                                        <InputLabel
                                            className={"block text-gray-700"}
                                            value={
                                                element.name
                                                    .at(0)
                                                    .toUpperCase() +
                                                element.name.substring(1)
                                            }
                                            htmlFor={element.name}
                                        />
                                        <div className={"flex items-center"}>

                                            <FontAwesomeIcon icon={`fa-brands ` + (element.name === 'x' ? "fa-square-x-twitter" : `fa-square-${element.name}`)} className={`aspect-square h-[3.5rem] mr-4 ${element.color}`} />
                                            <TextInput
                                                id={element.name}
                                                value={Object.values(data).at(
                                                    index ,
                                                ) ?? ""}
                                                className={"w-full"}
                                                onChange={(e) => {
                                                    setData(
                                                        element.name,
                                                        e.target.value,
                                                    );
                                                    validate(
                                                        e.target.value,
                                                        element.name,
                                                        index,
                                                    );
                                                }}
                                                isFocused
                                            />
                                        </div>
                                        {!Object.values(isMatching).at(
                                            index,
                                        ) && (
                                            <InputError
                                                message={
                                                    "Please enter a valid data"
                                                }
                                            />
                                        )}
                                    </div>
                                ),
                        )}

                        <PrimaryButton
                            disabled={processing}
                            className={"bg-indigo-500 hover:bg-indigo-600 mt-2"}
                            onClick={() => {
                                isValidatedBeforeSubmitting() &&
                                    MicroModal.close(modalId);
                            }}
                        >
                            Save
                        </PrimaryButton>
                    </form>
                </div>
            </div>
        </div>
    );
};