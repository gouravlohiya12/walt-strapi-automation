// import type { Core } from '@strapi/strapi';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }) {
    console.log("[bootstrap] Starting bootstrap...");

    // Auto-create admin user if none exists
    try {
      const adminCount = await strapi.db
        .query("admin::user")
        .count();
      console.log(`[bootstrap] Admin users found: ${adminCount}`);

      if (adminCount === 0) {
        const superAdminRole = await strapi.db
          .query("admin::role")
          .findOne({ where: { code: "strapi-super-admin" } });

        if (superAdminRole) {
          const hashedPassword = await strapi.service("admin::auth").hashPassword("Admin123!");
          await strapi.db.query("admin::user").create({
            data: {
              firstname: "Admin",
              lastname: "User",
              email: "admin@starkautomations.com",
              password: hashedPassword,
              isActive: true,
              blocked: false,
              roles: [superAdminRole.id],
            },
          });
          console.log("[bootstrap] Created admin user: admin@starkautomations.com");
        }
      }
    } catch (err) {
      console.error("[bootstrap] Error creating admin:", err);
    }

    // Set public permissions for LandingPage find and findOne
    try {
      const publicRole = await strapi
        .query("plugin::users-permissions.role")
        .findOne({ where: { type: "public" } });

      console.log(`[bootstrap] Public role found: ${!!publicRole}`);

      if (publicRole) {
        const permissions = await strapi
          .query("plugin::users-permissions.permission")
          .findMany({ where: { role: publicRole.id } });

        const existingActions = permissions.map((p) => p.action);
        console.log(`[bootstrap] Existing permissions: ${existingActions.length}`);

        const needed = [
          "api::landing-page.landing-page.find",
          "api::landing-page.landing-page.findOne",
        ];

        for (const action of needed) {
          if (!existingActions.includes(action)) {
            await strapi.query("plugin::users-permissions.permission").create({
              data: { action, role: publicRole.id },
            });
            console.log(`[bootstrap] Added public permission: ${action}`);
          } else {
            console.log(`[bootstrap] Permission already exists: ${action}`);
          }
        }
      }
    } catch (err) {
      console.error("[bootstrap] Error setting permissions:", err);
    }

    console.log("[bootstrap] Bootstrap complete.");
  },
};
