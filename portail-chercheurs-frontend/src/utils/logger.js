export const log = (...args) => {
  if (import.meta.env.MODE === "development") {
    console.log(...args);
  }
};

export const error = (...args) => {
  if (import.meta.env.MODE === "development") {
    console.error(...args);
  }
};
