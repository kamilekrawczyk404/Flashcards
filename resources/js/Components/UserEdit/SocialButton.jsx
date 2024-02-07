export const SocialButton = ({
    activeSocial,
    handleSetActiveSocial,
    handleDeleteSocial,
    usedInForm = false,
    hasRemovingButton = false,
    element,
    isDeleting = false,
    ...props
}) => {
    const style = `aspect-square fa-brands fa-square-${element.name} h-[2.875rem] mt-1 text-${element.color}`;

    return usedInForm ? (
        <button
            {...props}
            type={"button"}
            className={
                activeSocial === element.name
                    ? "relative before:absolute before:bg-indigo-500 before:-bottom-2 before:left-1/2 before:transform before:-translate-x-1/2 before:w-3 before:aspect-square before:rounded-full before:transition"
                    : ""
            }
            onClick={() => {
                handleSetActiveSocial(element.name);
            }}
        >
            <i className={style}></i>
        </button>
    ) : (
        <>
            <div {...props} className={"relative "}>
                <i className={style}></i>
                <button
                    disabled={isDeleting}
                    type="button"
                    className={
                        "absolute -top-1 -right-2 rounded-full bg-red-600 w-6 aspect-square flex items-center justify-center"
                    }
                    onClick={(e) => {
                        handleDeleteSocial(e, element.name);
                    }}
                >
                    <i className="fa-solid fa-xmark text-gray-100"></i>
                </button>
            </div>
        </>
    );
};