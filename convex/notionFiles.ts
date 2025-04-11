import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createNotionFile = mutation({
    args: {
        coverPhoto: v.string(), // URL or path to the cover photo
        icon: v.string(), // URL or path to the icon
        title: v.string(), // Title of the file
        description: v.string(), // Description of the file
        content: v.string(), // Main content of the file
        type: v.string(), // Type of the file (e.g., "document", "folder")
        order: v.number(), // Order of the file (e.g., for sorting)
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Called createNotionFile without authentication");
        }
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .first();
        if (!user) {
            throw new Error("User not found");
        }

        

        const now = Date.now();
        
        // Create the new notion file
        const newFile = await ctx.db.insert("notionFiles", {
            ...args,
            authorId: user.clerkId,
            createdAt: now,
            updatedAt: now
        });

        return newFile;
    }
})

export const getNotionFilesByUserId = query({
    args: { userId: v.string() },
    handler: async (ctx, { userId }) => {
        const files = await ctx.db
            .query("notionFiles")
            .withIndex("by_author_id", (q) => q.eq("authorId", userId))
            .collect();
        return files;
    } 
});

export const updateFileOrders = mutation({
    args: {
      updates: v.array(
        v.object({
          id: v.id("notionFiles"), // Assuming your table is called "notionFiles"
          order: v.number()
        })
      )
    },
    handler: async (ctx, args) => {
      // Process all updates in a single transaction
      for (const update of args.updates) {
        await ctx.db.patch(update.id, { order: update.order });
      }
    }
  });