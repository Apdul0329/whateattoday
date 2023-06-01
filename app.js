//express 모듈을 사용
import express, { json, urlencoded } from 'express';
import http from 'http';
import cors from 'cors';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import options from './config/swagger.js';
import session from 'express-session';
import sessionStore from 'session-file-store';
import cookieParser from 'cookie-parser';
import { handleError } from './middleware/errorHandler.js';
import userRouter from './router/user.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express()

const port = process.env.SERVER_PORT || 8000;

app.use(cors());

/*
* 세션을 사용하기 위해 'express-session' 모듈을 session에 할당하고 미들웨어 사용
* 세션의 store 옵션을 설정하기 위해 'session-file-store' 모듈을 fileStore에 할당하고 미들웨어 사용  
*/
const fileStore = sessionStore(session);
app.use(session({
    httpOnly : true,    
    secret : process.env.COOKIE_SECRET,
    resave : false,
    saveUninitialized : false,
    cookie : {
        httpOnly : true,
        secure : false
    },
    name : "session-cookie",
    store : new fileStore()
}));

// 쿠키를 쓰기 위해 'cookie-parser' 모듈을 cookieParser에 할당하고 미들웨어 사용
app.use(cookieParser(process.env.COOKIE_SECRET));

// 'body-parser' 모듈을 사용해 url로 넘어 오는 값을 JSON 형식으로 바꾸는 미들웨어 사용
app.use(json());
app.use(urlencoded({extended: false}));

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerJSDoc(options), {explorer: true}));    // Swagger 적용
app.use(handleError);                                                                               // 발생한 오류를 한 번에 처리하기 위한 미들웨어
app.use('/', userRouter);                                                                           // userRouter을 콜백 함수로 갖는 미들웨어
http.createServer(app).listen(port, () => {
    console.log('start server');
}); 
