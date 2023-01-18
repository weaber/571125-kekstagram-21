const DEBOUNCE_INTERVAL = 500; // ms

const debounce = function (cb) {
  let lastTimeout = null;
  return function (...args) {
    if (lastTimeout) {
      clearTimeout(lastTimeout);
    }
    lastTimeout = setTimeout(function () {
      cb.apply(null, ...args);
    }, DEBOUNCE_INTERVAL);
  };
};

export {debounce};
