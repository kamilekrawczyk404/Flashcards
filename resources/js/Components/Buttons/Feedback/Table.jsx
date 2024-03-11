import { SingleTableRow } from "@/Pages/Flashcards/SingleTableRow.jsx";

export const Table = ({ groups, data = [], className = "", ...props }) => {
  const columns = ["Id", "Group Name", "Term", "Definition"];

  console.log(groups);

  return (
    <div className="rounded-md max-h-[50vh] overflow-y-auto">
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
          {groups.map((group, groupIndex) => {
            if (group.hasOwnProperty("components")) {
              return group.components.map((component, componentIndex) => {
                if (
                  data.some((element) => element === component.translation.id)
                ) {
                  return (
                    <SingleTableRow
                      component={component}
                      key={`${groupIndex}.${componentIndex}`}
                    />
                  );
                }
              });
            } else {
              return group.translations.map((component, componentIndex) => {
                if (
                  data.some((element) => element === component.translation.id)
                ) {
                  return (
                    <SingleTableRow
                      component={component}
                      key={`${groupIndex}.${componentIndex}`}
                    />
                  );
                }
              });
            }
          })}
        </tbody>
      </table>
    </div>
  );
};