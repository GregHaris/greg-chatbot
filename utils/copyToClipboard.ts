export const copyToClipboard = (
  text: string,
  successCallback: () => void,
  errorCallback: (error: Error) => void,
) => {
  navigator.clipboard
    .writeText(text)
    .then(successCallback)
    .catch(errorCallback);
};
