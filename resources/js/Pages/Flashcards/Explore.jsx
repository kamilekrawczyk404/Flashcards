import {
  forwardRef,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { GoBackIndicator } from "@/Pages/Flashcards/Partials/GoBackIndicator.jsx";
import { SingleSet } from "@/Pages/Flashcards/Partials/SingleSet.jsx";
import { useSetsSearch } from "@/useSetsSearch.js";
import { SearchLoadingAnimation } from "@/Components/Loading/SearchLoadingAnimation.jsx";
import Animation from "@/Pages/Animation.js";
import { Search } from "@/Components/Form/Search.jsx";
import Cookies from "js-cookie";
import { Filter } from "@/Components/Form/Filter.jsx";

export const Explore = forwardRef(
  ({ handleAnimateToRight, availableLanguages }, ref) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [searching, setSearching] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [previousSearch, setPreviousSearch] = useState(
      typeof Cookies.get("previousSearch") === "undefined"
        ? []
        : JSON.parse(Cookies.get("previousSearch")),
    );
    const [filters, setFilters] = useState({
      languages: [],
    });

    const { progress, hasMore, sets } = useSetsSearch(
      searching,
      currentPage,
      filters,
    );

    let setsRef = useRef([]);
    const observer = useRef();
    const searchingRef = useRef();

    const setPreviousSearching = () => {
      const values = Cookies.get("previousSearch");
      let newResults =
        typeof values !== "undefined"
          ? [...new Set([...JSON.parse(values), searching])]
          : [searching];

      Cookies.set("previousSearch", JSON.stringify(newResults), {
        expires: 7,
      });

      setPreviousSearch((prev) => [...new Set([...prev, ...newResults])]);
    };

    const deleteCookie = (id) => {
      let cookies = previousSearch.filter(
        (previous) => previous !== previousSearch[id],
      );

      Cookies.set("previousSearch", JSON.stringify(cookies), {
        expires: 7,
      });

      setPreviousSearch(cookies);
    };

    const lastSetRef = useCallback(
      (node) => {
        if (progress) return;

        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setCurrentPage((prev) => prev + 1);
          }
        });

        if (node) observer.current.observe(node);
      },
      [progress, hasMore],
    );

    useLayoutEffect(() => {
      if (sets.length > 0) {
        setPreviousSearching();
      }

      let resultsAppearingAnimation = new Animation([
        searchingRef.current,
        ...setsRef.current,
      ]);

      resultsAppearingAnimation.animateAll("<-.3", "", "<-.4");
    }, [sets]);

    //TODO: filtering by title, created_date, desc, asc

    return (
      <div
        className={
          "w-full absolute right-[-100%] opacity-1 h-full flex gap-4 flex-col p-4"
        }
        ref={ref}
      >
        <div
          className={
            "sm:max-h-[70vh] h-full  mx-auto w-full flex gap-4 flex-col items-center justify-center"
          }
        >
          <div
            className={"flex w-full justify-center gap-2 lg:flex-row flex-col"}
          >
            <Filter
              filters={filters}
              handleSetFilters={setFilters}
              isSearching={isSearching}
              availableLanguages={availableLanguages}
            />
            <Search
              isSearching={isSearching}
              searching={searching}
              ref={searchingRef}
              handleSetCurrentPage={setCurrentPage}
              handleSetSearching={setSearching}
              handleSetIsSearching={setIsSearching}
              previousSearches={previousSearch}
              handleDeleteCookie={deleteCookie}
            />
          </div>
          {!sets.length && (
            <SearchLoadingAnimation
              className={"lg:ml-[20%] ml-0 lg:mt-0 mt-32"}
              progress={progress}
              hasMore={hasMore}
              sets={sets}
            />
          )}
          <div
            className={
              "overflow-y-scroll h-[75vh] w-full flex flex-col items-center gap-4 lg:ml-[20.75%] ml-0 lg:mt-0 mt-32"
            }
          >
            {sets.map((set, index) =>
              sets.length === index + 1 && sets.length !== 1 ? (
                <SingleSet
                  key={index}
                  set={set}
                  ref={lastSetRef}
                  className={"opacity-0 polygon-start"}
                />
              ) : (
                <SingleSet
                  key={index}
                  set={set}
                  ref={(element) => (setsRef.current[index] = element)}
                  className={"opacity-0 polygon-start"}
                />
              ),
            )}
            {sets.length > 0 && (
              <SearchLoadingAnimation
                progress={progress}
                hasMore={hasMore}
                sets={sets}
              />
            )}
          </div>
        </div>

        <GoBackIndicator onRight={true} handleAnimate={handleAnimateToRight} />
      </div>
    );
  },
);