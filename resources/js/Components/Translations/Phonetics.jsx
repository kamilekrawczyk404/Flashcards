export const Phonetics = ({ className = "", children, text, ...props }) => {
    return text && <span className={"text-base"}>{text}</span>;
};