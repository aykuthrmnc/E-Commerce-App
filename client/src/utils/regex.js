export const testPositiveNumber = (e) => {
  return e
    // .replace(/^$/g, "1")
    .replace(/[^0-9]/g, "")
    // .replace(/(0.*?)0.*/g, "$1")
    .replace(/0.*?([0-9])/g, "$1")
    .replace(/([1-9][0-9])([0-9])/g, "$1")
};
