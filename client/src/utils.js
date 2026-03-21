export const formatDateInput = (value) => {
  if (!value) {
    return "";
  }

  return new Date(value).toISOString().slice(0, 10);
};

export const formatDateDisplay = (value, options = {}) => {
  if (!value) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    ...options
  }).format(new Date(value));
};

export const labelFor = (choices, value) =>
  choices.find((item) => item[0] === value)?.[1] || value;
