import { MainButton } from "@/Components/Buttons/MainButton.jsx";
import { useContext } from "react";
import { ThemeContext } from "@/ThemeContext.jsx";

export const ModalButtons = ({ modalId, cancelEditing = () => {} }) => {
  const { properties } = useContext(ThemeContext);

  return (
    <div className={"self-end"}>
      <button
        type={"button"}
        onClick={(e) => {
          e.preventDefault();
          MicroModal.close(modalId);
          cancelEditing();
        }}
        className={`${properties.text} border-b-2 tracking-widest mr-8 border-indigo-500`}
      >
        Cancel
      </button>
      <MainButton
        onClick={() => {
          MicroModal.close(modalId);
          cancelEditing();
        }}
        className={"bg-indigo-500 text-gray-100 hover:bg-indigo-600"}
      >
        Save
      </MainButton>
    </div>
  );
};