import { ReasonPhrases, StatusCodes } from 'http-status-codes'

const DEFAULT_HTTP_STATUSCODE_MESSAGE = {
    400 : ReasonPhrases.BAD_REQUEST,
    401 : ReasonPhrases.UNAUTHORIZED,
    403 : ReasonPhrases.FORBIDDEN,
    404 : ReasonPhrases.NOT_FOUND,
    409 : ReasonPhrases.CONFLICT,
    500 : ReasonPhrases.INTERNAL_SERVER_ERROR,
    503 : ReasonPhrases.SERVICE_UNAVAILABLE 
}
const wrapAsync = (fn) => (req, res, next) => fn(req, res, next).catch(next);

const errorGenerator = (message, statusCode) => {
    const err = new Error(message || DEFAULT_HTTP_STATUSCODE_MESSAGE[statusCode]);
    err.statusCode = statusCode;

    throw err;
}

const handleError = (err, req, res, next) => {
    console.log('errorHandler activate');
    console.log(err);

    if (err.statusCode === 400) return res.status(StatusCodes.BAD_REQUEST).json(err.message);
    if (err.statusCode === 401) return res.status(StatusCodes.UNAUTHORIZED).json(err.message);
    if (err.statusCode === 403) return res.status(StatusCodes.FORBIDDEN).json(err.message);
    if (err.statusCode === 404) return res.status(StatusCodes.NOT_FOUND).json(err.message);
    if (err.statusCode === 409) return res.status(StatusCodes.CONFLICT).json(err.message);
    if (err.statusCode === 500) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err.message);
    if (err.statusCode === 503) return res.status(StatusCodes.SERVICE_UNAVAILABLE).json(err.message);
    if (err.statusCode === 1062) return res.status(StatusCodes.CONFLICT).json(err.message);
    if (err.statusCode === 1064) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err.message);
}

const handleErrorForHttp = async (req, res, next) => {
	errorGenerator(DEFAULT_HTTP_STATUSCODE_MESSAGE[404],404);
}

export {
    wrapAsync,
    handleError,
    errorGenerator,
    handleErrorForHttp
}