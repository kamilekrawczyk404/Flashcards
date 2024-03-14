import React, {
  forwardRef,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Animation from "@/Pages/Animation.js";
import { MainButton } from "@/Components/Buttons/MainButton.jsx";
import { SingleSet } from "@/Pages/Flashcards/Partials/SingleSet.jsx";
import { GoBackIndicator } from "@/Pages/Flashcards/Partials/GoBackIndicator.jsx";
import { SuccessModal } from "@/Components/Modals/SuccessModal.jsx";
import { usePage } from "@inertiajs/react";
import { useGetUserSets } from "@/useGetUserSets.js";
import { ProgressModal } from "@/Components/Loading/ProgressModal.jsx";
import { EmptyImage } from "@/Images/EmptyImage.jsx";
import { ThemeContext } from "@/ThemeContext.jsx";

export const AllSets = forwardRef(
  (
    { handleAnimateToLeft, hasMovedToAllSets, handleHasMovedToAllSets },
    ref,
  ) => {
    const { properties } = useContext(ThemeContext);
    const feedback = usePage().props?.feedback;
    const auth = usePage().props.auth;
    const { loading, sets } = useGetUserSets(auth.user.id);
    let refs = useRef([]);

    useLayoutEffect(() => {
      if (sets.length) {
        let animation = new Animation(refs.current);
        animation.animateAll("-.3", "", "");
      } else {
        let animation = new Animation([refs.current]);
        animation.animateAll("", "", "");
      }
    }, [sets]);

    return (
      <>
        <div
          className={
            "w-full h-full absolute left-[-100%] opacity-0 flex items-center justify-center "
          }
          ref={ref}
        >
          {!sets.length ? (
            <div
              ref={(element) => {
                refs.current[0] = element;
              }}
              className={`${properties.container} rounded-md flex flex-col items-center gap-2 p-4 polygon-start translate-y-12 opacity-0 sm:w-1/2 w-full`}
            >
              <EmptyImage className={"w-full"} />
              <p className={properties.text}>
                It looks like you don't any sets.
              </p>
              <MainButton
                isRedirect={true}
                href={route("flashcards.storeNewSet")}
                className={"bg-indigo-500 hover:bg-indigo-600 text-gray-100"}
              >
                Create your first set
              </MainButton>
            </div>
          ) : (
            <>
              <div
                className={
                  "w-full flex items-center flex-col gap-y-4 relative mt-4 rounded-md overflow-y-scroll h-[70vh]"
                }
              >
                {sets.map((set, index) => (
                  <SingleSet
                    key={index}
                    ref={(e) => (refs.current[index] = e)}
                    set={set}
                    index={index}
                    className={"opacity-0 translate-y-6 polygon-start"}
                  />
                ))}
              </div>
              <MainButton
                isRedirect={true}
                href={route("flashcards.showNewSet")}
                className={
                  "absolute bottom-12 left-1/2 -translate-x-1/2 bg-indigo-500 hover:bg-indigo-600 text-gray-100"
                }
              >
                Create a new set
              </MainButton>
            </>
          )}

          <GoBackIndicator
            handleAnimate={handleAnimateToLeft}
            onMoved={() => handleHasMovedToAllSets((prev) => !prev)}
          />
          <ProgressModal
            inProgress={loading}
            text={"We're searching for your sets."}
          />
        </div>

        <SuccessModal feedback={feedback} />
      </>
    );
  },
);