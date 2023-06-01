import dotenv from 'dotenv';
dotenv.config();

const port = process.env.SERVER_PORT || 8000;
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
                url: `http://node_web:${port}`
            },
            {
                url: `http://${ip}:${port}`
            },
            {
                url: `https://localhost:${port}`
            },
            {
                url: `https://${ip}:${port}`
            },
        ],
    },
    apis : ["./router/*.js", "./swagger/*"],
};

export default options;