export function camelCaseToCapitalizedString(text) {
  // Add a space before any uppercase letter preceded by a lowercase letter
  const spacedText = text.replace(/([a-z])([A-Z])/g, '$1 $2');
  // Capitalize the first letter of each word
  const capitalizedText = spacedText.replace(/\b\w/g, (match) =>
    match.toUpperCase()
  );
  return capitalizedText;
}
