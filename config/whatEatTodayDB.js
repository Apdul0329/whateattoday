import { createConnection, createPool } from 'mysql2/promise';

import dotenv from 'dotenv';
dotenv.config();

const connectionSetting = {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DATABASE,
    connectionLimit: 4
}

const whatEatTodayDB = createConnection(connectionSetting);

const whatEatTodayPool = createPool(connectionSetting);

export {
    whatEatTodayPool,
    whatEatTodayDB
}
