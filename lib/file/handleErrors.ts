import toastC from "../toast";
import getErrorMessage from "./getErrorMessage";

const handleError = (error: unknown, defaultMessage: string): void => {
  const message = getErrorMessage(error);
  console.error(defaultMessage, error);
  
  toastC({
    type: "error",
    data: message || defaultMessage,
  });
};


export default handleError;