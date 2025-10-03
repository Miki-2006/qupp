const Card = ({ children, className = "" }) => {
  return (
    <div className={`rounded-xl shadow-md bg-white ${className}`}>
      {children}
    </div>
  );
};

export default Card;
