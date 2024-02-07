import InputError from "@/Components/Form/InputError.jsx";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/Form/TextInput.jsx";
import { Head, useForm } from "@inertiajs/react";
import { SectionWithVerticalMargin } from "@/Components/SectionWithVerticalMargin.jsx";
import Unauthenticated from "@/Layouts/UnauthenticatedLayout.jsx";
import { GradientAndLines } from "@/Components/GradientAndLines.jsx";
import { MainButton } from "@/Components/MainButton.jsx";
import { useLayoutEffect, useRef } from "react";
import Animation from "@/Pages/Animation.js";

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    let componentRef = useRef();

    const submit = (e) => {
        e.preventDefault();

        post(route("password.email"));
    };

    useLayoutEffect(() => {
        let animation = new Animation([componentRef.current]);
        animation.animateAll("", "");
    }, []);

    return (
        <Unauthenticated fullScreen={true}>
            <SectionWithVerticalMargin
                className={"flex items-center justify-center"}
            >
                <Head title="Forgot Password" />

                <GradientAndLines
                    ref={(element) => (componentRef.current = element)}
                    linesColor={
                        "bg-gray-100 xl:w-1/3 md:w-1/2 w-full space-y-12 translate-y-12 opacity-0 polygon-start"
                    }
                    hasLines={true}
                    className={"p-8"}
                >
                    <div className="mb-4 text-md text-gray-100">
                        <span className={"text-lg font-bold"}>
                            Forgot your password?
                        </span>{" "}
                        No problem. Just let us know your email address and we
                        will email you a password reset link that will allow you
                        to choose a new one.
                    </div>

                    {status && (
                        <div className="mb-4 font-medium text-sm text-green-600">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit}>
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            isFocused={true}
                            onChange={(e) => setData("email", e.target.value)}
                        />

                        <InputError message={errors.email} className="mt-2" />

                        <div className="flex items-center mt-4">
                            <MainButton
                                className="bg-white hover:bg-gray-300 text-indigo-500"
                                disabled={processing}
                            >
                                Email Password Reset Link
                            </MainButton>
                        </div>
                    </form>
                </GradientAndLines>
            </SectionWithVerticalMargin>
        </Unauthenticated>
    );
}