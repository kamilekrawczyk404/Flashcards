export const RankingList = ({ className = "", rankings, ...props }) => {
    const stageStyling = ["text-amber-500", "text-gray-300", "text-amber-700"];

    return (
        <div className={"bg-white p-4 rounded-md min-w-[20rem] " + className}>
            <div
                className={
                    "flex flex-col items-center font-bold text-indigo-500 text-xl mb-4"
                }
            >
                <i className="fa-solid fa-ranking-star text-3xl"></i>
                <p>Rankings</p>
            </div>
            <div className={"space-y-2 relative text-lg"}>
                {!rankings.length && (
                    <div>
                        <p>Nobody has finished this game yet.</p>
                        <p
                            className={
                                "bg-gray-100 p-2 text-indigo-500 w-fit mx-auto rounded-sm shadow-sm font-bold"
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
                            "bg-gray-100 p-2 flex gap-4 items-center rounded-md shadow-sm"
                        }
                    >
                        {stageStyling[index] && (
                            <i
                                className={`fa-solid fa-medal text-lg ${stageStyling[index]}`}
                            ></i>
                        )}
                        <span className={""}>{ranking.name}</span>
                        <span
                            className={
                                "bg-white px-1 rounded-md text-gray-700 font-bold"
                            }
                        >
                            {ranking.matchingTime}s
                        </span>
                        <span className={"float-right font-bold"}>
                            #{index + 1}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};