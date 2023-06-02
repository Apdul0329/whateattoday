import {check, validationResult} from 'express-validator'

import { errorGenerator } from './errorHandler.js';

const writePostValidationParam = [
    check('title')
    .notEmpty().withMessage('please input data')
    .bail()
    .trim().withMessage('delete blank in your input')
    .isLength({min: 1, max: 100}).withMessage('please input 1 ~ 100 chars long')
    .bail(),

    check('content')
    .notEmpty().withMessage('please input data')
    .bail()
    .trim().withMessage('delete blank in your input')
    .isLength({min: 1, max: 500}).withMessage('please input 1 ~ 10 chars long')
    .bail()
]

const makeValidationParam = async (req, res, next) => {
    const inputParam = {
        title : req.body.title,
        content : req.body.content,
        post_index : req.params.post_index
    };

    const validationParam = [];
    if (inputParam.title) {
        validationParam.push(await check('title')
        .notEmpty().withMessage('please input data')
        .bail()
        .trim().withMessage('delete blank in your input')
        .isLength({min: 1, max: 100}).withMessage('please input 1 ~ 10 chars long')
        .bail()
        .run(req)
        );
    }
    if (inputParam.content) {
        validationParam.push(await check('content')
        .notEmpty().withMessage('please input data')
        .bail()
        .trim().withMessage('delete blank in your input')
        .isLength({min: 1, max: 500}).withMessage('please input 1 ~ 10 chars long')
        .bail()
        .run(req)
        );
    }
    if (inputParam.post_index) {
        validationParam.push(await check('post_index')
        .notEmpty().withMessage('please input data')
        .bail()
        .trim().withMessage('delete blank in your input')
        .isInt().withMessage('please input int')
        .bail()
        .run(req)
        );
    }
    console.log(validationParam);
    next();
    return validationParam;
}

const inputValidationParam = async (req, res, next) => {
    const inputParam = {
        post_index : req.params.post_index,
        page : req.query.page,
        page_size : req.query.page_size,
        searchFilter : req.query.filter,
        searchText : req.query.text
    };

    const validationParam = [];
    if (inputParam.post_index) {
        validationParam.push(await check('post_index')
        .notEmpty().withMessage('please input data')
        .bail()
        .trim().withMessage('delete blank in your input')
        .isInt().withMessage('please input int')
        .bail()
        .run(req)
        );
    }
    if (inputParam.page) {
        validationParam.push(await check('page')
        .notEmpty().withMessage('please input data')
        .bail()
        .trim().withMessage('delete blank in your input')
        .isInt().withMessage('please input int')
        .bail()
        .run(req)
        );
    } 
    if (inputParam.page_size) {
        validationParam.push(await check('page_size')
        .notEmpty().withMessage('please input data')
        .bail()
        .trim().withMessage('delete blank in your input')
        .isInt().withMessage('please input int')
        .bail()
        .run(req)
        );
    }
    if (inputParam.searchFilter) {
        validationParam.push(await check('filter')
        .isLength({min: 2, max: 10}).withMessage('please input 2 ~ 10 chars long')
        .bail()
        .run(req)
        );
    }
    if (inputParam.searchText) {
        validationParam.push(await check('text')
        .isLength({min: 2, max: 10}).withMessage('please input 2 ~ 10 chars long')
        .bail()
        .run(req)
        );
    }
   
    console.log(validationParam);
    next();
    return validationParam;
}

const validationCheck = async (req, res, next) => {
    const validateErr = validationResult(req);

    try{
        if (!(validateErr.isEmpty())) {
            console.log('find error');
            console.log(validateErr.array());
            
            const validateErrArray = validateErr.array();
            const message = `wrong input at ${validateErrArray[0].param} ${validateErrArray[0].msg}`;

            errorGenerator(message, 400);
        };
        next();
    } catch (err) {
        next(err);
    }      
}

export {
    writePostValidationParam,
    makeValidationParam,
    inputValidationParam,
    validationCheck
}
    
