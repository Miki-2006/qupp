const updateQuote = (quotes) => {    
  if (!quotes) {
    return;
  }
  localStorage.setItem("favorite-quotes", JSON.stringify(quotes));
  return true;
};

export default updateQuote;
