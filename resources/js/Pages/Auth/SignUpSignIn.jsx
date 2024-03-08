import { Link } from "@inertiajs/react";
import { MainButton } from "@/Components/Buttons/MainButton.jsx";

export const SignUpSignIn = ({ className, isInNav = true }) => {
  return (
    <div
      className={
        "items-center justify-center " +
        (isInNav ? "sm:flex hidden gap-4 " : "flex ") +
        className
      }
    >
      <Link
        href={route("login")}
        className={
          "border-2 p-2 rounded-md tracking-widest border-indigo-500 font-bold text-indigo-500 sm:w-fit w-full"
        }
      >
        Sign in
      </Link>
      <MainButton
        isRedirect={true}
        href={route("register")}
        value={"Sign in"}
        className={
          "bg-indigo-500 hover:bg-indigo-600 text-white sm:w-fit w-full"
        }
      >
        Sign up
      </MainButton>
    </div>
  );
};