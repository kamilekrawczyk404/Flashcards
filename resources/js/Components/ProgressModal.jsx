import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usePage } from "@inertiajs/react";

export const ProgressModal = ({
  inProgress = false,
  errors = {},
  text = "",
}) => {
  // Progress bar based on progress from CreateInertiaApp

  console.log(errors);
  return (
    <>
      {Object.values(errors).every(
        (value) => Object.keys(value).length === 0,
      ) &&
        inProgress && (
          <div
            className={
              "absolute top-0 left-0 w-full h-screen bg-gray-100 z-[200]"
            }
          >
            <div
              className={
                "absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center bg-amber-500 p-4 rounded-md"
              }
            >
              <FontAwesomeIcon
                icon="fa-solid fa-hourglass-start"
                className={"animate-hourglass text-2xl mr-4 text-gray-700"}
              />
              <p className={"text-2xl text-gray-700"}>
                <span className={"font-bold"}>Wait a second</span>. {text}
              </p>
            </div>
          </div>
        )}
    </>
  );
};