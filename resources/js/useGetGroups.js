import { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";

export const useGetGroups = (set, isChoosingGroups, componentProperties) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const auth = usePage().props.auth;

  useEffect(() => {
    if (!isChoosingGroups) {
      setLoading(true);

      axios({
        method: "get",
        url: `/get-groups-for-learning/`,
        params: {
          user_id: auth.user.id,
          set_id: set.id,
          // Get only groups names
          // [group_name: ..., group_name: ..., ..., answerWith: ...]
          groups: Object.fromEntries(
            Object.entries(componentProperties).filter(
              ([key, value]) => value === true,
            ),
          ),
        },
      })
        .then((response) => {
          setLoading(false);
          setGroups(response.data);
        })
        .catch((error) => console.log("Something went wront: ", error.message));
    }
  }, [isChoosingGroups]);

  return { groups, loading };
};