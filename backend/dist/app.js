"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unused-vars */
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const user_routes_1 = require("./app/modules/User/user.routes");
const subscription_routes_1 = require("./app/modules/subscriptions/subscription.routes");
const admin_routes_1 = require("./app/modules/Admin/admin.routes");
const auth_routes_1 = require("./app/modules/User/auth.routes");
const userProfile_routes_1 = require("./app/modules/UserProfile/userProfile.routes");
const company_routes_1 = require("./app/modules/Company/company.routes");
const listing_routes_1 = require("./app/modules/Listing/listing.routes");
const document_routes_1 = require("./app/modules/Document/document.routes");
const listing_category_routes_1 = require("./app/modules/ListingCategory/listing-category.routes");
const interest_routes_1 = __importDefault(require("./app/modules/Interest/interest.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
//parser
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Serve static files from the uploads directory
app.use("/uploads", express_1.default.static(path_1.default.join(process.cwd(), "uploads")));
app.get("/", (req, res) => {
    res.send({
        Message: "Welcome to the Bizworld server...!",
    });
});
app.use("/api/v1/auth", auth_routes_1.authRoutes);
app.use("/api/v1/users", user_routes_1.userRoutes);
app.use("/api/v1/profile", userProfile_routes_1.userProfileRoutes);
app.use("/api/v1/company", company_routes_1.companyRoutes);
app.use("/api/v1/admin", admin_routes_1.adminRoutes);
app.use("/api/v1/subscription", subscription_routes_1.SubscriptionRoutes);
app.use("/api/v1/listings", listing_routes_1.ListingRoutes);
app.use("/api/v1/listing-categories", listing_category_routes_1.ListingCategoryRoutes);
app.use("/api/v1/documents", document_routes_1.DocumentRoutes);
app.use("/api/v1/interests", interest_routes_1.default);
// Global error handling middleware (must be after all routes)
// Note: Express requires all 4 parameters for error middleware, even if next isn't used
app.use((err, req, res, next) => {
    console.error("Error details:", {
        message: err.message,
        statusCode: err.statusCode,
        stack: err.stack,
    });
    // Default error response
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    // Send JSON response for all errors
    res.status(statusCode).json(Object.assign({ success: false, statusCode,
        message }, (process.env.NODE_ENV === "development" ? { stack: err.stack } : {})));
});
// Catch 404 routes - must be after all valid routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        statusCode: 404,
        message: `Not Found - ${req.originalUrl}`,
    });
});
exports.default = app;
