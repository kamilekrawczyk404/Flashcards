export const SingleTableRow = ({ component }) => {
  return (
    <tr className="bg-white border-b transition">
      <td
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap last-of-type:rounded-bl-md last-of-type:rounded-br-md"
      >
        {component.translation.id}
      </td>{" "}
      <td
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap last-of-type:rounded-bl-md last-of-type:rounded-br-md"
      >
        {component.translation.group_name}
      </td>
      <td
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap last-of-type:rounded-bl-md last-of-type:rounded-br-md"
      >
        {component.translation.term}
      </td>
      <td
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap last-of-type:rounded-bl-md last-of-type:rounded-br-md"
      >
        {component.translation.definition}
      </td>
    </tr>
  );
};