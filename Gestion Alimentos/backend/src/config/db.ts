import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'IN5BM',
  password: process.env.DB_PASSWORD || '-mondoM5a',
  database: process.env.DB_NAME || 'gestion_alimentosdb_in5bm',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool.promise();