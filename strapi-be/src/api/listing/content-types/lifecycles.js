"use strict";

const statusActionMap = {
  approved: "Listing Approved",
  rejected: "Listing Rejected",
};

module.exports = ({ strapi }) => ({
  async beforeUpdate(event) {
    const { data, where } = event.params;

    // 1. Exit early if no status provided
    if (!data.listingStatus) return;

    try {
      // 2. Get current request context
      const ctx = strapi.requestContext.get();

      // 3. Get the existing listing before update
      const existingListing = await strapi.entityService.findOne(
        "api::listing.listing",
        where.id,
        {
          fields: ["title"],
        }
      );

      // 4. Check if status changed
      if (
        existingListing.listingStatus.toLowerCase() ===
        data.listingStatus.toLowerCase()
      )
        return;

      // 5. Build log details
      const action =
        statusActionMap[data.listingStatus.toLowerCase()] ||
        `Listing Status Changed to ${data.listingStatus.toLowerCase()}`;
      const target = `${existingListing.title} (listing${existingListing.id})`;

      // 6. Call logging service
      await strapi.service("log-admin-action").create({
        ctx,
        action,
        target,
      });
    } catch (err) {
      strapi.log.error("Failed to log listing update:", err);
    }
  },
});
