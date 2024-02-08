import { forwardRef, useEffect, useRef } from "react";
import { button } from "@material-tailwind/react";
import Animation from "@/Pages/Animation.js";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export const Search = forwardRef(
    (
        {
            searching,
            isSearching,
            searchingRef,
            handleSetSearching,
            handleSetCurrentPage,
            handleSetIsSearching,
            handleDeleteCookie,
            previousSearches = [],
        },
        ref,
    ) => {
        const TIMEOUT = 100;

        let previousSearchesContainerRef = useRef();
        let previousSearchesRef = useRef([]);

        useEffect(() => {
            if (!searching.length) {
                // reset appearing animation each time when user delete whole content of the search input
                animatePreviousSearches();
            }
        }, [searching.length]);
        const animatePreviousSearches = () => {
            const animation = new Animation([
                previousSearchesContainerRef.current,
            ]);
            animation.animateAll("", "", "");
        };

        return (
            <div
                className={
                    "flex flex-col relative transition-width duration-500 " +
                    (isSearching ? "lg:w-1/2 md:w-2/3 w-full" : "w-0")
                }
            >
                <div
                    className={
                        "flex relative bg-gray-100 p-2 gap-2 " +
                        (isSearching
                            ? "rounded-t-md"
                            : "rounded-md bg-transparent ")
                    }
                >
                    <button
                        type={"button"}
                        className={isSearching ? "hidden" : "block"}
                        onClick={() => {
                            handleSetIsSearching(true);
                            setTimeout(() => {
                                ref.current.focus();
                                animatePreviousSearches();
                            }, TIMEOUT);
                        }}
                    >
                        <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" className={'text-lg text-indigo-500'}/>
                    </button>
                    <input
                        placeholder={isSearching ? "Search..." : ""}
                        ref={ref}
                        type="text"
                        value={searching}
                        onChange={(e) => {
                            handleSetCurrentPage(0);
                            handleSetSearching(e.target.value);
                        }}
                        className={
                            "border-none focus:ring-0 " +
                            (isSearching ? "block w-full" : "hidden")
                        }
                    />

                    {isSearching && (
                        <button
                            onClick={() => {
                                handleSetSearching("");
                                setTimeout(() => {
                                    handleSetIsSearching(false);
                                }, TIMEOUT);
                            }}
                            className={
                                "bg-indigo-500 rounded-md text-gray-100 px-2"
                            }
                        >
                            <FontAwesomeIcon icon="fa-solid fa-xmark" className={'font-bold text-2xl'}/>
                        </button>
                    )}
                </div>
                <div
                    className={
                        "relative bg-indigo-500 h-[.25rem] transition-width " +
                        (isSearching ? "w-full" : "w-0")
                    }
                ></div>
                {previousSearches.length > 0 &&
                    isSearching &&
                    !searching.length && (
                        <div
                            ref={previousSearchesContainerRef}
                            className={
                                "w-full space-y-2 mx-auto bg-gray-100 rounded-b-md p-2 polygon-from-top opacity-0"
                            }
                        >
                            <p className={"text-indigo-500"}>Last searches</p>
                            <div
                                className={
                                    "flex gap-2 flex-wrap rounded-full max-h-[2rem] "
                                }
                            >
                                {previousSearches.reverse().map(
                                    (previous, index) =>
                                        index < 10 && (
                                            <div
                                                ref={(element) =>
                                                    (previousSearchesRef.current[
                                                        index
                                                    ] = element)
                                                }
                                                key={index}
                                                className={
                                                    "flex items-center justify-center cursor-pointer relative h-[2rem] shadow-lg rounded-full"
                                                }
                                            >
                                                <button
                                                    onClick={() => {
                                                        handleSetSearching(
                                                            previous,
                                                        );
                                                    }}
                                                    className={
                                                        "bg-white w-full px-4 text-gray-700 text-xl h-full rounded-l-full"
                                                    }
                                                >
                                                    {previous}
                                                </button>
                                                <button
                                                    className={
                                                        "bg-indigo-500 flex items-center justify-center h-full rounded-r-full"
                                                    }
                                                    type={"button"}
                                                    onClick={() => {
                                                        handleDeleteCookie(
                                                            index,
                                                        );
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon="fa-solid fa-xmark" className={'text-md px-2 font-bold text-gray-100'}/>
                                                </button>
                                            </div>
                                        ),
                                )}
                            </div>
                        </div>
                    )}
            </div>
        );
    },
);