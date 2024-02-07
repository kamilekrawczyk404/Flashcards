import InputError from "@/Components/Form/InputError.jsx";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/Form/TextInput.jsx";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import InputLabel from "@/Components/Form/InputLabel.jsx";
import { useEffect, useRef, useState } from "react";
import { SocialsPopUp } from "@/Components/UserEdit/SocialsPopUp.jsx";
import MicroModal from "micromodal";
import { SocialButton } from "@/Components/UserEdit/SocialButton.jsx";

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = "",
}) {
    const user = usePage().props.auth.user;

    const [isDeleting, setIsDeleting] = useState(false);

    const [avatarErrors, setAvatarErrors] = useState({
        size: { value: false, message: "The file size must be lower than 2MB" },
        fileType: {
            value: false,
            message: "The file type must be .png or .jpg",
        },
    });

    const socialMedias = [
        { name: "instagram", color: "purple-500" },
        { name: "facebook", color: "blue-700" },
        { name: "twitter", color: "blue-500" },
        { name: "snapchat", color: "yellow-200" },
    ];

    const { data, setData, errors, patch, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            avatar: user.avatar,
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route("profile.update"));
    };

    const deleteSocial = (e, socialMediaName) => {
        e.preventDefault();

        router.patch(
            "/profile/delete-social",
            { name: socialMediaName },
            {
                preserveScroll: true,
                preserveState: false,
                onProgress: () => setIsDeleting(true),
                onFinish: () => setIsDeleting(false),
            },
        );
    };

    const setNewAvatar = (file) => {
        const maxSize = 1024 * 1024 * 2; // 2MB

        if (
            file.size < maxSize &&
            (file.type === "image/png" || file.type === "image/jpg")
        ) {
            setAvatarErrors((prev) => ({
                fileType: { ...prev.fileType, value: false },
                size: { ...prev.fileType, value: false },
            }));
            let image = URL.createObjectURL(file);
            setData("avatar", image);
        } else if (file.size > maxSize) {
            setAvatarErrors((prev) => ({
                ...prev,
                size: { ...prev.size, value: true },
            }));
        } else {
            setAvatarErrors((prev) => ({
                ...prev,
                fileType: { ...prev.fileType, value: true },
            }));
        }
    };

    let fileInputRef = useRef();
    let avatarRef = useRef();

    useEffect(() => {
        if (fileInputRef.current.files.length > 0) {
            setNewAvatar(fileInputRef.current.files[0]);
        }
    }, [fileInputRef.current?.files]);

    return (
        <>
            <section className={"space-y-8"}>
                <header>
                    <h2 className="text-lg font-medium text-indigo-500">
                        Profile Information
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                        Update your account's profile information.
                    </p>
                </header>

                <form onSubmit={submit} className="relative space-y-4">
                    <div
                        className={
                            "relative flex md:flex-row flex-col-reverse md:w-2/3 w-full gap-2 justify-between"
                        }
                    >
                        <div
                            className={
                                "flex flex-col md:w-1/2 w-full gap-2 justify-between"
                            }
                        >
                            <div className={"flex flex-col"}>
                                <InputLabel
                                    htmlFor="name"
                                    value="Name"
                                    className={"text-gray-700"}
                                />

                                <TextInput
                                    id="name"
                                    className="mt-1 block"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    required
                                    isFocused
                                    autoComplete="name"
                                />

                                <InputError
                                    className="my-2"
                                    message={errors.name}
                                />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="email"
                                    value="Email"
                                    className={"text-gray-700"}
                                />

                                <TextInput
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    required
                                    autoComplete="username"
                                />

                                <InputError
                                    className="my-2"
                                    message={errors.email}
                                />
                            </div>

                            {mustVerifyEmail &&
                                user.email_verified_at === null && (
                                    <div>
                                        <p className="text-sm mt-2 text-gray-800">
                                            Your email address is unverified.
                                            <Link
                                                href={route(
                                                    "verification.send",
                                                )}
                                                method="post"
                                                as="button"
                                                className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                Click here to re-send the
                                                verification email.
                                            </Link>
                                        </p>

                                        {status ===
                                            "verification-link-sent" && (
                                            <div className="mt-2 font-medium text-sm text-green-600">
                                                A new verification link has been
                                                sent to your email address.
                                            </div>
                                        )}
                                    </div>
                                )}

                            <div>
                                <InputLabel
                                    htmlFor="socials"
                                    value="Socials"
                                    className={"text-gray-700"}
                                />

                                <div className={"flex mt-1 items-center gap-2"}>
                                    <button
                                        type={"button"}
                                        className={
                                            "bg-gray-200 border-[.175rem] border-dashed border-indigo-500 aspect-square h-10 rounded-md transition hover:bg-gray-300 flex items-center justify-center"
                                        }
                                        onClick={() => {
                                            MicroModal.show("socials");
                                        }}
                                    >
                                        <i className="fa-solid fa-plus text-xl text-gray-500"></i>
                                    </button>

                                    {Object.entries(
                                        user.social_media_links,
                                    ).map(([key, value]) => {
                                        if (typeof value === "string") {
                                            return (
                                                <SocialButton
                                                    usedInForm={false}
                                                    element={socialMedias.find(
                                                        (element) =>
                                                            element.name ===
                                                            key,
                                                    )}
                                                    handleDeleteSocial={
                                                        deleteSocial
                                                    }
                                                    isDeleting={isDeleting}
                                                />
                                            );
                                        }
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className={"mx-auto"}>
                            <InputLabel
                                value={"Picture"}
                                className={"text-gray-700"}
                            />

                            <input
                                ref={(element) =>
                                    (fileInputRef.current = element)
                                }
                                type="file"
                                onChange={() => setNewAvatar()}
                                className={"hidden"}
                            />

                            <div
                                className={
                                    "relative border-4 border-indigo-500 rounded-full shadow-lg w-fit"
                                }
                            >
                                <button
                                    onClick={() => {
                                        fileInputRef.current.click();
                                    }}
                                    type={"button"}
                                    className={
                                        "transition cursor-pointer hover:bg-indigo-600 absolute flex items-center justify-center w-10 aspect-square bottom-1 right-1 bg-indigo-500 rounded-full"
                                    }
                                >
                                    <i className="fa-solid fa-camera text-gray-100 text-md"></i>
                                </button>
                                <img
                                    ref={(element) =>
                                        (avatarRef.current = element)
                                    }
                                    src={data.avatar}
                                    className={
                                        "rounded-full w-[12rem] aspect-square "
                                    }
                                    alt=""
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        {Object.values(avatarErrors).map(
                            (element, index) =>
                                element.value && (
                                    <InputError
                                        className="mt-2"
                                        message={element.message}
                                    />
                                ),
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        <PrimaryButton
                            className={"bg-indigo-500 hover:bg-indigo-600"}
                            disabled={processing}
                        >
                            Save
                        </PrimaryButton>

                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <p className="text-sm text-gray-600">Saved.</p>
                        </Transition>
                    </div>
                </form>
            </section>
            <SocialsPopUp
                userSocialMedias={user.social_media_links}
                modalId={"socials"}
                header={"Social media"}
                socialMedias={socialMedias}
            />
        </>
    );
}