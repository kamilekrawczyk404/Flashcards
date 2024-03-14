import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMedal, faRankingStar } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { ThemeContext } from "@/ThemeContext.jsx";

export const RankingList = ({ className = "", rankings, ...props }) => {
  const { properties } = useContext(ThemeContext);
  const stageStyling = ["text-amber-500", "text-gray-300", "text-amber-700"];

  return (
    <div
      className={
        properties.background + " p-4 rounded-md min-w-[20rem] " + className
      }
    >
      <div
        className={
          "flex flex-col items-center font-bold text-indigo-500 text-xl mb-4"
        }
      >
        <FontAwesomeIcon icon={faRankingStar} className={"text-3xl"} />
        <p>Rankings</p>
      </div>
      <div className={"space-y-2 relative text-lg"}>
        {!rankings.length && (
          <div className={"space-y-2"}>
            <p className={properties.text}>
              Nobody has finished this game yet.
            </p>
            <p
              className={
                properties.container +
                " p-2 text-indigo-500 w-fit mx-auto rounded-sm shadow-sm font-bold"
              }
            >
              Become a new leader!
            </p>
          </div>
        )}
        {rankings.map((ranking, index) => (
          <div
            key={index}
            className={
              properties.container +
              " " +
              properties.text +
              " p-2 flex gap-4 items-center rounded-md shadow-sm"
            }
          >
            {stageStyling[index] && (
              <FontAwesomeIcon
                icon={faMedal}
                className={`text-lg ${stageStyling[index]}`}
              />
            )}
            <span>{ranking.name}</span>
            <span
              className={properties.background + " px-1 rounded-md font-bold"}
            >
              {ranking.matching_time}s
            </span>
            <span className={"float-right font-bold"}>#{index + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
};