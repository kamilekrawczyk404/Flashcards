import { SignUpSignIn } from "@/Pages/Auth/SignUpSignIn.jsx";
import { ApplicationLogo } from "@/Layouts/Partials/ApplicationLogo.jsx";

export default function Unauthenticated({
  header,
  fullScreen = false,
  children,
}) {
  return (
    <div className={"bg-gray-100 " + (fullScreen && "sm:h-screen h-auto ")}>
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex relative justify-between items-center h-16">
            <ApplicationLogo className={"text-4xl"} />
            <SignUpSignIn />
          </div>
        </div>
      </nav>

      {header && (
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto h-10 px-4 sm:px-6 lg:px-8 flex justify-between items-center text-indigo-500 font-bold text-2xl">
            {header}
          </div>
        </header>
      )}

      <main>{children}</main>
    </div>
  );
}