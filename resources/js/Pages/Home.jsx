import Unauthenticated from "@/Layouts/UnauthenticatedLayout.jsx";
import { SignUpSignIn } from "@/Pages/Auth/SignUpSignIn.jsx";
import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
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
import { ThemeContext } from "@/ThemeContext.jsx";
import { LearnImage } from "@/Images/LearnImage.jsx";
import { ExploreImage } from "@/Images/ExploreImage.jsx";
import { UnauthenticatedImage } from "@/Images/UnauthenticatedImage.jsx";

export default function Home({
  auth,
  availableLanguages,
  canLogin,
  canRegister,
  feedback,
}) {
  // convert images to webp

  const { properties } = useContext(ThemeContext);

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
      if (isPaused) {
        setTimeout(() => {
          setIsPaused(false);
        }, 1000);
      } else if (!isPaused && startErasing) {
        setTimeout(() => {
          erase();
        }, 50);
      } else {
        setTimeout(
          () => {
            write();
          },
          Math.floor(Math.random() * (200 - 150) + 100),
        );
      }
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
          <SectionWithVerticalMargin className={"flex items-center z-10"}>
            <div
              ref={welcomeScreen}
              className={
                "flex sm:mx-auto items-center lg:flex-row flex-col-reverse justify-between xl:gap-0 gap-4 polygon-start translate-y-12 opacity-0 max-w-7xl sm:px-8 px-4"
              }
            >
              <div
                className={
                  "flex flex-col lg:items-start items-center  space-y-8 rounded-md lg:w-1/2 w-full"
                }
              >
                <h1 className={properties.text + " sm:text-3xl text-2xl"}>
                  Start your learning journey right now!
                  <div
                    className={"h-9 font-bold w-fit text-indigo-500 relative "}
                  >
                    <span
                      className={"border-b-2 border-indigo-500 "}
                      ref={(element) => (animatedText.current = element)}
                    ></span>
                  </div>
                </h1>
                <SignUpSignIn
                  className={"rounded-md space-x-6"}
                  isInNav={false}
                />
              </div>
              <UnauthenticatedImage
                className={"lg:w-1/2 md:w-2/3 w-full h-auto"}
              />
            </div>
          </SectionWithVerticalMargin>
          <div
            className={
              properties.container +
              " lg:block hidden absolute top-0 left-1/2 w-full h-full"
            }
          ></div>
        </Unauthenticated>
      ) : (
        <Authenticated user={auth?.user} fullScreen={true}>
          <SectionWithVerticalMargin className={"flex"}>
            <div
              ref={(element) => (welcomeScreen.current = element)}
              className={
                "flex lg:flex-row flex-col items-center justify-center translate-y-12 opacity-0 polygon-start w-full"
              }
            >
              <OptionCard
                disabled={isDisabled}
                onClick={() => {
                  animateToLeft();
                  setHasMovedToAllSets(true);
                }}
                text={"Learn"}
                icon={faGraduationCap}
              >
                <LearnImage className={"lg:scale-100 scale-75"} />
              </OptionCard>
              <div
                className={
                  properties.container +
                  " absolute lg:left-1/2 lg:top-0 lg:h-full lg:w-1 lg:-translate-y-0 left-0 top-1/2 -translate-y-1/2 w-full h-1"
                }
              ></div>
              <OptionCard
                disabled={isDisabled}
                onClick={() => {
                  animateToRight();
                }}
                text={"Explore"}
                icon={faMagnifyingGlass}
              >
                <ExploreImage className={"lg:scale-95 scale-75"} />
              </OptionCard>
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