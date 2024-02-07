import { forwardRef } from "react";

const ProgressBar = forwardRef((props, ref) => {
    let stylingNotClicked = "left-0 animate-time-line " + props.className;
    let stylingClicked = "left-0 transition-all " + props.className;

    return (
        <div
            ref={ref}
            className={props.isClicked ? stylingClicked : stylingNotClicked}
        ></div>
    );
});
export default ProgressBar;