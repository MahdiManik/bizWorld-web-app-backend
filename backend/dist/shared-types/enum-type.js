"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStatus = exports.UserRole = void 0;
// types/enums.ts
var UserRole;
(function (UserRole) {
    UserRole["BUSINESS_OWNER"] = "BUSINESS_OWNER";
    UserRole["INVESTOR"] = "INVESTOR";
    UserRole["CONSULTANT"] = "CONSULTANT";
})(UserRole || (exports.UserRole = UserRole = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["PENDING"] = "PENDING";
    UserStatus["ACTIVE"] = "ACTIVE";
    UserStatus["REJECTED"] = "REJECTED";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
