import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  auth: {
    // Make the sign-in protections explicit so the login notice stays accurate.
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000, // 10 minutes, in milliseconds.
    tokenExpiration: 2 * 60 * 60, // 2 hours, in seconds.
  },

  access: {
    admin: ({ req }) =>
      req.user?.role === "admin" || req.user?.role === "editor",
    create: ({ req }) => req.user?.role === "admin",
    read: ({ req }) => req.user?.role === "admin",
    update: ({ req }) => req.user?.role === "admin",
    delete: ({ req }) => req.user?.role === "admin",
  },

  // Extra endpoint used by the custom forgot-password view: tells the
  // (logged-out) form whether the email belongs to a real admin user, so
  // typos are reported immediately instead of sending the user to a "check
  // your email" screen for an address that will never receive a link. Only
  // an exists boolean is returned — no user details. This intentionally
  // reveals which admin emails are registered (that's the point of the
  // forgot-password typo warning).
  endpoints: [
    {
      path: "/check-email",
      method: "post",
      handler: async (req) => {
        const body = (await req.json?.()) as { email?: unknown } | undefined;
        const email = typeof body?.email === "string" ? body.email.trim() : "";
        if (!email) return Response.json({ exists: false });

        const hasUserWith = async (value: string) => {
          const { totalDocs } = await req.payload.count({
            collection: "users",
            where: { email: { equals: value } },
            overrideAccess: true,
          });
          return totalDocs > 0;
        };

        const exists =
          (await hasUserWith(email)) ||
          (await hasUserWith(email.toLowerCase()));
        return Response.json({ exists });
      },
    },
  ],

  admin: {
    defaultColumns: ["name", "email", "role"],
    useAsTitle: "name",
    // Custom Edit view wrapper that paints the mockup frame:
    // #111115 page background, rounded #2d2d33 panel around the fields,
    // #101012 input boxes — the DARK scheme. The same elements are repainted
    // for the Light theme.
    components: {
      views: {
        edit: {
          default: {
            Component: {
              path: "./src/payload/collections/UsersEditView.tsx",
            },
          },
        },
      },
      // "Cancel" and "Done" buttons next to Save on the create/edit pages —
      // they render in the document controls bar (before the Save button, in
      // array order) so the bar reads "Cancel | Done | Save". Cancel returns
      // to the previous screen; Done returns to the Users list.
      edit: {
        beforeDocumentControls: [
          {
            path: "./src/payload/collections/UsersCancelToDashboardButton.tsx",
          },
          {
            path: "./src/payload/collections/UsersDoneToListButton.tsx",
          },
        ],
      },
    },
  },

  fields: [
    {
      name: "name",
      type: "text",
    },
    {
      name: "role",
      type: "select",
      options: ["admin", "editor"],
      defaultValue: "editor",
      required: true,
      access: {
        update: ({ req }) => req.user?.role === "admin",
      },
    },
  ],
};
