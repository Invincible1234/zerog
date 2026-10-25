/** Read Python-exported JSON without changing the source bytes.
 * Non-finite bare numeric tokens become null (unavailable), never zero.
 * Quoted strings, including literal mentions of NaN, remain untouched.
 * @param {string} text
 */
export function parseSavedJSON(text) {
  return JSON.parse(
    text.replace(/"(?:[^"\\]|\\.)*"|\bNaN\b|-?\bInfinity\b/g, (token) =>
      token.startsWith('"') ? token : "null",
    ),
  );
}
