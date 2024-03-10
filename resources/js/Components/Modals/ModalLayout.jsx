export const ModalLayout = ({ modalId, children }) => {
  return (
    <div
      className="micromodal-slide modal m-10 absolute z-10"
      id={modalId}
      aria-hidden="true"
    >
      <div
        className="modal__overlay fixed top-0 left-0 right-0 bg-opacity-gray bottom-0 flex items-center justify-center"
        tabIndex="-1"
        data-micromodal-close={modalId}
      >
        <div
          className="modal__container flex gap-6 flex-col bg-white lg:w-[76rem] w-full sm:m-6 m-0 p-4 rounded-md overflow-y-auto border-b relative z-10"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-1-title"
        >
          {children}
        </div>
      </div>
    </div>
  );
};