import { Container } from "@/Components/Container";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { MainButton } from "@/Components/MainButton";
import GamesNavigation from "@/Components/Learning/GamesNavigation.jsx";
import { Feedback } from "@/Pages/Flashcards/Feedback.jsx";
import gsap from "gsap/all";
import { router } from "@inertiajs/react";
import Animation from "@/Pages/Animation.js";
import { RankingList } from "@/Components/Learning/RankingList.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Match = ({
  set,
  onlyTranslations,
  setsPerPage,
  bestResult,
  rankingList,
}) => {
  const [isStarted, setIsStarted] = useState(false);
  const [isFirstCard, setIsFirstCard] = useState(true);
  const [isSecondCard, setIsSecondCard] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [firstCardIndex, setFirstCardIndex] = useState(null);
  const [currentSetPage, setCurrentSetPage] = useState(1);
  const [cards, setCards] = useState(onlyTranslations);
  const [disabledCards, setDisabledCards] = useState([]);
  const [hiddenCards, setHiddenCards] = useState([]);
  const [refIndex, setRefIndex] = useState(null);
  const [isWrong, setIsWrong] = useState(false);
  const [userAnswers, setUserAnswers] = useState({
    correct: 0,
    incorrect: {
      count: 0,
      translations: [],
    },
  });
  const refs = useRef([]);
  const cardRefs = useRef([]);
  const additionalSeconds = 10;
  const SECONDS = 500;
  const styling =
    "aspect-square text-center text-xl font-medium shadow-md transition rounded-md text-gray-700 polygon-y-start hover:scale-[1.05] hover:bg-indigo-500 bg-white";

  useEffect(() => {
    let timer;

    if (!isEnd)
      timer = setInterval(() => {
        setSeconds((prev) => (isStarted ? prev + 1 : 0));
      }, 1000);
    else router.post(`/store_new_match_time/${set.id}`, { score: seconds });

    if (hiddenCards.length === cards.length / 2) {
      setIsEnd(true);
      setIsStarted(null);
      clearInterval(timer);
    }

    return () => {
      clearInterval(timer);
    };
  }, [currentSetPage, cards, isStarted, hiddenCards]);

  useLayoutEffect(() => {
    const infoAnimation = new Animation(refs.current);
    const cardsAnimation = new Animation(cardRefs.current);

    infoAnimation.animateAll("<", "", "<+.1");
    cardsAnimation.animateAll("<", "", "<+.1");
  }, [isStarted, currentSetPage]);

  const focusCard = (card) => {
    let data = [...cards];
    data.splice(
      data.findIndex((d) => d === card),
      1,
      {
        ...card,
        isFocused: true,
        isDisabled: true,
      },
    );
    setCards(data);
  };

  const unfocusCards = (secondCard) => {
    cardRefs.current[secondCard.refId].classList.add(
      "!bg-red-500",
      "animate-wrong-match",
      "text-white",
    );
    cardRefs.current[refIndex].classList.replace(
      "bg-indigo-500",
      "!bg-red-500",
    );

    cardRefs.current[refIndex].classList.add(
      "animate-wrong-match",
      "text-white",
    );

    setTimeout(() => {
      setSeconds((prev) => prev + 1);

      let data = [...cards];
      data.splice(firstCardIndex, 1, {
        ...data[firstCardIndex],
        isFocused: false,
        isDisabled: false,
      });
      data.splice(
        data.findIndex((d) => d === secondCard),
        1,
        { ...secondCard, isFocused: false },
      );
      setCards(data);
      setIsSecondCard(false);
      setFirstCardIndex(null);

      cardRefs.current
        .at(secondCard.refId)
        .classList.remove("animate-wrong-match", "text-white");

      cardRefs.current[refIndex].classList.remove(
        "animate-wrong-match",
        "text-white",
      );
      cardRefs.current[secondCard.refId].classList.replace(
        "!bg-red-500",
        "bg-white",
      );
      cardRefs.current[refIndex].classList.replace("!bg-red-500", "bg-white");
    }, SECONDS);
  };

  const addIncorrectTranslations = () => {
    const translations = cards.filter((c) => c.id === cards[firstCardIndex].id);
    let data = [...userAnswers.incorrect.translations];
    if (!data.some((d) => d.id === cards[firstCardIndex].id)) {
      data.push({
        id: translations[0].id,
        term: { word: translations[0].text },
        definition: { word: translations[1].text },
      });
    }
    data.sort((a, b) => a.id - b.id);
    setUserAnswers((prev) => {
      return {
        ...prev,
        incorrect: {
          count: prev.incorrect.count + 1,
          translations: data,
        },
      };
    });
  };

  const hideCards = (card) => {
    cardRefs.current[refIndex].classList.replace(
      "bg-indigo-500",
      "bg-lime-500",
    );
    cardRefs.current[card.refId].classList.replace("bg-white", "bg-lime-500");
    cardRefs.current[card.refId].classList.add("text-white");
    cardRefs.current[card.refId].classList.remove("hover:bg-indigo-500");
    cardRefs.current[refIndex].classList.remove("hover:bg-indigo-500");

    setTimeout(() => {
      setSeconds((prev) => prev + 1);
      setFirstCardIndex(null);
      setDisabledCards((prev) => {
        return [...prev, card.id];
      });
      setHiddenCards((prev) => {
        return [...prev, card.id];
      });
      setIsSecondCard(false);
    }, SECONDS);
  };

  const checkCards = (currentCard, index) => {
    if (isFirstCard) {
      cardRefs.current[currentCard.refId].classList.replace(
        "bg-white",
        "bg-indigo-500",
      );
      cardRefs.current[currentCard.refId].classList.add("text-white");
      setIsFirstCard(false);
      setFirstCardIndex(index);
      setRefIndex(currentCard.refId);
    } else {
      setIsSecondCard(true);

      if (
        cards[firstCardIndex].id === currentCard.id &&
        firstCardIndex !== index
      ) {
        hideCards(currentCard);
        if (
          !userAnswers.incorrect.translations.some(
            (translation) => currentCard.id === translation.id,
          )
        )
          setUserAnswers((prev) => ({
            ...prev,
            correct: prev.correct + 1,
          }));
        if (
          hiddenCards.length > 0 &&
          hiddenCards.length % setsPerPage === setsPerPage - 1
        ) {
          setCurrentSetPage((prev) => prev + 1);
        }
      } else {
        addIncorrectTranslations();
        unfocusCards(currentCard);
        setIsWrong(true);
        setSeconds((prev) => prev + additionalSeconds);

        setTimeout(() => {
          setSeconds((prev) => prev + 1);
          setIsWrong(false);
        }, SECONDS);
      }
      setIsFirstCard(true);
    }
  };

  return (
    <>
      <GamesNavigation set={set}>
        <span className="text-indigo-500 font-bold">Match</span>
      </GamesNavigation>
      <Container>
        {!isStarted && !isEnd && (
          <div
            className="mx-auto flex flex-col gap-8 m-4 items-center relative opacity-0 polygon-start translate-y-12"
            ref={(element) => {
              refs.current[0] = element;
            }}
          >
            <div>
              <RankingList rankings={rankingList} />
            </div>
            <span className="text-2xl text-indigo-500 font-bold bg-white p-2 rounded-md">
              Ready to play?
            </span>
            <span className="text-gray-700 text-xl md:max-w-[35%] text-center border-b-4 border-gray-300 pb-2">
              Match all the terms with their definitions as quick as possible.
              Try avoiding incorrect matches. They add extra time!
            </span>
            <div
              className={"polygon-start translate-y-12"}
              ref={(element) => {
                refs.current[1] = element;
              }}
            >
              <MainButton
                className={"bg-indigo-500 hover:bg-indigo-600 text-gray-100"}
                onClick={() => setIsStarted(true)}
              >
                Start Game
              </MainButton>
            </div>
          </div>
        )}
        {isStarted && (
          <>
            <div className="mb-4 flex flex-col gap-2">
              <div
                style={{
                  width:
                    Math.round(
                      (hiddenCards.length / (cards.length / 2)) * 100,
                    ) + "%",
                }}
                className="h-4 bg-indigo-500 transition-all duration-1000 ease-out rounded-md"
              ></div>
              <div
                className={
                  "mx-auto text-xl font-semibold w-fit p-2 rounded-md flex items-center gap-2 relative " +
                  (isWrong
                    ? "bg-red-500 before:-m-3 before:transition before:absolute before:left-full before:bottom-full before:text-base before:content-['+10sec'] before:z-10 before:bg-gray-700 before:text-white before:p-1 before:rounded-md"
                    : "bg-amber-500")
                }
              >
                <FontAwesomeIcon
                  icon="fa-solid fa-hourglass-start"
                  className={"text-md transform animate-hourglass"}
                />
                {seconds}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {cards.map((card, index) => {
                if (currentSetPage === card.page) {
                  return (
                    <button
                      ref={(element) => {
                        cardRefs.current[card.refId] = element;
                      }}
                      disabled={
                        disabledCards.includes(card.id) ||
                        isSecondCard ||
                        card.isDisabled
                      }
                      key={index}
                      onClick={() => {
                        checkCards(card, index);
                        focusCard(card);
                      }}
                      className={
                        styling +
                        (hiddenCards.includes(card.id) ? " invisible" : " ")
                      }
                    >
                      {card.text}
                    </button>
                  );
                }
              })}
            </div>
          </>
        )}
        {isEnd && (
          <Feedback
            set={set}
            answersResults={userAnswers}
            barWidth={Math.round(
              (userAnswers.correct / (cards.length / 2)) * 100,
              2,
            )}
            length={cards.length / 2}
            routeName={"match"}
            finishedTime={seconds}
            bestResult={bestResult}
          />
        )}
      </Container>
    </>
  );
};
export default Match;