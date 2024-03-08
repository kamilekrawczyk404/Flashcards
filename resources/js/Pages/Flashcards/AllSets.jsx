import React, {
  forwardRef,
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

export const AllSets = forwardRef(
  (
    { handleAnimateToLeft, hasMovedToAllSets, handleHasMovedToAllSets },
    ref,
  ) => {
    const [sets, setSets] = useState([]);
    let refs = useRef([]);

    const feedback = usePage().props?.feedback;

    const auth = usePage().props.auth;

    // Fatch data async with all sets...
    useEffect(() => {
      fetch(`/get-user-sets/${auth.user.id}`)
        .then((response) => response.json())
        .then((data) => {
          setSets(data);
        })
        .catch((e) => console.log("There is a problem: ", e));
    }, [feedback]);

    useLayoutEffect(() => {
      if (sets.length) {
        let animation = new Animation(refs.current);
        animation.animateAll("", "", "");
      } else {
        let animation = new Animation([refs.current]);
        animation.animateAll("", "", "");
      }
    }, [sets]);

    return (
      <>
        <div
          className={
            "w-full absolute left-[-100%] opacity-0 flex items-center justify-center "
          }
          ref={ref}
        >
          {!sets.length ? (
            <div
              ref={(element) => {
                refs.current[0] = element;
              }}
              className="mt-10 max-w-[76rem] rounded-md mx-auto bg-white flex flex-col items-center gap-2 p-4 polygon-start translate-y-12 opacity-0"
            >
              <img
                className={"w-[35rem] bg-contain -m-10"}
                src="http://127.0.0.1:8000/storage/images/not_found.jpg"
                alt="not found sets"
              />
              <p className="text-gray-700">It looks like you don't any sets.</p>
              <MainButton
                isRedirect={true}
                href={route("flashcards.storeNewSet")}
                className={"bg-indigo-500 hover:bg-indigo-600 text-gray-100"}
              >
                Create your first set
              </MainButton>
            </div>
          ) : (
            <div
              className={"w-full flex items-center flex-col gap-4 relative "}
            >
              <div
                className={
                  "rounded-md overflow-y-scroll space-y-2 w-full h-[70vh] "
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
              <div className={""}>
                <MainButton
                  isRedirect={true}
                  href={route("flashcards.showNewSet")}
                  className={"bg-indigo-500 hover:bg-indigo-600 text-gray-100"}
                >
                  Create a new set
                </MainButton>
              </div>
            </div>
          )}
          <GoBackIndicator
            handleAnimate={handleAnimateToLeft}
            onMoved={() => handleHasMovedToAllSets((prev) => !prev)}
          />
        </div>
        <SuccessModal feedback={feedback} />
      </>
    );
  },
);