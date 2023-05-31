//express 모듈을 사용
import express, { json, urlencoded } from 'express';
import cors from 'cors';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import options from './config/swagger.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express()

const port = process.env.SERVER_PORT || 8000;

// 'body-parser' 모듈을 사용해 url로 넘어 오는 값을 JSON 형식으로 바꾸는 미들웨어 사용
app.use(json());
app.use(urlencoded({extended: false}));

app.use(cors({
    origin: '*',
    credentials: true
}));

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerJSDoc(options), {explorer: true}));

app.listen(port, () => {
    console.log('start server');
});
