import { ProgressBar } from "@/Pages/Flashcards/Partials/ProgressBar.jsx";
import { useContext, useLayoutEffect, useRef } from "react";
import Animation from "@/Pages/Animation.js";
import { Container } from "@/Components/Container.jsx";
import { useObserver } from "@/useObserver.js";
import { ThemeContext } from "@/ThemeContext.jsx";

export const SetProgression = ({
  progression,
  translationsCount,
  asSection = true,
}) => {
  const { properties } = useContext(ThemeContext);

  const progressBars = [
    { type: "known", color: "bg-lime-500", text: "Already learned" },
    { type: "unknown", color: "bg-gray-500", text: "Not learned yet" },
    {
      type: "difficult",
      color: "bg-amber-500",
      text: "Difficult",
    },
  ];

  let progressionRefs = useRef([]);

  useLayoutEffect(() => {
    useObserver(progressionRefs, "<", "<+.2", "<+.3");
  }, []);

  return asSection ? (
    <section
      className={
        properties.container +
        " 2xl:fixed 2xl:top-1/2 2xl:-translate-y-1/2 2xl:left-[calc((100vw-62rem)/4)] transform 2xl:-translate-x-1/2 md:max-w-[62rem] max-w-[76rem] mx-auto my-4 rounded-md "
      }
    >
      <div className={"text-lg text-indigo-500 font-bold p-4"}>
        Progression of this set
      </div>
      <div
        className={
          "rounded-md h-fit p-4 flex 2xl:flex-col sm:flex-row flex-col gap-2 justify-evenly"
        }
      >
        {progressBars.map((bar, index) => (
          <ProgressBar
            key={index}
            ref={(element) => (progressionRefs.current[index] = element)}
            length={Object.values(progression).at(index)}
            translationsLength={translationsCount}
            bar={bar}
          />
        ))}
      </div>
    </section>
  ) : (
    <div
      className={
        "absolute bottom-4 left-[4rem] flex flex-col md:flex-row gap-x-4"
      }
    >
      {progressBars.map((bar, index) => (
        <ProgressBar
          key={index}
          ref={(element) => (progressionRefs.current[index] = element)}
          length={Object.values(progression).at(index)}
          translationsLength={translationsCount}
          bar={bar}
        />
      ))}
    </div>
  );
};