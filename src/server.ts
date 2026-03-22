import cors from "cors";
import dotenv from "dotenv";
import express, { type ErrorRequestHandler, type Express } from "express";
import { orderRoutes } from "routes/orderRoutes.js";
import { productRouter } from "routes/productRoutes.js";

dotenv.config({});

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("", productRouter);
app.use("", orderRoutes);

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
});

export default app;
