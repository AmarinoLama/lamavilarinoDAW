import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Stripe from "stripe";

import articulosRoutes from "./articulosRoutes.js";
import authRoutes from "./authRoutes.js";
import contactoRoutes from "./contactoRoutes.js";
import facturasRoutes from "./facturasRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware
const corsOptions = {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
    credentials: true
};
app.use(cors(corsOptions));

app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; style-src 'self' 'unsafe-inline' 'sha256-0hAheEzaMe6uXIKV4EehS9pu1am1lj/KnnzrOYqckXk=' 'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=' https://m.stripe.network https://fonts.googleapis.com https://js.stripe.com; script-src 'self' 'unsafe-inline' https://embed.tawk.to https://js.stripe.com https://m.stripe.network; img-src 'self' data: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' http://localhost:* https://api.stripe.com https://m.stripe.network https://checkout.stripe.com; frame-src https://m.stripe.network https://js.stripe.com https://checkout.stripe.com;"
    );
    next();
});

app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.post("/crear-checkout-session", async (req, res) => {
    try {
        const { items, amount } = req.body;

        const lineItems = items.map(item => ({
            price_data: {
                currency: 'eur',
                product_data: {
                    name: item.nombre,
                },
                unit_amount: amount*100,
            },
            quantity: item.cantidad,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: 'http://localhost:5173/success',
            cancel_url: 'http://localhost:5173/cancel',
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Rutas
app.use("/api/articulos", articulosRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/contacto", contactoRoutes);
app.use("/api/facturas", facturasRoutes);

// Conexión a MongoDB 
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB a la base de datos BBDD"))
    .catch((err) => console.error("Could not connect to MongoDB:", err));

app.listen(PORT, () => {
    console.log(`Server Express está corriendo en el puerto: ${PORT}`);
});