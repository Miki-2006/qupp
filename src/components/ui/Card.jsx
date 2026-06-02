const Card = ({ children, className = "" }) => {
  return (
    <div className={`rounded-xl shadow-lg shadow-brand-200/30 bg-white border border-brand-100 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
