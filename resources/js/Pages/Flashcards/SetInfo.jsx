import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Carousel } from "flowbite-react";
import React, { useLayoutEffect, useRef, useState } from "react";
import "@splidejs/react-splide/css";
import "@splidejs/react-splide/css/skyblue";
import { Container } from "@/Components/Container";
import { MainButton } from "@/Components/MainButton";
import { TestLink } from "@/Components/TestLink";
import { PopUpEdit } from "@/Components/Translations/PopUpEdit.jsx";
import { RotatingCard } from "@/Components/Translations/RotatingCard.jsx";
import { Translation } from "@/Components/Translations/Translation.jsx";
import TranslationsData from "@/TranslationsData.js";
import Animation from "@/Pages/Animation.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SuccessModal } from "@/Components/Modals/SuccessModal.jsx";

export default function SetInfo({
  auth,
  set,
  translations,
  author,
  translationsCount,
  permissions,
  feedback,
}) {
  console.log(feedback);
  const [fetchedTranslations, setFetchedTranslations] = useState(
    translations.map((translation) => {
      return new TranslationsData(translation);
    }),
  );

  const [cards, setCards] = useState(
    new Array(translations.length).fill({ isRotated: false }),
  );

  const [isCardFlippedOnce, setIsCardFlippedOnce] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [chosenIndex, setChosenIndex] = useState(null);

  let mainRefs = useRef([]);
  let translationsRefs = useRef([]);

  useLayoutEffect(() => {
    const mainAnimation = new Animation(mainRefs.current);
    const translationsAnimation = new Animation(translationsRefs.current);

    // Nav
    for (let i = 0; i < 4; i++) {
      mainAnimation.clipping.to(mainRefs.current[i], {}, "<");
      mainAnimation.moving.to(mainRefs.current[i], {}, "");
      mainAnimation.appearing.to(mainRefs.current[i], {}, "<+.1");
    }

    // Carousel
    mainAnimation.moving
      .to(mainRefs.current[4], {}, "<+.5")
      // Author
      .to(mainRefs.current[5], {}, "<-.5")
      // Button
      .to(mainRefs.current[6], {}, "<+.3");

    mainAnimation.appearing
      .to(mainRefs.current[4], {}, "<+.3")
      .to(mainRefs.current[5], {}, "<+.7")
      .to(mainRefs.current[6], {}, "<");

    mainAnimation.clipping
      .to(mainRefs.current[4], {}, "<+.3")
      .to(mainRefs.current[5], {}, "<+.5")
      .to(mainRefs.current[6], {}, "<+.3");

    // Translations
    translationsAnimation.animateAll("", "", "<+.1");
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

  const fetchTranslations = () => {
    setFetchedTranslations(
      translations.map((translation) => {
        return new TranslationsData(translation);
      }),
    );
  };

  return (
    <>
      <AuthenticatedLayout
        fullScreen={true}
        user={auth.user}
        header={
          <h2 className="font-semibold text-xl text-indigo-500 leading-tight">
            {set.title.replaceAll("_", " ")}
          </h2>
        }
      >
        <Head title={`Set - ${set.title}`} />

        <Container className="bg-white">
          <div className="bg-white overflow-hidden sm:rounded-md">
            <div className="flex justify- gap-4 text-md md:flex-row flex-col relative">
              {/*<div*/}
              {/*    ref={(element) => {*/}
              {/*        mainRefs.current[0] = element;*/}
              {/*    }}*/}
              {/*    className={*/}
              {/*        "min-w-fit md:w-1/4 w-full polygon-start translate-y-12 opacity-0"*/}
              {/*    }*/}
              {/*>*/}
              {/*    <TestLink>*/}
              {/*        <i className="fa-solid fa-tablet mr-3 text-xl text-gray-600 transition"></i>*/}
              {/*        Flashcards*/}
              {/*    </TestLink>*/}
              {/*</div>*/}

              <TestLink
                ref={(element) => {
                  mainRefs.current[1] = element;
                }}
                href={route("flashcards.learn", [set.id, set.title])}
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
                href={route("flashcards.test", [set.id, set.title])}
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
                href={route("flashcards.match", [set.id, set.title])}
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
              className="w-full relative flex flex-col sm:p-[4.5rem] bg-gradient-to-tl from-indigo-600 to-indigo-400 rounded-md shadow-lg"
              pauseOnHover={true}
              slide={!isEditing}
              onSlideChange={(index) => setCurrentIndex(index)}
            >
              {fetchedTranslations.map((translation, index) => (
                <>
                  <div
                    key={index}
                    className="perspective-[1000px] relative w-full h-[16rem] rounded-md"
                  >
                    <div
                      className={
                        "flip-card-inner relative mx-auto w-full h-full bg-white transition rounded-md ease-in-out duration-[1s] flex items-center text-3xl break-keep text-gray-600 font-bold " +
                        (cards.at(index).isRotated
                          ? "rotate-x-0"
                          : "rotate-x-180")
                      }
                    >
                      <RotatingCard
                        permissions={permissions}
                        isFront={true}
                        handleSetEditing={setIsEditing}
                        translation={{
                          ...translation,
                          type: "term",
                        }}
                        onClick={() => {
                          toggle(index);
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
                        permissions={permissions}
                        handleSetEditing={setIsEditing}
                        translation={{
                          ...translation,
                          type: "definition",
                        }}
                        onClick={() => {
                          toggle(index);
                        }}
                      />
                    </div>
                  </div>
                </>
              ))}
            </Carousel>
          </div>

          <div className="space-y-4 rounded-md">
            <div className="bg-gray-100 rounded-md px-4 py-2 flex gap-2 flex-col shadow-lg">
              <div
                ref={(element) => {
                  mainRefs.current[5] = element;
                }}
                className={
                  "polygon-start opacity-0 translate-y-12 flex justify-between"
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

            <div
              className={
                "grid md:grid-cols-2 grid-cols-1 gap-2 max-h-[20vh] overflow-y-scroll shadow-lg rounded-md bg-gray-100"
              }
            >
              {fetchedTranslations.map((translation, index) => (
                <div
                  className={"polygon-start opacity-0 translate-y-12"}
                  ref={(element) => (translationsRefs.current[index] = element)}
                >
                  <Translation
                    permissions={permissions}
                    set={set}
                    translation={translation}
                    handleSetChosenIndex={setChosenIndex}
                  />
                </div>
              ))}
            </div>
          </div>

          {permissions.canEdit && (
            <div
              className="mt-8 flex justify-center polygon-start opacity-0 translate-y-12"
              ref={(element) => (mainRefs.current[6] = element)}
            >
              <MainButton
                href={route("flashcards.showEdit", [set.id, set.title])}
                isRedirect={true}
                className={"bg-indigo-500 text-gray-100 hover:bg-indigo-600"}
              >
                Add or Remove Terms
              </MainButton>
            </div>
          )}
        </Container>
      </AuthenticatedLayout>
      <PopUpEdit
        modalId={"modal-1"}
        translation={fetchedTranslations.at(currentIndex)}
        set={set}
        cancelEditing={cancelEditing}
        handleFetchTranslations={fetchTranslations}
      />
      <PopUpEdit
        modalId={"modal-2"}
        translation={fetchedTranslations.at(chosenIndex)}
        set={set}
        cancelEditing={cancelEditing}
        handleFetchTranslations={fetchTranslations}
      />
      <SuccessModal feedback={feedback} />
    </>
  );
}