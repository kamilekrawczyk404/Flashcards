import { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";

export const useGetGroups = (
  set,
  isChoosingGroups,
  componentProperties,
  url,
) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const auth = usePage().props.auth;

  useEffect(() => {
    if (!isChoosingGroups) {
      setLoading(true);

      axios({
        method: "get",
        url: url,
        params: {
          user_id: auth.user.id,
          set_id: set.id,
          groups: componentProperties.groupsProperties.filter(
            (property) => Object.values(property)[0] === true,
          ),
          options: Object.fromEntries(
            Object.entries(componentProperties).filter(
              ([key, value]) => typeof value === "boolean",
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

  return { groups, setGroups, loading };
};