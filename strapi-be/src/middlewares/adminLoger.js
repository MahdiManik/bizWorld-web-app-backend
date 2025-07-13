"use strict";

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    // Get the current timestamp
    const timestamp = new Date().toISOString();

    // Get user information (if authenticated)
    const user = ctx.state.user;
    const userId = user ? user.id : "Anonymous";

    // Get request details
    const requestMethod = ctx.method;
    const requestUrl = ctx.url;

    // Log the initial request information
    console.log(
      `${timestamp}] User ${userId} sent ${requestMethod} request to ${requestUrl}`,
    );

    // Capture the response status after the request is processed
    await next();

    // Determine if the request was successful (status codes 200-299 are typically successful)
    const isSuccess = ctx.status >= 200 && ctx.status < 300;

    // Determine the action based on the request method
    let action = "unknown";
    switch (requestMethod.toUpperCase()) {
      case "POST":
        action = "create";
        break;
      case "PUT":
        action = "update";
        break;
      case "DELETE":
        action = "delete";
        break;
      case "GET":
        action = "retrieve";
        break;
    }

    // Log the outcome
    console.log(
      `${timestamp}] User ${userId} attempted to ${action} a resource at ${requestUrl}.` +
        `Success: ${isSuccess} (Status: ${ctx.status})`,
    );
  };
};