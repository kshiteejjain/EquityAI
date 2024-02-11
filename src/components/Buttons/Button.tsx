import './Button.css';
type Props = {
    title?: string;
    onClick?: () => void;
    type?: string;
    isSecondary?: boolean;
    isDangerous?: boolean;
    isGoBack?: boolean;
}
const Button = ({ title, onClick, isSecondary, isDangerous }: Props) => {
    const buttonClass = isDangerous
        ? 'buttonDangerous'
        : isSecondary
            ? 'buttonSecondary'
            : 'button';
    return (
        <button className={buttonClass} onClick={onClick}>
            {title}
        </button>
    )
};

export default Button;