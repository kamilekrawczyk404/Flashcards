import { ThemeContext } from "@/ThemeContext.jsx";
import { useContext } from "react";

export const SingleTableRow = ({ component }) => {
  const { properties } = useContext(ThemeContext);
  console.log(component);
  return (
    <tr
      className={
        properties.background + " " + properties.text + " border-b transition"
      }
    >
      <td
        scope="row"
        className="px-6 py-4 font-medium whitespace-nowrap last-of-type:rounded-bl-md last-of-type:rounded-br-md"
      >
        {component?.translation?.id ?? component.id}
      </td>{" "}
      <td
        scope="row"
        className="px-6 py-4 font-medium whitespace-nowrap last-of-type:rounded-bl-md last-of-type:rounded-br-md"
      >
        {component?.translation?.group_name ?? component.group_name}
      </td>
      <td
        scope="row"
        className="px-6 py-4 font-medium whitespace-nowrap last-of-type:rounded-bl-md last-of-type:rounded-br-md"
      >
        {component?.translation?.term ?? component.term}
      </td>
      <td
        scope="row"
        className="px-6 py-4 font-medium whitespace-nowrap last-of-type:rounded-bl-md last-of-type:rounded-br-md"
      >
        {component?.translation?.definition ?? component.definition}
      </td>
    </tr>
  );
};