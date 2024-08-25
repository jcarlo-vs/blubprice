const formatValue = (value) => {
  if (value >= 1e9) {
    // Convert value to billions
    return `${(value / 1e9).toFixed(1)}B`;
  } else if (value >= 1e6) {
    // Convert value to millions
    return `${(value / 1e6).toFixed(1)}M`;
  } else if (value >= 1e3) {
    // Convert value to thousands
    return `${(value / 1e3).toFixed(1)}K`;
  } else {
    // For values less than 1,000, display as is
    return `${value.toFixed(1)}`;
  }
};

export default formatValue;
