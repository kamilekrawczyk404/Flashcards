import { forwardRef, useRef, useState } from "react";
import { Link, router } from "@inertiajs/react";
import Animation from "@/Pages/Animation.js";

export const SingleSet = forwardRef(
    ({ auth, set, index, translationsCount, className, ...props }, ref) => {
        const deleteSet = (id, setTitle) => {
            if (confirm("Are you sure to delete this set?"))
                router.delete(`/delete/set/${id}/${setTitle}`);
        };
        const [cardActive, setCardActive] = useState(false);

        let editComponentRef = useRef();
        const animation = new Animation([editComponentRef.current], cardActive);

        const animate = () => {
            animation.slideToRight();
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
                        href={route("flashcards.showSet", [set.id, set.title])}
                    >
                        {set.title.replaceAll("_", " ")}
                    </Link>
                    <div
                        className={
                            "text-gray-700 text-lg font-bold bg-gray-100 w-fit p-2 rounded-sm"
                        }
                    >
                        {JSON.parse(set.languages).source}
                        <i className="fa-solid fa-arrow-right mx-2"></i>
                        {JSON.parse(set.languages).target}

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
                        <i className="fa-solid fa-ellipsis-vertical text-gray-700 text-xl"></i>
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
                        <i className="fa-solid fa-arrow-right"></i>
                    </button>
                    {auth?.user.id === set.user_id && (
                        <>
                            <Link
                                className={
                                    "flex items-center justify-center w-full bg-gray-100 h-full hover:w-[200%] transition-[width]"
                                }
                                href={route("flashcards.showEdit", [
                                    set.id,
                                    set.title,
                                ])}
                            >
                                <i className="fa-regular fa-pen-to-square"></i>
                            </Link>
                            <button
                                onClick={() => deleteSet(set.id, set.title)}
                                className={
                                    "flex items-center justify-center w-full bg-red-500 h-full text-gray-700 hover:w-[200%] transition-[width]"
                                }
                            >
                                <i className="fa-regular fa-trash-can"></i>
                            </button>
                        </>
                    )}

                    <Link
                        className={
                            "flex items-center justify-center w-full bg-indigo-500 h-full rounded-r-md hover:w-[200%] transition-[width]"
                        }
                        href={route("flashcards.showSet", [set.id, set.title])}
                    >
                        <i className="fa-solid fa-list"></i>
                    </Link>
                </div>
            </div>
        );
    },
);