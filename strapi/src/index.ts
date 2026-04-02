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
      const pluginService = strapi.plugin("users-permissions").service("role");
      const roles = await pluginService.find();
      const publicRole = roles.find((r) => r.type === "public");

      console.log(`[bootstrap] Public role found: ${!!publicRole}`);

      if (publicRole) {
        const roleDetail = await pluginService.findOne(publicRole.id);
        const permissions = roleDetail.permissions || {};

        const landingPerms =
          permissions?.["api::landing-page"]?.controllers?.["landing-page"] || {};

        const findEnabled = landingPerms?.find?.enabled === true;
        const findOneEnabled = landingPerms?.findOne?.enabled === true;

        console.log(`[bootstrap] find=${findEnabled}, findOne=${findOneEnabled}`);

        if (!findEnabled || !findOneEnabled) {
          // Build updated permissions object
          const updatedPermissions = {
            ...permissions,
            "api::landing-page": {
              controllers: {
                "landing-page": {
                  find: { enabled: true },
                  findOne: { enabled: true },
                },
              },
            },
          };

          await pluginService.updateRole(publicRole.id, {
            permissions: updatedPermissions,
          });
          console.log("[bootstrap] Updated public permissions for landing-page");
        } else {
          console.log("[bootstrap] Public permissions already set");
        }
      }
    } catch (err) {
      console.error("[bootstrap] Error setting permissions:", err);
    }

    console.log("[bootstrap] Bootstrap complete.");
  },
};
