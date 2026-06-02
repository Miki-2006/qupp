const Button = ({
  children,
  onClick,
  className = "",
  variant = "solid",
  size = "md",
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 disabled:opacity-60 disabled:cursor-not-allowed";

  const variants = {
    solid: "bg-gradient-to-r from-brand-500 via-brand-700 to-accent-500 text-white shadow-lg shadow-brand-200/60 hover:brightness-105",
    default: "bg-gradient-to-r from-brand-500 via-brand-700 to-accent-500 text-white shadow-lg shadow-brand-200/60 hover:brightness-105",
    ghost: "bg-transparent text-brand-700 hover:bg-brand-100/80",
    outline: "border border-brand-300 text-brand-800 bg-white/80 hover:bg-brand-50",
  };

  const sizes = {
    md: "px-4 py-2 text-sm",
    icon: "p-2 w-9 h-9",
  };

  return (
    <button
      onClick={onClick}
      className={`${base} ${variants[variant] || variants.solid} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
