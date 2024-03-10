import Unauthenticated from "@/Layouts/UnauthenticatedLayout.jsx";
import { SignUpSignIn } from "@/Pages/Auth/SignUpSignIn.jsx";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { SectionWithVerticalMargin } from "@/Components/SectionWithVerticalMargin.jsx";
import Authenticated from "@/Layouts/AuthenticatedLayout.jsx";
import { OptionCard } from "@/Layouts/Partials/OptionCard.jsx";
import Animation from "@/Pages/Animation.js";
import { AllSets } from "@/Pages/Flashcards/AllSets.jsx";
import { Explore } from "@/Pages/Flashcards/Explore.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SuccessModal } from "@/Components/Modals/SuccessModal.jsx";
import { getFilePath } from "@/getFilePath.jsx";
import {
  faGraduationCap,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

export default function Home({
  auth,
  availableLanguages,
  canLogin,
  canRegister,
  feedback,
}) {
  // convert images to webp

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
    if (index <= sentences[currentIndex].length) {
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
    if (animatedText.current && !auth.user) {
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
          <SectionWithVerticalMargin className={"flex items-center flex-row"}>
            <div
              ref={welcomeScreen}
              className={
                "flex sm:mx-auto items-center xl:flex-row flex-col-reverse justify-between xl:gap-0 gap-10 max-w-[76rem] m-2 polygon-start translate-y-12 opacity-0"
              }
            >
              <div className={"xl:space-y-16 space-y-8 rounded-md"}>
                <h1 className={"sm:text-3xl text-2xl text-gray-700"}>
                  Start your learning journey right now!
                  <div
                    className={
                      "h-9 font-bold w-fit text-indigo-500 border-b-4 border-indigo-500 relative before:absolute before:-right-2 before:w-[.25rem] before:h-4/5 before:transform before:top-1/2 before:-translate-y-1/2 before:bg-gray-700 " +
                      (isShowedUp ? "before:block" : "before:hidden")
                    }
                  >
                    <span
                      ref={(element) => (animatedText.current = element)}
                    ></span>
                  </div>
                </h1>
                <SignUpSignIn
                  className={"rounded-md [&>a]:  space-x-6"}
                  isInNav={false}
                />
              </div>
              <img
                className={"sm:max-w-[55%] w-fit"}
                src={getFilePath("/images/home_unauthenticated.jpg")}
                alt="Study Image"
              />
            </div>
          </SectionWithVerticalMargin>
        </Unauthenticated>
      ) : (
        <Authenticated user={auth?.user} fullScreen={true}>
          <SectionWithVerticalMargin
            className={"flex items-center justify-center gap-8 relative"}
          >
            <div
              ref={(element) => (welcomeScreen.current = element)}
              className={
                "flex items-center justify-center flex-col gap-8 translate-y-12 opacity-0 polygon-start"
              }
            >
              <div
                className={
                  "mx-auto py-2 border-b-4 border-indigo-500 w-fit sm:p-0 p-4"
                }
              >
                <h1 className={"text-3xl text-gray-700 font-bold"}>
                  Welcome back{" "}
                  <span className={"text-amber-500"}>{auth.user.name}</span>!
                </h1>
                <p className={"text-xl"}>What do we do today?</p>
              </div>
              <div
                className={
                  "flex relative w-full sm:flex-row flex-col sm:items-center p-4 gap-4"
                }
              >
                <OptionCard
                  disabled={isDisabled}
                  onClick={() => {
                    animateToLeft();
                    setHasMovedToAllSets(true);
                  }}
                >
                  <h1 className={"text-indigo-500 text-2xl font-bold"}>
                    Learn
                    <FontAwesomeIcon
                      icon={faGraduationCap}
                      className={"text-amber-500 ml-2"}
                    />
                  </h1>
                  <img
                    className={
                      "sm:block hidden xl:max-w-[25rem] lg:max-w-[20rem] sm:max-w-[12rem] rounded-md self-center"
                    }
                    src={getFilePath("/images/learn.jpg")}
                    alt="learning image"
                  />
                </OptionCard>
                <OptionCard
                  disabled={isDisabled}
                  onClick={() => {
                    animateToRight();
                  }}
                >
                  <span className={"text-indigo-500 text-2xl font-bold"}>
                    Explore
                    <FontAwesomeIcon
                      icon={faMagnifyingGlass}
                      className={"text-amber-500 ml-2"}
                    />
                  </span>
                  <img
                    className={
                      "sm:block hidden xl:max-w-[25rem] lg:max-w-[20rem] sm:max-w-[12rem] w-full rounded-md self-center xl:mt-20 lg:mt-12 mt-8"
                    }
                    src={getFilePath("/images/searching.jpg")}
                    alt="explore"
                  />
                </OptionCard>
              </div>
            </div>
            <AllSets
              handleHasMovedToAllSets={setHasMovedToAllSets}
              hasMovedToAllSets={hasMovedToAllSets}
              ref={setsComponent}
              handleAnimateToLeft={animateToLeft}
            />
            <Explore
              availableLanguages={availableLanguages}
              ref={exploreComponent}
              handleAnimateToRight={animateToRight}
            />
          </SectionWithVerticalMargin>
        </Authenticated>
      )}
      <SuccessModal feedback={feedback} />
    </>
  );
}