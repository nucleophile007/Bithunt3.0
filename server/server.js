import express from "express";
import dotenv from "dotenv";
import connectDB  from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import gateRoutes from "./routes/gateRoutes.js";
import cors from "cors";



// Load environment variables
dotenv.config();

const app = express();

// Enable CORS
app.use(cors());

// Connect to MongoDB
connectDB();

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/gates", gateRoutes);

const PORT = process.env.PORT || 5001;
const HOST = '0.0.0.0'; // Bind to all network interfaces
app.get('/', (req, res) => {
    res.send('Hello, World!');
});
app.listen(PORT, HOST, () => {
    console.log(`Server is running at http://${HOST}:${PORT}/`);
});