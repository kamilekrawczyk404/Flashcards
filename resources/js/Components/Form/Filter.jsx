import { button } from "@material-tailwind/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Animation from "@/Pages/Animation.js";
import { act } from "react-dom/test-utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const Filter = ({
  isSearching,
  availableLanguages,
  filters,
  handleSetFilters,
}) => {
  // TODO: what we can filter?
  // count of translations | followed users |
  // show in button count of results

  const [isHide, setIsHide] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  let fieldsRef = useRef();

  useEffect(() => {
    const animation = new Animation([fieldsRef.current]);
    animation.animateAll("", "", "");
  }, [isSearching]);

  const addActiveField = (element) => {
    handleSetFilters((prev) => ({
      ...prev,
      languages: [...new Set([...prev.languages, element])],
    }));
  };

  const removeActiveField = (element) => {
    handleSetFilters((prev) => ({
      ...prev,
      languages: [...prev.languages.filter((language) => language !== element)],
    }));
  };

  const hideOrShowFilters = () => {
    setIsDisabled(true);

    let animation = new Animation([fieldsRef.current], !isHide, () =>
      setIsDisabled(false),
    );

    animation.animateAll(
      isHide ? "+0.1" : "-0.1",
      "+0.1",
      isHide ? "+0.3" : "-0.2",
    );
    setIsHide((prev) => !prev);
  };

  return (
    <>
      {isSearching && (
        <div className={isSearching ? "relative lg:w-1/5 w-full" : "w-0"}>
          <div
            className={
              "bg-gray-100 rounded-t-md p-2 self-start text-gray-700 transition-[width] flex flex-col relative"
            }
          >
            <button
              disabled={isDisabled}
              className={"relative"}
              onClick={() => {
                hideOrShowFilters();
              }}
            >
              <p className={"flex items-center p-2 bg-white rounded-sm"}>
                <FontAwesomeIcon
                  icon="fa-solid fa-filter"
                  className={"text-xl text-indigo-500 mr-2"}
                />
                <span>Filters</span>
              </p>
              <span
                className={
                  "transform origin-center absolute right-2 top-1/2 -translate-y-1/2 inline-block transition " +
                  (!isHide ? "rotate-[540deg]" : "rotate-0")
                }
              >
                <FontAwesomeIcon
                  icon="fa-solid fa-arrow-up"
                  className={"text-xl text-indigo-500"}
                />
              </span>
            </button>
            <div
              className={
                "absolute left-0 -bottom-[.25rem] bg-indigo-500 h-[.25rem] transition-width z-10 " +
                (isSearching ? "w-full" : "w-0")
              }
            ></div>
          </div>

          <div
            ref={fieldsRef}
            className={
              "absolute w-full polygon-from-top opacity-0 bg-gray-100 p-2 rounded-b-md"
            }
          >
            <div className={"flex flex-col gap-2 mt-[.25rem]"}>
              <p className={"text-indigo-500"}>Languages</p>
              <div className={"flex flex-wrap gap-2"}>
                {availableLanguages.map((language) => (
                  <button
                    key={language}
                    onClick={() => {
                      filters.languages.some((element) => element === language)
                        ? removeActiveField(language)
                        : addActiveField(language);
                    }}
                    className={
                      "bg-white space-x-2 px-4 rounded-full h-[2rem] text-lg shadow-lg " +
                      (filters.languages.indexOf(language) !== -1
                        ? "ring-2 ring-indigo-500"
                        : "")
                    }
                  >
                    {language}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};