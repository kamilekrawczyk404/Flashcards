import { forwardRef, useEffect, useRef, useState } from "react";
import { Link, router } from "@inertiajs/react";
import Animation from "@/Pages/Animation.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ProgressBars } from "@/Pages/Flashcards/Partials/ProgressBars.jsx";

export const SingleSet = forwardRef(
  ({ auth, set, index, translationsCount, className, ...props }, ref) => {
    useEffect(() => {});
    const [cardActive, setCardActive] = useState(false);

    let editComponentRef = useRef();
    const animation = new Animation([editComponentRef.current], cardActive);

    const animate = () => {
      animation.slideToRight();
    };

    const deleteSet = (e, set_id) => {
      e.preventDefault();

      if (confirm("Are you sure to delete this set?"))
        router.delete(`/delete/set/${set_id}`);
    };

    return (
      <div
        ref={ref}
        className={
          "bg-gradient-to-br from-indigo-600 to-indigo-300 rounded-md relative lg:w-1/2 md:w-2/3 w-[82vw] transition  min-h-[10rem] flex justify-between items-center overflow-hidden mx-auto " +
          className
        }
      >
        <div className={"space-y-4 p-4"}>
          <Link
            className={
              "text-xl font-bold text-indigo-500 bg-gray-100 rounded-sm p-2"
            }
            href={route("flashcards.showSet", [set.id])}
          >
            {set.title.replaceAll("_", " ")}
          </Link>
          <div
            className={
              "text-gray-700 text-lg font-bold bg-gray-100 w-fit p-2 rounded-sm"
            }
          >
            {set.source_language}
            <FontAwesomeIcon
              icon="fa-solid fa-arrow-right"
              className={"mx-2"}
            />
            {set.target_language}

            <div className={"flex items-center gap-2"}>
              Translations count{" "}
              <span
                className={
                  "flex items-center text-base justify-center text-gray-700 bg-amber-500 p-1 rounded-full w-[2rem] aspect-square"
                }
              >
                {translationsCount}
              </span>
            </div>
          </div>
          {set?.progression && (
            <div className={"flex gap-2"}>
              {Object.keys(set.progression).map((bar, index) => (
                <ProgressBars
                  // ref={(element) => (progressionRefs.current[index] = element)}
                  length={Object.values(set.progression).at(index)}
                  translationsLength={translationsCount}
                  bar={bar}
                />
              ))}
            </div>
          )}
        </div>

        <div className={"mr-2"}>
          <button
            onClick={() => {
              setCardActive(true);
              animate();
            }}
            className={
              "w-10 aspect-square bg-gray-100 rounded-full flex items-center justify-center z-100"
            }
          >
            <FontAwesomeIcon
              icon="fa-solid fa-ellipsis-vertical"
              className={"text-gray-700 text-xl"}
            />
          </button>
        </div>

        <div
          ref={editComponentRef}
          className={
            "absolute top-1/2 left-[100%] transform -translate-y-1/2 bg-gray-100 h-full rounded-md w-full flex items-center justify-around text-2xl text-gray-700 "
          }
        >
          <button
            onClick={() => {
              setCardActive(false);
              animate();
            }}
            className={
              "flex items-center justify-center w-full bg-amber-500 h-full text-gray-700 rounded-l-md hover:w-[200%] transition-[width]"
            }
          >
            <FontAwesomeIcon icon="fa-solid fa-arrow-right" />
          </button>
          {auth?.user.id === set.user_id && (
            <>
              <Link
                className={
                  "flex items-center justify-center w-full bg-gray-100 h-full hover:w-[200%] transition-[width]"
                }
                href={route("flashcards.showEdit", [set.id])}
              >
                <FontAwesomeIcon icon="fa-solid fa-pen-to-square" />
              </Link>
              <button
                onClick={(e) => deleteSet(e, set.id)}
                className={
                  "flex items-center justify-center w-full bg-red-500 h-full text-gray-700 hover:w-[200%] transition-[width]"
                }
              >
                <FontAwesomeIcon icon="fa-solid fa-trash" />
              </button>
            </>
          )}

          <Link
            className={
              "flex items-center justify-center w-full bg-indigo-500 h-full rounded-r-md hover:w-[200%] transition-[width]"
            }
            href={route("flashcards.showSet", [set.id])}
          >
            <FontAwesomeIcon icon="fa-solid fa-list" />
          </Link>
        </div>
      </div>
    );
  },
);