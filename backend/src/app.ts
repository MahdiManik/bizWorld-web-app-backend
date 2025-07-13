/* eslint-disable @typescript-eslint/no-unused-vars */
import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import path from "path";
import { userRoutes } from "./app/modules/User/user.routes";
import { SubscriptionRoutes } from "./app/modules/subscriptions/subscription.routes";
import { adminRoutes } from "./app/modules/Admin/admin.routes";
import { authRoutes } from "./app/modules/User/auth.routes";
import { userProfileRoutes } from "./app/modules/UserProfile/userProfile.routes";
import { companyRoutes } from "./app/modules/Company/company.routes";
import { ListingRoutes } from "./app/modules/Listing/listing.routes";
import { DocumentRoutes } from "./app/modules/Document/document.routes";
import { ListingCategoryRoutes } from "./app/modules/ListingCategory/listing-category.routes";
import interestRoutes from "./app/modules/Interest/interest.routes";

const app: Application = express();
app.use(cors());

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (req: Request, res: Response) => {
  res.send({
    Message: "Welcome to the Bizworld server...!",
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/profile", userProfileRoutes);
app.use("/api/v1/company", companyRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/subscription", SubscriptionRoutes);
app.use("/api/v1/listings", ListingRoutes);
app.use("/api/v1/listing-categories", ListingCategoryRoutes);
app.use("/api/v1/documents", DocumentRoutes);
app.use("/api/v1/interests", interestRoutes);

// ==================== ERROR HANDLING MIDDLEWARE ====================
// This needs to be after all route declarations

// Custom error interface that matches our ApiError structure
interface CustomError extends Error {
  statusCode?: number;
  code?: string;
  details?: unknown;
  stack?: string;
}

// Global error handling middleware (must be after all routes)
// Note: Express requires all 4 parameters for error middleware, even if next isn't used
app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  console.error("Error details:", {
    message: err.message,
    statusCode: err.statusCode,
    stack: err.stack,
  });

  // Default error response
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Send JSON response for all errors
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    // Only include stack in development
    ...(process.env.NODE_ENV === "development" ? { stack: err.stack } : {}),
  });
});

// Catch 404 routes - must be after all valid routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: `Not Found - ${req.originalUrl}`,
  });
});

export default app;
