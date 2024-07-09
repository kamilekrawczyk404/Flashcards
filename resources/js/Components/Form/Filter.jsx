import { button } from "@material-tailwind/react";
import { useContext, useEffect, useRef, useState } from "react";
import Animation from "@/Pages/Animation.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faFilter } from "@fortawesome/free-solid-svg-icons";
import { ThemeContext } from "@/ThemeContext.jsx";

export const Filter = ({
  isSearching,
  availableLanguages,
  filters,
  handleSetFilters,
}) => {
  const { properties } = useContext(ThemeContext);
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
    setIsHide((prev) => !prev);

    animation.animateAll(
      isHide ? "+0.1" : "-0.1",
      isHide ? "-0.1" : "+0.2",
      isHide ? "+0.3" : "-0.2",
    );
  };

  return (
    <>
      <div
        className={
          "transition-all relative duration-500 flex flex-col " +
          (isSearching ? " lg:w-1/5 w-full" : " w-0")
        }
      >
        <div
          className={
            `${properties.container} ${properties.text} rounded-t-md p-2 self-start flex-col relative w-full ` +
            (isSearching ? "flex" : "hidden")
          }
        >
          <button
            disabled={isDisabled}
            className={"relative"}
            onClick={() => {
              hideOrShowFilters();
            }}
          >
            <p
              className={
                properties.background + " flex items-center p-2 rounded-sm"
              }
            >
              <FontAwesomeIcon
                icon={faFilter}
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
                icon={faArrowUp}
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
          className={`${properties.container} ${
            isSearching ? "!h-fit" : "hidden"
          } w-full p-2 rounded-b-md polygon-start`}
        >
          <div className={"flex flex-col gap-2 mt-[.25rem]"}>
            <p className={"text-indigo-500"}>Languages</p>
            <div className={"flex gap-2 overflow-x-scroll py-2"}>
              {availableLanguages.map((language) => (
                <button
                  key={language}
                  onClick={() => {
                    filters.languages.includes(language)
                      ? removeActiveField(language)
                      : addActiveField(language);
                  }}
                  className={
                    `${properties.background} ${properties.text} space-x-2 px-4 rounded-full h-[2rem] text-lg shadow-lg ` +
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
    </>
  );
};