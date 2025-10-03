const Button = ({
  children,
  onClick,
  className = "",
  variant = "solid",
  size = "md",
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center font-medium transition-colors focus:outline-none";

  const variants = {
    solid: "bg-purple-600 text-white hover:bg-purple-700",
    ghost: "bg-transparent text-purple-600 hover:bg-purple-100",
  };

  const sizes = {
    md: "px-4 py-2 text-sm",
    icon: "p-2 w-9 h-9",
  };

  return (
    <button
      onClick={onClick}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
