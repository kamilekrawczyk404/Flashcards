import { CancelButton } from "@/Components/Modals/CancelButton.jsx";
import MicroModal from "micromodal";
import TextInput from "@/Components/Form/TextInput.jsx";
import InputLabel from "@/Components/Form/InputLabel.jsx";
import PrimaryButton from "@/Components/Buttons/PrimaryButton.jsx";
import React, { useContext, useState } from "react";
import { useForm } from "@inertiajs/react";
import { SocialButton } from "@/Components/Buttons/SocialButton.jsx";
import InputError from "@/Components/Form/InputError.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ModalLayout } from "@/Components/Modals/ModalLayout.jsx";
import { ThemeContext } from "@/ThemeContext.jsx";

export const SocialsPopUp = ({
  modalId,
  header,
  userSocialMedias,
  socialMediasProps,
}) => {
  const { properties } = useContext(ThemeContext);
  const [activeSocial, setActiveSocial] = useState(socialMediasProps[0].name);

  const regexExpressions = {
    instagram: /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/,
    facebook:
      /(?:https?:\/\/)?(?:www\.)?(mbasic.facebook|m\.facebook|facebook|fb)\.(com|me)\/(?:(?:\w\.)*#!\/)?(?:pages\/)?(?:[\w\-\.]*\/)*([\w\-\.]*)/,
    twitter: /(?<=^|(?<=[^a-zA-Z0-9-_\.]))@([A-Za-z]+[A-Za-z0-9-_]+)/g,
    snapchat: /^(?=\S{3,15}$)[a-zA-Z][a-zA-Z0-9]*(?:[_.-][a-zA-Z0-9]+)?$/,
  };

  const [isMatching, setIsMatching] = useState({
    instagram: true,
    facebook: true,
    twitter: true,
    snapchat: true,
  });

  const { data, setData, patch, processing } = useForm({
    instagram: userSocialMedias.instagram,
    facebook: userSocialMedias.facebook,
    twitter: userSocialMedias.twitter,
    snapchat: userSocialMedias.snapchat,
  });

  const validate = (value, socialMediaName, index) => {
    if (!value.length) {
      setIsMatching((prev) => ({
        ...prev,
        [socialMediaName]: true,
      }));
      return;
    }

    setIsMatching((prev) => ({
      ...prev,
      [socialMediaName]: Object.values(regexExpressions).at(index).test(value),
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
    <ModalLayout modalId={modalId}>
      <header className="flex justify-between items-center">
        <h2 className="font-bold text-2xl text-indigo-500">{header}</h2>
        <CancelButton
          isModal={true}
          modalId={modalId}
          className={"modal__close"}
          onClick={(e) => {
            e.preventDefault();
            MicroModal.close(modalId);
          }}
        />
      </header>
      <form
        onSubmit={submit}
        className={`${properties.background} p-4 rounded-md shadow-md space-y-4 w-full relative`}
      >
        <div
          className={`${properties.container} space-x-4 p-4 shadow-md rounded-md w-fit z-0`}
        >
          {socialMediasProps.map((element, index) => (
            <SocialButton
              usedInForm={true}
              key={index}
              handleSetActiveSocial={setActiveSocial}
              activeSocial={activeSocial}
              element={element}
            />
          ))}
        </div>
        {socialMediasProps.map(
          (element, index) =>
            activeSocial === element.name && (
              <div
                key={index}
                className={`${properties.container} p-4 shadow-md rounded-md space-y-4 relative w-full`}
              >
                <InputLabel
                  className={"block"}
                  value={
                    element.name.at(0).toUpperCase() + element.name.substring(1)
                  }
                  htmlFor={element.name}
                />
                <div className={"relative flex items-center w-full"}>
                  <FontAwesomeIcon
                    icon={element.icon}
                    className={`aspect-square h-[3.5rem] mr-4 ${element.color}`}
                  />
                  <TextInput
                    id={element.name}
                    value={Object.values(data).at(index) ?? ""}
                    onChange={(e) => {
                      setData(element.name, e.target.value);
                      validate(e.target.value, element.name, index);
                    }}
                    isFocused
                  />
                </div>
                {!Object.values(isMatching).at(index) && (
                  <InputError message={"Please enter a valid data"} />
                )}
              </div>
            ),
        )}
        <PrimaryButton
          disabled={processing}
          className={"bg-indigo-500 hover:bg-indigo-600 mt-2"}
          onClick={() => {
            isValidatedBeforeSubmitting() && MicroModal.close(modalId);
          }}
        >
          Save
        </PrimaryButton>
      </form>
    </ModalLayout>
  );
};