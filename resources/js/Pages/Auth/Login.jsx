import { useEffect, useLayoutEffect, useRef } from "react";
import InputError from "@/Components/Form/InputError.jsx";
import TextInput from "@/Components/Form/TextInput.jsx";
import { Head, Link, useForm } from "@inertiajs/react";
import InputLabel from "@/Components/Form/InputLabel.jsx";
import { SectionWithVerticalMargin } from "@/Components/SectionWithVerticalMargin.jsx";
import Unauthenticated from "@/Layouts/UnauthenticatedLayout.jsx";
import { ApplicationLogo } from "@/Layouts/Partials/ApplicationLogo.jsx";
import { GradientAndLines } from "@/Components/GradientAndLines.jsx";
import Animation from "@/Pages/Animation.js";
import { MainButton } from "@/Components/Buttons/MainButton.jsx";
import { AnimatedCheckbox } from "@/Components/Form/AnimatedCheckbox.jsx";

export default function Login({ status, canResetPassword }) {
  let formRef = useRef();
  let logoRef = useRef();

  const { data, setData, post, processing, errors, reset } = useForm({
    email: "",
    password: "",
    remember: false,
  });

  useEffect(() => {
    return () => {
      reset("password");
    };
  }, []);

  const submit = (e) => {
    e.preventDefault();

    post(route("login"));
  };

  useLayoutEffect(() => {
    let animation = new Animation([logoRef.current, formRef.current]);
    animation.animateAll("", "", "<+.1");
  }, []);

  return (
    <Unauthenticated fullScreen={true}>
      <SectionWithVerticalMargin
        className={"flex items-center justify-center flex-col md:gap-8 gap-4"}
      >
        <Head title="Log in" />

        {status && (
          <div className="mb-4 font-medium text-sm text-green-600">
            {status}
          </div>
        )}

        <InputError
          className={"shadow-none font-normal mt-4"}
          message={
            <div className={"flex flex-col gap-1"}>
              <h2 className={"font-semibold text-2xl"}>
                Default user credentials
              </h2>
              <p>
                login: <span>user@gmail.com</span>
              </p>
              <p>
                pass: <span>flashcards</span>
              </p>
            </div>
          }
        />

        <GradientAndLines
          ref={formRef}
          className={
            "relative 2xl:w-1/4 lg:w-1/3 md:w-2/3 w-full p-4 translate-y-12 opacity-0 polygon-start"
          }
          hasLines={true}
          linesColor={"bg-gray-100"}
          from={"from-indigo-600"}
          to={"to-indigo-400"}
        >
          <p className={"text-white text-2xl font-bold mb-4"}>Login</p>

          <form onSubmit={submit}>
            <div>
              <InputLabel htmlFor="email" value="Email" />

              <TextInput
                id="email"
                type="email"
                name="email"
                value={data.email}
                className="mt-1 block w-full"
                autoComplete="username"
                isFocused={true}
                onChange={(e) => setData("email", e.target.value)}
              />

              <InputError message={errors.email} className="mt-2" />
            </div>

            <div className="mt-4">
              <InputLabel htmlFor="password" value="Password" />

              <TextInput
                id="password"
                type="password"
                name="password"
                value={data.password}
                className="mt-1 block w-full"
                autoComplete="current-password"
                onChange={(e) => setData("password", e.target.value)}
              />

              <InputError message={errors.password} className="mt-2" />
            </div>

            <div className="block mt-4">
              <label className="flex items-center">
                <AnimatedCheckbox
                  name={"remember"}
                  checked={data.remember}
                  onChange={(e) => setData("remember", e.target.checked)}
                />
                <span className="ml-2 text-sm text-white">Remember me</span>
              </label>
            </div>

            <div className="flex md:flex-row flex-col-reverse gap-4 items-center mt-12 space-x-2">
              <MainButton
                className="bg-white hover:bg-gray-300 text-indigo-500 md:w-fit w-full"
                disabled={processing}
              >
                Log in
              </MainButton>
              {canResetPassword && (
                <Link
                  href={route("password.request")}
                  className="underline text-sm text-gray-100 hover:text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Forgot your password?
                </Link>
              )}
            </div>
          </form>
        </GradientAndLines>
      </SectionWithVerticalMargin>
    </Unauthenticated>
  );
}