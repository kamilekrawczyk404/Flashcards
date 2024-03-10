import {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Link, router, usePage } from "@inertiajs/react";
import Animation from "@/Pages/Animation.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ProgressBar } from "@/Pages/Flashcards/Partials/ProgressBar.jsx";
import { SingleSetItem } from "@/Pages/Flashcards/Partials/SingleSetItem.jsx";
import {
  faAnglesLeft,
  faBarsProgress,
  faCopy,
  faEllipsisVertical,
  faLanguage,
  faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";
import { SetProgression } from "@/Pages/Flashcards/Partials/SetProgression.jsx";
import { useObserver } from "@/useObserver.js";

export const SingleSet = forwardRef(
  ({ set, index, className, ...props }, ref) => {
    const [cardActive, setCardActive] = useState(false);
    const titleRef = useRef(null);

    let editComponentRef = useRef();
    const animation = new Animation([editComponentRef.current], cardActive);
    const auth = usePage().props.auth;
    const animate = () => {
      animation.slideToRight();
    };

    const deleteSet = (e, set_id) => {
      e.preventDefault();

      if (confirm("Are you sure to delete this set?"))
        router.delete(`/delete/set/${set_id}`);
    };

    useLayoutEffect(() => {
      useObserver(titleRef, "", "", "+.2");
    }, []);

    return (
      <div
        ref={ref}
        className={
          "rounded-md relative xl:w-1/2 lg:w-2/3 md:w-3/4 w-[82vw] transition flex justify-between items-center overflow-hidden mx-auto bg-gray-50 " +
          (set.progression
            ? "md:min-h-[14rem] min-h-[20rem] "
            : "min-h-[14rem] ") +
          className
        }
      >
        <div
          className={
            "absolute left-0 top-0 h-full w-[3.15rem] bg-gradient-to-br from-indigo-600 to-indigo-300"
          }
        ></div>

        <div
          className={
            "bg-gray-100 absolute top-0 left-[.5rem] h-full w-[.25rem]"
          }
        ></div>
        <div className={"absolute top-[5%] left-[5%] w-1/4 h-[90%] "}>
          <Link
            className={
              "text-2xl font-bold text-indigo-500  border-amber-400 border-b-[.25rem] pl-11 whitespace-nowrap overflow-ellipsis max-w-1/2"
            }
            href={route("flashcards.showSet", [set.id])}
          >
            <span
              ref={titleRef}
              className={"inline-block polygon-start opacity-0 -translate-y-2"}
            >
              {set.title.replaceAll("_", " ")}
            </span>
          </Link>
        </div>
        <div
          className={
            "absolute top-1/4 left-[2.5rem] -translate-x-[15%] flex flex-col text-lg gap-y-2"
          }
        >
          <SingleSetItem
            icon={faCopy}
            text={"translations"}
            count={set.translationsCount}
          />
          <SingleSetItem
            icon={faLayerGroup}
            text={set.groupsCount !== 1 ? "groups" : "group"}
            count={set.groupsCount}
          />
          <SingleSetItem
            icon={faLanguage}
            text={`${set.source_language} - ${set.target_language}`}
          />
        </div>

        {set.progression && (
          <SetProgression
            translationsCount={set.translationsCount}
            progression={set.progression}
            asSection={false}
          />
        )}

        <div className={"absolute right-4 hover:-translate-x-1 transition"}>
          <button
            onClick={() => {
              setCardActive(true);
              animate();
            }}
            className={"flex items-center justify-center z-100 p-2"}
          >
            <FontAwesomeIcon
              icon={faAnglesLeft}
              className={"text-xl text-indigo-500"}
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
            tabIndex={-1}
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
                tabIndex={-1}
                className={
                  "flex items-center justify-center w-full bg-gray-100 h-full hover:w-[200%] transition-[width]"
                }
                href={route("flashcards.showEdit", [set.id])}
              >
                <FontAwesomeIcon icon="fa-solid fa-pen-to-square" />
              </Link>
              <button
                tabIndex={-1}
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
            tabIndex={-1}
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