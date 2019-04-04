const snackbarMiddleware = store => next => action => {
  next(action);
};

export default snackbarMiddleware;