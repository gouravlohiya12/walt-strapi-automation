// import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    // Set public permissions for LandingPage find and findOne
    const publicRole = await strapi
      .query("plugin::users-permissions.role")
      .findOne({ where: { type: "public" } });

    if (publicRole) {
      const permissions = await strapi
        .query("plugin::users-permissions.permission")
        .findMany({ where: { role: publicRole.id } });

      const existingActions = permissions.map((p) => p.action);

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
        }
      }
    }
  },
};
