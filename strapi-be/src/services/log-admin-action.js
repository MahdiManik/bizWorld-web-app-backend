module.exports = ({ strapi }) => ({
  async create({ ctx, action, target }) {
    try {
      const user = ctx.state?.user;
      console.log("user", user);

      if (!user) return;

      const role = user.role?.type?.toLowerCase();
      const allowedRoles = ["admin"];

      if (!allowedRoles.includes(role)) return;

      await strapi.db.query("api::admin-log.admin-log").create({
        data: {
          action,
          target,
          performedBy: `${user.username} (${role})`,
        },
      });
    } catch (err) {
      strapi.log.error("Failed to log admin action:", err);
    }
  },
});
