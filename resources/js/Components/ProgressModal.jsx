import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export const ProgressModal = ({isVisible, text = ""}) => {

    // Progress bar based on progress from CreateInertiaApp

    return (
        <>
            {isVisible && (
                <div
                    className={"absolute top-0 left-0 w-full h-full bg-gray-100"}
                >

                    <div className={'absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center bg-amber-500 p-4 rounded-md'}>
                        <FontAwesomeIcon icon="fa-solid fa-hourglass-start" className={'animate-hourglass text-2xl mr-4'} />
                        <p className={'text-2xl text-gray-700'}>
                            <span className={'font-bold'}>Wait a second</span>.{text}
                        </p>
                    </div>
                </div>
            )}
        </>
    )
}