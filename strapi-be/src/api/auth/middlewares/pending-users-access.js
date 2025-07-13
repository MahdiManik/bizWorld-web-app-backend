'use strict';

/**
 * `pending-users-access` middleware
 */

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    console.log('Pending users access middleware is running');
    
    // Add your custom middleware logic here
    // For example, you might want to check user status before allowing access
    
    await next();
  };
};
