import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.PORT || 5000;
const FRONT_END_PORT = process.env.FRONT_END_PORT || 3000;

const allowedOrigins = [
    // 'http://127.0.0.1:5500',
    `http://localhost:${PORT}`,
    `http://localhost:${FRONT_END_PORT}`,
];

export default allowedOrigins;