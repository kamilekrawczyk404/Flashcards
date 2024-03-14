import { SignUpSignIn } from "@/Pages/Auth/SignUpSignIn.jsx";
import { ApplicationLogo } from "@/Layouts/Partials/ApplicationLogo.jsx";
import { ThemeContext, ThemeProvider } from "@/ThemeContext.jsx";
import { useContext } from "react";
import { AnimatedCheckbox } from "@/Components/Form/AnimatedCheckbox.jsx";

export default function Unauthenticated({
  header,
  fullScreen = false,
  children,
}) {
  const { properties } = useContext(ThemeContext);

  return (
    <div
      className={
        properties.background +
        (fullScreen ? " sm:h-screen h-auto overflow-hidden " : "")
      }
    >
      <nav className={properties.container + " border-b border-gray-100"}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex relative justify-between items-center h-16">
            <ApplicationLogo className={"text-4xl"} />
            <SignUpSignIn />
          </div>
        </div>
      </nav>

      {header && (
        <header className={properties.container + " shadow"}>
          <div className="max-w-7xl mx-auto h-10 px-4 sm:px-6 lg:px-8 flex justify-between items-center text-indigo-500 font-bold text-2xl">
            {header}
          </div>
        </header>
      )}

      <main>{children}</main>
    </div>
  );
}