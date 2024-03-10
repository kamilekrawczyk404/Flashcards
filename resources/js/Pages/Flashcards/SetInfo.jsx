import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Carousel } from "flowbite-react";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import "@splidejs/react-splide/css";
import "@splidejs/react-splide/css/skyblue";
import { Container } from "@/Components/Container";
import { MainButton } from "@/Components/Buttons/MainButton.jsx";
import { TestLink } from "@/Pages/Flashcards/Partials/TestLink.jsx";
import { PopUpEdit } from "@/Components/Translations/PopUpEdit.jsx";
import { RotatingCard } from "@/Components/Translations/RotatingCard.jsx";
import { Translation } from "@/Components/Translations/Translation.jsx";
import Animation from "@/Pages/Animation.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SuccessModal } from "@/Components/Modals/SuccessModal.jsx";
import { GradientAndLines } from "@/Components/GradientAndLines.jsx";
import { SetProgression } from "@/Pages/Flashcards/Partials/SetProgression.jsx";

export default function SetInfo({
  auth,
  set,
  groups,
  progression,
  author,
  translationsCount,
  permissions,
  feedback,
}) {
  const [cards, setCards] = useState(
    new Array(translationsCount).fill({ isRotated: false }),
  );

  const [isCardFlippedOnce, setIsCardFlippedOnce] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [chosenTranslation, setChosenTranslation] = useState({
    groupIndex: 0, // index from map
    translationIndex: 1, // index from the database
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);

  let mainRefs = useRef([]);
  let translationsRefs = useRef([]);
  let groupsRefs = useRef([]);

  const checkCurrentWindowWidth = () => {
    if (window.innerWidth <= 640) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", checkCurrentWindowWidth);

    return () => {
      window.removeEventListener("resize", checkCurrentWindowWidth);
    };
  }, []);

  useLayoutEffect(() => {
    const mainAnimation = new Animation(mainRefs.current);
    const translationsAnimation = new Animation(translationsRefs.current);
    const groupsAnimation = new Animation(groupsRefs.current);

    // Nav
    for (let i = 0; i < 4; i++) {
      mainAnimation.clippingTo.to(mainRefs.current[i], {}, "<");
      mainAnimation.movingTo.to(mainRefs.current[i], {}, "");
      mainAnimation.appearingTo.to(mainRefs.current[i], {}, "<+.1");
    }

    // Carousel
    mainAnimation.movingTo
      .to(mainRefs.current[4], {}, "<+.5")
      // Author
      .to(mainRefs.current[5], {}, "<-.5")
      // Button
      .to(mainRefs.current[6], {}, "<+.3");

    mainAnimation.appearingTo
      .to(mainRefs.current[4], {}, "<+.3")
      .to(mainRefs.current[5], {}, "<+.7")
      .to(mainRefs.current[6], {}, "<");

    mainAnimation.clippingTo
      .to(mainRefs.current[4], {}, "<+.3")
      .to(mainRefs.current[5], {}, "<+.5")
      .to(mainRefs.current[6], {}, "<+.3");

    // Groups
    groupsAnimation.animateAll("", "+.2", "+.3");

    // Translations
    translationsAnimation.animateAll("+.3", "+.4", "+.6");
  }, []);

  const toggle = (index) => {
    let copy = [...cards];
    let value = copy[index].isRotated;
    copy.splice(index, 1, { isRotated: !value });
    setCards(copy);

    // The orange bar disappearing...
    setTimeout(() => {
      setIsCardFlippedOnce(true);
    }, 500);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  return (
    <>
      <AuthenticatedLayout
        user={auth.user}
        header={
          <h2 className="font-semibold text-xl text-indigo-500 leading-tight">
            {set.title.replaceAll("_", " ")}
          </h2>
        }
      >
        <Head title={`Set - ${set.title}`} />

        <SetProgression
          progression={progression}
          translationsCount={translationsCount}
        />

        <Container>
          <div className="bg-white overflow-hidden sm:rounded-md">
            <div className="flex gap-4 text-md md:flex-row flex-col relative">
              <TestLink
                ref={(element) => {
                  mainRefs.current[1] = element;
                }}
                href={route("flashcards.learn", [set.id])}
              >
                <FontAwesomeIcon
                  icon="fa-solid fa-book"
                  className={"text-xl text-gray-600 transition mr-3"}
                />
                Learn
              </TestLink>

              <TestLink
                ref={(element) => {
                  mainRefs.current[2] = element;
                }}
                href={route("flashcards.test", [set.id])}
              >
                <FontAwesomeIcon
                  icon="fa-solid fa-chalkboard-user"
                  className={"mr-3 text-xl text-gray-600 transition"}
                />
                Test
              </TestLink>

              <TestLink
                ref={(element) => {
                  mainRefs.current[3] = element;
                }}
                href={route("flashcards.match", [set.id])}
              >
                <FontAwesomeIcon
                  icon="fa-solid fa-copy"
                  className={"mr-3 text-xl text-gray-600 transition"}
                />
                Match
              </TestLink>
            </div>
          </div>
          <div
            className={"translate-y-12 polygon-start opacity-0 my-4 w-full"}
            ref={(element) => {
              mainRefs.current[4] = element;
            }}
          >
            <Carousel
              className="w-full relative flex flex-col sm:p-[4.5rem] sm:bg-gradient-to-tl from-indigo-600 to-indigo-400 rounded-md shadow-lg z-10 "
              pauseOnHover={true}
              slide={!isEditing}
              leftControl={isMobile}
              rightControl={isMobile}
              indicators={isMobile}
            >
              {groups.map((group) => {
                return group.translations.map(
                  (translation, translationIndex) => (
                    <div
                      key={translationIndex}
                      className="perspective-[1000px] relative w-full h-[16rem] rounded-md"
                    >
                      <div
                        className={
                          "flip-card-inner relative mx-auto w-full h-full transition ease-in-out duration-[1s] flex items-center text-3xl break-keep text-gray-600 font-bold sm:bg-white bg-gray-100 " +
                          (cards[translationIndex]?.isRotated
                            ? "rotate-x-0"
                            : "rotate-x-180")
                        }
                      >
                        <RotatingCard
                          isFront={true}
                          handleSetEditing={setIsEditing}
                          translation={{
                            ...translation,
                            type: "term",
                          }}
                          onClick={() => {
                            toggle(translationIndex);
                          }}
                        >
                          {!isCardFlippedOnce && (
                            <div
                              className={
                                "absolute bottom-0 text-lg bg-amber-400 w-full"
                              }
                            >
                              Click the card to flip it!
                            </div>
                          )}
                        </RotatingCard>
                        <RotatingCard
                          handleSetEditing={setIsEditing}
                          translation={{
                            ...translation,
                            type: "definition",
                          }}
                          onClick={() => {
                            toggle(translationIndex);
                          }}
                        />
                      </div>
                    </div>
                  ),
                );
              })}
            </Carousel>
          </div>

          <div className="space-y-4 rounded-md">
            <div className="bg-gray-100 rounded-md px-4 py-2 flex gap-2 flex-col shadow-lg">
              <div
                ref={(element) => {
                  mainRefs.current[5] = element;
                }}
                className={
                  "polygon-start opacity-0 translate-y-12 flex sm:flex-row flex-col justify-between"
                }
              >
                <p>
                  Created by
                  <span className="-mt-2 font-bold tracking-wide block text-xl text-indigo-500 max-w-md overflow-hidden overflow-ellipsis">
                    {author}
                  </span>
                </p>

                <p className="text-md">
                  Terms in this set{" "}
                  <span className="text-indigo-500 font-bold">
                    ({translationsCount})
                  </span>
                </p>
              </div>
              <div className="flex justify-between md:flex-row flex-col gap-2">
                <div className="bg-gray-100 w-full md:w-1/2">
                  {set.description}
                </div>
              </div>
            </div>

            <section className={"space-y-2"}>
              {groups.map((group, groupIndex) => {
                return (
                  <div
                    key={groupIndex}
                    className={
                      "flex flex-col gap-2 shadow-lg rounded-md polygon-start opacity-0 translate-y-12"
                    }
                    ref={(element) =>
                      (groupsRefs.current[groupIndex] = element)
                    }
                  >
                    <GradientAndLines
                      className={"px-2 py-1"}
                      from={"from-amber-500"}
                      to={"to-amber-300"}
                    >
                      <span className={"text-gray-700 font-bold text-xl"}>
                        {group.name}
                      </span>
                    </GradientAndLines>
                    {group.translations.map((translation, translationIndex) => (
                      <div
                        key={translationIndex}
                        className={
                          "polygon-start opacity-0 translate-y-12 flex justify-center "
                        }
                        ref={(element) => {
                          translationsRefs.current.push(element);
                        }}
                      >
                        <Translation
                          permissions={permissions}
                          set={set}
                          translation={translation}
                          groupIndex={groupIndex}
                          handleSetChosenTranslation={setChosenTranslation}
                        />
                      </div>
                    ))}
                  </div>
                );
              })}
            </section>
          </div>

          {permissions.canEdit && (
            <div
              className="mt-8 flex justify-center polygon-start opacity-0 translate-y-12"
              ref={(element) => (mainRefs.current[6] = element)}
            >
              <MainButton
                href={route("flashcards.showEdit", [set.id])}
                isRedirect={true}
                className={"bg-indigo-500 text-gray-100 hover:bg-indigo-600"}
              >
                Add or Remove Terms
              </MainButton>
            </div>
          )}
        </Container>
      </AuthenticatedLayout>
      <SuccessModal feedback={feedback} />

      <PopUpEdit
        modalId={"modal-edit-translation"}
        translation={
          groups
            .at(chosenTranslation.groupIndex)
            .translations.filter(
              (translation) =>
                translation.id === chosenTranslation.translationIndex,
            )[0]
        }
        set={set}
        cancelEditing={cancelEditing}
        // handleFetchTranslations={fetchTranslations}
      />
    </>
  );
}