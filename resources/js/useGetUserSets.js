import { useEffect, useState } from "react";

export const useGetUserSets = (userId) => {
  const [loading, setLoading] = useState(true);
  const [sets, setSets] = useState([]);

  useEffect(() => {
    axios
      .get(`/get-user-sets/${userId}`)
      .then((response) => {
        setLoading(false);
        setSets(response.data);
      })
      .catch((error) => console.log(`Something went wrong ${error.message}`));
  }, []);

  return { loading, sets };
};