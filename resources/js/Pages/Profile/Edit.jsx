import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import { Head } from "@inertiajs/react";
import { useLayoutEffect, useRef } from "react";
import Animation from "@/Pages/Animation.js";
import UpdateProfileInformation from "@/Pages/Profile/Partials/UpdateProfileInformationForm.jsx";
import { SocialsPopUp } from "@/Components/Modals/SocialsPopUp.jsx";
import {
  faSquareFacebook,
  faSquareInstagram,
  faSquareSnapchat,
  faSquareXTwitter,
} from "@fortawesome/free-brands-svg-icons";

export default function Edit({
  auth,
  mustVerifyEmail,
  status,
  userSocialMedias,
}) {
  const linesStyle =
    "relative before:absolute before:-right-[13rem] before:bottom-0 before:bg-indigo-500 before:w-1/2 before:h-1 before:transform before:-rotate-45 after:absolute after:-right-[15rem] after:bottom-0 after:bg-indigo-500 after:w-1/2 after:h-1 after:transform after:-rotate-45 overflow-hidden";

  const refs = useRef([]);

  const socialMediasProps = [
    { name: "instagram", color: "text-purple-500", icon: faSquareInstagram },
    { name: "facebook", color: "text-blue-700", icon: faSquareFacebook },
    { name: "twitter", color: "text-gray-900", icon: faSquareXTwitter },
    { name: "snapchat", color: "text-amber-400", icon: faSquareSnapchat },
  ];

  useLayoutEffect(() => {
    let animation = new Animation(refs.current);
    animation.animateAll("<-.1", "", "<+.1");
  }, []);

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-indigo-500 leading-tight relative ">
          Profile
        </h2>
      }
    >
      <Head title="Profile" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          <div
            ref={(element) => (refs.current[0] = element)}
            className={
              "p-4 sm:p-8 bg-white shadow sm:rounded-lg opacity-0 polygon-start translate-y-12 " +
              linesStyle
            }
          >
            <UpdateProfileInformation
              mustVerifyEmail={mustVerifyEmail}
              status={status}
              socialMediasProps={socialMediasProps}
              userSocialMedias={userSocialMedias}
            />
          </div>
          <div
            ref={(element) => (refs.current[1] = element)}
            className={
              "p-4 sm:p-8 bg-white shadow sm:rounded-lg polygon-start translate-y-12 opacity-0 " +
              linesStyle
            }
          >
            <UpdatePasswordForm className="max-w-xl" />
          </div>

          <div
            ref={(element) => (refs.current[2] = element)}
            className={
              "p-4 sm:p-8 bg-white shadow sm:rounded-lg polygon-start translate-y-12 opacity-0 " +
              linesStyle
            }
          >
            <DeleteUserForm className="max-w-xl" />
          </div>
        </div>
      </div>
      <SocialsPopUp
        socialMediasProps={socialMediasProps}
        userSocialMedias={userSocialMedias}
        modalId={"socials"}
        header={"Social media"}
      />
    </AuthenticatedLayout>
  );
}