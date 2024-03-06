import { Link } from "@inertiajs/react";
import { MainButton } from "@/Components/Buttons/MainButton.jsx";

export const SignUpSignIn = ({ className }) => {
  return (
    <div className={"flex items-center gap-4 justify-center " + className}>
      <Link
        href={route("login")}
        className={
          "border-2 p-2 rounded-md tracking-widest border-indigo-500 font-bold text-indigo-500"
        }
      >
        Sign in
      </Link>
      <MainButton
        isRedirect={true}
        href={route("register")}
        value={"Sign in"}
        className={"bg-indigo-500 hover:bg-indigo-600 text-white"}
      >
        Sign up
      </MainButton>
    </div>
  );
};