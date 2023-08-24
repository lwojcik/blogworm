module.exports = (input, maxLength) => {
  const strippedString = input.replace(/<[^>]*>/g, "");

  if (strippedString.length <= maxLength) {
    return strippedString;
  }

  const lastSpaceIndex = strippedString.lastIndexOf(" ", maxLength);
  const truncatedString =
    lastSpaceIndex > 0
      ? strippedString.substring(0, lastSpaceIndex) + "..."
      : strippedString.substring(0, maxLength) + "...";

  return truncatedString;
};
