type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button(props: ButtonProps) {
    const { className, children, ...otherProps } = props;
    return (
        <button
            className={`px-2.5 py-1 border border-slate-300 rounded-md active:scale-95 transition-all duration-75 ${className}`}
            {...otherProps}
        >
            {children}
        </button>
    );
}
