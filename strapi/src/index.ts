// import type { Core } from '@strapi/strapi';

const ADMIN_EMAIL = process.env.ADMIN_BOOTSTRAP_EMAIL || "admin@starkautomations.com";
const ADMIN_PASSWORD = process.env.ADMIN_BOOTSTRAP_PASSWORD || "Admin123!";

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }) {
    try {
      const adminCount = await strapi.db.query("admin::user").count();

      if (adminCount === 0) {
        const superAdminRole = await strapi.db
          .query("admin::role")
          .findOne({ where: { code: "strapi-super-admin" } });

        if (superAdminRole) {
          const hashedPassword = await strapi.service("admin::auth").hashPassword(ADMIN_PASSWORD);
          await strapi.db.query("admin::user").create({
            data: {
              firstname: "Admin",
              lastname: "User",
              email: ADMIN_EMAIL,
              password: hashedPassword,
              isActive: true,
              blocked: false,
              roles: [superAdminRole.id],
            },
          });
          console.log(`[bootstrap] Created admin user: ${ADMIN_EMAIL}`);
        }
      }
    } catch (err) {
      console.error("[bootstrap] Error creating admin:", err);
    }

    try {
      const pluginService = strapi.plugin("users-permissions").service("role");
      const roles = await pluginService.find();
      const publicRole = roles.find((r) => r.type === "public");
      if (!publicRole) return;

      const roleDetail = await pluginService.findOne(publicRole.id);
      const permissions = roleDetail.permissions || {};
      const landingPerms =
        permissions?.["api::landing-page"]?.controllers?.["landing-page"] || {};

      if (landingPerms?.find?.enabled === true && landingPerms?.findOne?.enabled === true) {
        return;
      }

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
    } catch (err) {
      console.error("[bootstrap] Error setting permissions:", err);
    }
  },
};
