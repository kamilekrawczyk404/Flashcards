import { Container } from "@/Components/Container";
import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { MainButton } from "@/Components/Buttons/MainButton.jsx";
import StudyNavigation from "@/Components/Learning/StudyNavigation.jsx";
import { Feedback } from "@/Pages/Flashcards/Feedback.jsx";
import gsap from "gsap/all";
import { router } from "@inertiajs/react";
import Animation from "@/Pages/Animation.js";
import { RankingList } from "@/Components/Learning/RankingList.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFeedbackResults } from "@/useFeedbackResults.js";
import gradient from "@material-tailwind/react/theme/components/timeline/timelineIconColors/gradient.js";
import { faHourglassStart } from "@fortawesome/free-solid-svg-icons";
import { ThemeContext } from "@/ThemeContext.jsx";

const Match = ({
  set,
  translations,
  translationsPerPage,
  bestResult,
  rankingList,
  groups,
}) => {
  const { properties } = useContext(ThemeContext);
  const [isStarted, setIsStarted] = useState(false);
  const [isFirstCard, setIsFirstCard] = useState(true);
  const [isSecondCard, setIsSecondCard] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [firstCardIndex, setFirstCardIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [disabledCards, setDisabledCards] = useState([]);
  const [hiddenCards, setHiddenCards] = useState([]);
  const [refIndex, setRefIndex] = useState(null);
  const [isWrong, setIsWrong] = useState(false);
  const [cards, setCards] = useState(translations);
  const [feedbackData, setFeedbackData] = useState({});

  const refs = useRef([]);
  const cardRefs = useRef([]);
  const additionalSeconds = 10;
  const SECONDS = 500;
  const styling =
    properties.text +
    " " +
    properties.background +
    " aspect-square text-center text-xl font-medium shadow-md transition rounded-md polygon-y-start hover:scale-[1.05] hover:bg-indigo-500 ";

  useEffect(() => {
    let timer;

    if (!isEnd)
      timer = setInterval(() => {
        setSeconds((prev) => (isStarted ? prev + 0.01 : 0));
      }, 10);
    else
      router.post(`/store_new_match_time/${set.id}`, {
        score: seconds.toFixed(2),
      });

    if (hiddenCards.length === cards.length / 2) {
      setIsEnd(true);
      setIsStarted(null);
      clearInterval(timer);
    }

    return () => {
      clearInterval(timer);
    };
  }, [currentPage, cards, isStarted, hiddenCards]);

  useLayoutEffect(() => {
    const infoAnimation = new Animation(refs.current);
    const cardsAnimation = new Animation(cardRefs.current);

    infoAnimation.animateAll("<", "", "<+.1");
    cardsAnimation.animateAll("<", "", "<+.1");
  }, [isStarted, currentPage]);

  const focusCard = (card) => {
    let data = [...cards];
    data.splice(
      data.findIndex((t) => t === card),
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
    cardRefs.current[secondCard.ref_id].classList.add(
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
        .at(secondCard.ref_id)
        .classList.remove("animate-wrong-match", "text-white");

      cardRefs.current[refIndex].classList.remove(
        "animate-wrong-match",
        "text-white",
      );
      cardRefs.current[secondCard.ref_id].classList.replace(
        "!bg-red-500",
        properties.background.split(" ")[0],
      );
      cardRefs.current[refIndex].classList.replace(
        "!bg-red-500",
        properties.background.split(" ")[0],
      );
    }, SECONDS);
  };

  const hideCards = (card) => {
    cardRefs.current[refIndex].classList.replace(
      "bg-indigo-500",
      "bg-lime-500",
    );
    cardRefs.current[card.ref_id].classList.replace(
      properties.background.split(" ")[0],
      "bg-lime-500",
    );
    cardRefs.current[card.ref_id].classList.add("text-white");
    cardRefs.current[card.ref_id].classList.remove("hover:bg-indigo-500");
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
      cardRefs.current[currentCard.ref_id].classList.replace(
        properties.background.split(" ")[0],
        "bg-indigo-500",
      );
      cardRefs.current[currentCard.ref_id].classList.add("text-white");
      setIsFirstCard(false);
      setFirstCardIndex(index);
      setRefIndex(currentCard.ref_id);
    } else {
      setIsSecondCard(true);

      if (
        !Object.keys(feedbackData) ||
        !feedbackData?.incorrectIds?.some(
          (id) => id === currentCard.translation_id,
        )
      )
        setFeedbackData(
          useFeedbackResults(
            feedbackData,
            [],
            0,
            0,
            translations.at(firstCardIndex),
            currentCard,
            true,
          ),
        );

      if (
        cards[firstCardIndex].id === currentCard.id &&
        firstCardIndex !== index
      ) {
        hideCards(currentCard);

        if (
          hiddenCards.length > 0 &&
          hiddenCards.length % (translationsPerPage - 1) === 0
        ) {
          setCurrentPage((prev) => prev + 1);
        }
      } else {
        // addIncorrectTranslations();
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
      <StudyNavigation set={set}>
        <span className="text-indigo-500 font-bold">Match</span>
      </StudyNavigation>
      <Container className={"mt-4"}>
        {!isStarted && !isEnd && (
          <div
            className="mx-auto flex flex-col gap-8 m-4 items-center relative opacity-0 polygon-start translate-y-12"
            ref={(element) => {
              refs.current[0] = element;
            }}
          >
            <RankingList rankings={rankingList} />
            <p className={"text-2xl text-indigo-500 font-bold p-2 rounded-md"}>
              Ready to play?
            </p>
            <p
              className={
                properties.text +
                " text-xl md:max-w-[35%] text-center border-b-4 border-gray-300 pb-2"
              }
            >
              Match all the terms with their definitions as quick as possible.
              Try avoiding incorrect matches. They add extra time!
            </p>
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
                  "mx-auto text-xl p-2 rounded-md flex items-center gap-2 relative w-fit " +
                  (isWrong
                    ? "bg-red-500 before:-m-3 before:transition before:absolute before:left-full before:bottom-full before:text-base before:content-['+10sec'] before:z-10 before:bg-gray-700 before:text-white before:p-1 before:rounded-md"
                    : "bg-amber-500")
                }
              >
                <FontAwesomeIcon
                  icon={faHourglassStart}
                  className={
                    "text-md transform animate-hourglass font-semibold"
                  }
                />
                <span
                  className={
                    "w-fit sm:max-w-[10vw] overflow-hidden overflow-ellipsis font-mono"
                  }
                >
                  {seconds.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="grid sm:grid-cols-4  grid-cols-2 gap-4">
              {cards.map((card, cardIndex) => {
                if (currentPage === card.page) {
                  return (
                    <button
                      ref={(element) => {
                        cardRefs.current[card.ref_id] = element;
                      }}
                      disabled={
                        disabledCards.includes(card.id) ||
                        isSecondCard ||
                        card.isDisabled
                      }
                      key={cardIndex}
                      onClick={() => {
                        checkCards(card, cardIndex);
                        focusCard(card);
                      }}
                      className={
                        styling +
                        (hiddenCards.includes(card.id) ? " invisible" : " ")
                      }
                    >
                      {card.word}
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
            answersResults={feedbackData}
            routeName={"match"}
            finishedTime={seconds.toFixed(2)}
            bestResult={bestResult}
            groups={groups}
          />
        )}
      </Container>
    </>
  );
};
export default Match;