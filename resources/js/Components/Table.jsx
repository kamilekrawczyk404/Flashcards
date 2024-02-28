import { useLayoutEffect, useRef } from "react";
import gsap from "gsap/all";
import TranslationsData from "@/TranslationsData.js";

export const Table = ({ groups, data = [], className = "", ...props }) => {
  let refs = useRef([]);

  const columns = ["Id", "Group Name", "Term", "Definition"];

  return (
    <div className="rounded-md max-h-[25vh] overflow-y-auto">
      <table
        className={"w-full text-left text-gray-500 " + className}
        {...props}
      >
        <thead className="uppercase relative">
          <tr>
            {columns.map((columnName, index) => (
              <th
                key={index}
                scope="col"
                className="px-6 py-3 first-of-type:rounded-tl-md last-of-type:rounded-tr-md text-transparent bg-indigo-500 text-white"
              >
                {columnName.toLowerCase() === "id" ? "index" : columnName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {groups.map((group, groupIndex) =>
            group.translations.map((translation, translationIndex) => {
              if (translation.id === data[translationIndex])
                return (
                  <tr
                    className="bg-white border-b transition"
                    key={`${groupIndex}.${translationIndex}`}
                    ref={(element) => {
                      refs.current[index] = element;
                    }}
                  >
                    <td
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap last-of-type:rounded-bl-md last-of-type:rounded-br-md"
                    >
                      {translation.id + 1}
                    </td>{" "}
                    <td
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap last-of-type:rounded-bl-md last-of-type:rounded-br-md"
                    >
                      {translation.group}
                    </td>
                    <td
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap last-of-type:rounded-bl-md last-of-type:rounded-br-md"
                    >
                      {translation.term}
                    </td>
                    <td
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap last-of-type:rounded-bl-md last-of-type:rounded-br-md"
                    >
                      {translation.definition}
                      <span className={"text-right"}>fav</span>
                    </td>
                  </tr>
                );
            }),
          )}
        </tbody>
      </table>
    </div>
  );
};