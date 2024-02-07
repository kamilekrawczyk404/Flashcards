import Unauthenticated from "@/Layouts/UnauthenticatedLayout.jsx";
import { SignUpSignIn } from "@/Pages/Auth/SignUpSignIn.jsx";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { SectionWithVerticalMargin } from "@/Components/SectionWithVerticalMargin.jsx";
import Authenticated from "@/Layouts/AuthenticatedLayout.jsx";
import { OptionCard } from "@/Components/OptionCard.jsx";
import Animation from "@/Pages/Animation.js";
import { AllSets } from "@/Pages/Flashcards/AllSets.jsx";
import { Explore } from "@/Pages/Flashcards/Explore.jsx";

export default function Home({
    auth,
    permissions,
    availableLanguages,
    canLogin,
    canRegister,
}) {
    const sentences = [
        "It's totally free!",
        "Join to our community!",
        "Learn languages like never before!",
    ];

    let welcomeScreen = useRef();
    let exploreComponent = useRef();
    let setsComponent = useRef();

    // For incrementation
    const [index, setIndex] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [startErasing, setStartErasing] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [hasMovedToAllSets, setHasMovedToAllSets] = useState(false);

    let animatedText = useRef();

    const [isShowedUp, setIsShowedUp] = useState(false);

    const getNextIndex = (current) => {
        return sentences.length - 1 === current ? 0 : current + 1;
    };

    const write = () => {
        if (index <= sentences[currentIndex].length && animatedText.current) {
            animatedText.current.innerHTML += sentences[currentIndex].at(index);
            setIndex((prev) => {
                if (prev + 1 === sentences[currentIndex].length) {
                    setIsPaused(true);
                    setStartErasing(true);
                }
                return prev + 1;
            });
        }
    };

    const erase = () => {
        if (index <= sentences[currentIndex].length) {
            animatedText.current.innerHTML = sentences[currentIndex].substring(
                0,
                index,
            );
            setIndex((prev) => {
                if (prev === 0) {
                    setStartErasing(false);
                    setCurrentIndex(getNextIndex(currentIndex));
                    setIndex(0);
                }
                return prev - 1;
            });
        }
    };

    const animateToLeft = (isReversingMode) => {
        setIsDisabled(true);

        let animation = new Animation(
            [welcomeScreen.current, setsComponent.current],
            isReversingMode,
            () => setIsDisabled(false),
        );
        animation.slideToLeft("<+.7");
    };

    const animateToRight = (isReversingMode) => {
        setIsDisabled(true);

        let animation = new Animation(
            [welcomeScreen.current, exploreComponent.current],
            isReversingMode,
            () => setIsDisabled(false),
        );
        animation.slideToRight("<+.7");
    };

    useEffect(() => {
        if (!auth.user) {
            let textAnimation = setInterval(() => {
                setIsShowedUp((prev) => !prev);
            }, 500);

            if (isPaused) {
                setTimeout(() => {
                    setIsPaused(false);
                }, 1000);
            } else if (!isPaused && startErasing) {
                setTimeout(() => {
                    erase();
                    setIsShowedUp((prev) => !prev);
                }, 50);
            } else {
                setTimeout(
                    () => {
                        write();
                        setIsShowedUp((prev) => !prev);
                    },
                    Math.floor(Math.random() * (200 - 150) + 150),
                );
            }
            return () => {
                clearInterval(textAnimation);
            };
        }
    }, [index, currentIndex, isPaused]);

    useLayoutEffect(() => {
        let welcomeComponentAnimation = new Animation([welcomeScreen.current]);
        welcomeComponentAnimation.animateAll("<-.1", "<", "<+.3");
    }, []);

    return (
        <>
            {auth.user === null ? (
                <Unauthenticated fullScreen={true}>
                    <SectionWithVerticalMargin
                        className={"flex items-center flex-row"}
                    >
                        <div
                            ref={welcomeScreen}
                            className={
                                "flex mx-auto items-center xl:flex-row flex-col-reverse justify-between xl:gap-0 gap-20 max-w-[76rem]  polygon-start translate-y-12 opacity-0"
                            }
                        >
                            <div
                                className={"xl:space-y-16 space-y-8 rounded-md"}
                            >
                                <h1 className={"text-3xl text-gray-700"}>
                                    Start your learning journey right now!
                                    <div
                                        className={
                                            "h-9 font-bold w-fit text-indigo-500 border-b-4 border-indigo-500 relative before:absolute before:-right-2 before:w-[.25rem] before:h-4/5 before:transform before:top-1/2 before:-translate-y-1/2 before:bg-gray-700 " +
                                            (isShowedUp
                                                ? "before:block"
                                                : "before:hidden")
                                        }
                                    >
                                        <span
                                            ref={(element) =>
                                                (animatedText.current = element)
                                            }
                                        ></span>
                                    </div>
                                </h1>
                                <SignUpSignIn
                                    className={
                                        "rounded-md [&>a]:scale-[1.25] space-x-6"
                                    }
                                />
                            </div>
                            <img
                                className={"max-w-[55%]"}
                                src={
                                    "https://img.freepik.com/free-vector/happy-women-learning-language-online-isolated-flat-vector-illustration-cartoon-female-characters-taking-individual-lessons-through-messenger-education-digital-technology-concept_74855-10088.jpg?w=2000&t=st=1706271781~exp=1706272381~hmac=0d829188f62b24d0b9382fef7bca4c7e427e9584fb2524673d0144ad7224ce7b"
                                }
                                alt="Study Image"
                            />
                        </div>
                    </SectionWithVerticalMargin>
                </Unauthenticated>
            ) : (
                <Authenticated user={auth?.user} fullScreen={true}>
                    <SectionWithVerticalMargin
                        className={
                            "flex items-center justify-center gap-8 relative"
                        }
                    >
                        <div
                            ref={(element) => (welcomeScreen.current = element)}
                            className={
                                "flex items-center justify-center flex-col gap-8 translate-y-12 opacity-0 polygon-start"
                            }
                        >
                            <div
                                className={
                                    "mx-auto py-2 border-b-4 border-indigo-500 w-fit"
                                }
                            >
                                <h1
                                    className={
                                        "text-3xl text-gray-700 font-bold"
                                    }
                                >
                                    Welcome back{" "}
                                    <span className={"text-amber-500"}>
                                        {auth.user.name}
                                    </span>
                                    !
                                </h1>
                                <p className={"text-xl"}>
                                    What do we do today?
                                </p>
                            </div>
                            <div
                                className={
                                    "flex relative w-full md:flex-row flex-col items-center justify-center p-4 gap-4"
                                }
                            >
                                <OptionCard
                                    disabled={isDisabled}
                                    onClick={() => {
                                        animateToLeft();
                                        setHasMovedToAllSets(true);
                                    }}
                                >
                                    <h1
                                        className={
                                            "text-indigo-500 text-3xl font-bold"
                                        }
                                    >
                                        Learn
                                        <i className="text-amber-500 fa-solid fa-graduation-cap ml-2"></i>
                                    </h1>
                                    <img
                                        className={
                                            "xl:max-w-[30rem] lg:max-w-[23rem] max-w-[16rem] rounded-md self-center"
                                        }
                                        src="https://img.freepik.com/free-vector/online-certification-illustration_23-2148575636.jpg?w=1380&t=st=1706516299~exp=1706516899~hmac=3c044c1ff557f48496fbcc2b00eb1121776ae20b39fb1620d1c14024af0026f6"
                                        alt="learning image"
                                    />
                                </OptionCard>
                                <OptionCard
                                    disabled={isDisabled}
                                    onClick={() => {
                                        animateToRight();
                                    }}
                                >
                                    <span
                                        className={
                                            "text-indigo-500 text-3xl font-bold"
                                        }
                                    >
                                        Explore
                                        <i className="text-amber-500 fa-solid fa-magnifying-glass ml-2"></i>
                                    </span>
                                    <img
                                        className={
                                            "xl:max-w-[30rem] lg:max-w-[25rem] max-w-[16rem] w-full rounded-md self-center xl:mt-20 lg:mt-12 mt-8"
                                        }
                                        src="https://img.freepik.com/free-vector/people-using-search-box-query-engine-giving-result_74855-11000.jpg?w=2000&t=st=1706516315~exp=1706516915~hmac=e53a6eaa13974a19947b5e937100930794d5f564d2e78399964d586c29f100d5"
                                        alt=""
                                    />
                                </OptionCard>
                            </div>
                        </div>
                        <AllSets
                            handleHasMovedToAllSets={setHasMovedToAllSets}
                            hasMovedToAllSets={hasMovedToAllSets}
                            auth={auth}
                            ref={setsComponent}
                            handleAnimateToLeft={animateToLeft}
                            userId={auth.user.id}
                        />
                        <Explore
                            availableLanguages={availableLanguages}
                            auth={auth}
                            ref={exploreComponent}
                            handleAnimateToRight={animateToRight}
                        />
                    </SectionWithVerticalMargin>
                </Authenticated>
            )}
        </>
    );
}