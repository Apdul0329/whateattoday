import { errorGenerator } from "./errorHandler.js";

const isLogin = async (req, res, next) => {
    try {
        if (!(req.session.user)) {
            const errorMessage = {
                message : "Login isn't running please log in"
            }

            errorGenerator(errorMessage.message, 401);
        }

        next();
    } catch (err) {
        console.log(err);
        next(err);
    }
}

const isDoubleLogin = async (req, res, next) => {
    try {
        if (req.session.user) {
            const errorMessage = {
                message : "Already logged in"
            }
            errorGenerator(errorMessage.message, 409);
        }
        
        next();
    } catch (err) {
        console.log(err);
        next(err);
    }
}

export {
   isLogin,
   isDoubleLogin 
}