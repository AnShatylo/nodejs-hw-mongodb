import createHttpError from 'http-errors';

export const validateBody = (schema) => async (res, req, next) => {
  try {
    await schema.validateAsync(req.body, {
      abortEarly: false,
    });
    next();
  } catch (err) {
    const error = createHttpError(400, 'Bad request', {
      error: err.details,
    });
    next(error);
  }
};
