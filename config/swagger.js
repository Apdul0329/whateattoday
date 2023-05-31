import dotenv from 'dotenv';
dotenv.config();

const port = process.env.SERVER_PORT || 8000;

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
                url: `http://49.247.148.23:${port}`
            },
            {
                url: `https://localhost:${port}`
            },
            {
                url: `https://49.247.148.23:${port}`
            },
        ],
    },
    apis : ["./routes/*.js", "./swagger/*"],
};

export default options;