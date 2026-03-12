import { Router } from "express";
import transactionController from "../controllers/transaction.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
const transactionRoutes = Router();



transactionRoutes.post("/", authMiddleware.authMiddleware, transactionController.createTransaction)
transactionRoutes.post("/system/initial-funds", authMiddleware.authSystemUserMiddleware, transactionController.createInitialFundsTransaction)

export default transactionRoutes;