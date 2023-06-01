import dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT || 8000;
const serverPort = process.env.SERVER_PORT;
const ip = process.env.SERVER_IP;

const options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "WhatEatToday Service with Swagger",
            version: "1.0.0",
            description: "A REST API using swagger and express for WhatEatToday Service",
        },
        servers: [
            {
                url: `http://localhost:${port}`
            },
            {
                url: `http://${ip}:${serverPort}`
            },
            {
                url: `https://localhost:${port}`
            },
            {
                url: `https://${ip}:${serverPort}`
            },
        ],
    },
    apis : ["./router/*.js", "./swagger/*"],
};

export default options;