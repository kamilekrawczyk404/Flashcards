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

  // console.log(
  //   !componentProperties.groupsProperties.hasOwnProperty("settings_on")
  //     ? componentProperties.groupsProperties.filter((groupProperty) =>
  //         Object.entries(groupProperty).filter(([property, value]) => {
  //           return property === "group_name" && value === true;
  //         }),
  //       )
  //     : componentProperties.groupsProperties,
  // );

  useEffect(() => {
    if (!isChoosingGroups) {
      setLoading(true);

      axios({
        method: "get",
        url: url,
        params: {
          user_id: auth.user.id,
          set_id: set.id,
          groups: !componentProperties.groupsProperties.hasOwnProperty(
            "settings_on",
          )
            ? componentProperties.groupsProperties.filter((groupProperty) =>
                Object.entries(groupProperty).filter(([property, value]) => {
                  return property === "group_name" && value === true;
                }),
              )
            : componentProperties.groupsProperties,
          options: !componentProperties.hasOwnProperty("onlyDifficult")
            ? Object.fromEntries(
                Object.entries(componentProperties).filter(
                  ([key, value]) => typeof value === "boolean",
                ),
              )
            : { onlyDifficult: componentProperties.onlyDifficult },
        },
      })
        .then((response) => {
          setLoading(false);
          setGroups(response.data);
        })
        .catch((error) =>
          console.error("Something went wrong: ", error.message),
        );
    }
  }, [isChoosingGroups]);

  return { groups, setGroups, loading };
};