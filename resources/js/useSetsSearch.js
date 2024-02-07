import { useState, useEffect } from "react";
import axios from "axios";

export const useSetsSearch = (searching, currentPage, filters) => {
    const [hasMore, setHasMore] = useState(true);
    const [progress, setProgress] = useState(false);
    const [sets, setSets] = useState([]);

    useEffect(() => {
        setSets([]);
        setProgress(false);
        setHasMore(true);
    }, [searching, filters]);

    useEffect(() => {
        if (searching !== "") {
            let cancel;

            setProgress(true);

            axios({
                method: "get",
                url: "/search-in-sets",
                params: {
                    currentPage: currentPage,
                    searching: searching.replaceAll(" ", "_"),
                    filters: {
                        languages: filters.languages,
                    },
                },
                cancelToken: new axios.CancelToken((c) => (cancel = c)),
            })
                .then((response) => {
                    setSets((prev) => [
                        ...new Set([...prev, ...response.data]),
                    ]);
                    setHasMore(response.data.length > 0);
                    setProgress(false);
                })
                .catch((error) => {
                    if (axios.isCancel(error)) return;
                    console.log(error);
                });

            return () => {
                cancel();
            };
        }
    }, [currentPage, searching, filters]);

    return { progress, hasMore, sets };
};