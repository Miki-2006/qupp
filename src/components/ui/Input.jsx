const Input = ({ className = "", ...props }) => {
  return (
    <input
      className={`w-full rounded-xl border border-brand-200 bg-white/90 px-4 py-2 text-slate-800 shadow-sm shadow-brand-100/40 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200 ${className}`}
      {...props}
    />
  );
};

export default Input;
