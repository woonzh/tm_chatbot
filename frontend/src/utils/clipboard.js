export async function copyToClipboard(text) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  document.body.appendChild(textarea);
  textarea.select();
  const result = document.execCommand("copy");
  document.body.removeChild(textarea);
  return result;
}
