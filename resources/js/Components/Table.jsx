import { useLayoutEffect, useRef } from "react";
import gsap from "gsap/all";
import TranslationsData from "@/TranslationsData.js";

export const Table = ({
    columns = [],
    data = [],
    className = "",
    isPresentingTranslations = false,
    ...props
}) => {
    let refs = useRef([]);

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
                                {columnName.toLowerCase() === "id"
                                    ? "index"
                                    : columnName}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {!isPresentingTranslations
                        ? columns.map((element, index) => (
                              <tr
                                  className="bg-white border-b transition"
                                  key={index}
                                  ref={(element) => {
                                      refs.current[index] = element;
                                  }}
                              >
                                  {columns.map((columnName, index) => (
                                      <td
                                          key={index}
                                          scope="row"
                                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap last-of-type:rounded-bl-md last-of-type:rounded-br-md"
                                      >
                                          {element[columnName]}
                                      </td>
                                  ))}
                              </tr>
                          ))
                        : data.map((translation, index) => (
                              <tr
                                  className="bg-white border-b transition"
                                  key={index}
                                  ref={(element) => {
                                      refs.current[index] = element;
                                  }}
                              >
                                  <td
                                      key={index}
                                      scope="row"
                                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap last-of-type:rounded-bl-md last-of-type:rounded-br-md"
                                  >
                                      {translation.id}
                                  </td>
                                  <td
                                      key={index + 1}
                                      scope="row"
                                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap last-of-type:rounded-bl-md last-of-type:rounded-br-md"
                                  >
                                      {translation.term.word}
                                  </td>
                                  <td
                                      key={index + 2}
                                      scope="row"
                                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap last-of-type:rounded-bl-md last-of-type:rounded-br-md"
                                  >
                                      {translation.definition.word}
                                  </td>
                              </tr>
                          ))}
                </tbody>
            </table>
        </div>
    );
};