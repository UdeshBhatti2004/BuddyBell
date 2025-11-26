import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { dbConnect } from './db/db.js';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import chatRoutes from './routes/chat.routes.js';
import chatThemeRoute from './routes/chat.theme.route.js'
import path from "path"
dotenv.config();
dbConnect();

const app = express();

const dirname = path.resolve()

const PORT = process.env.PORT

// ✅ Replace this with your local IP address (example)
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://192.168.37.176:5173",
     "http://10.199.144.176:5173",
     "http://10.199.144.1:5173",
     "http://10.199.144.1:5173/"
    
  ],
  credentials: true,
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/chat', chatRoutes);
app.use('/api',chatThemeRoute)

app.use(express.static(path.join(dirname,"/client/dist")))
app.use((req, res) => {
  res.sendFile(path.resolve(dirname, "client", "dist", "index.html"));
});


app.listen(PORT,()=>{
    console.log(`Your server is running on ${PORT}`)
})


export default app;
