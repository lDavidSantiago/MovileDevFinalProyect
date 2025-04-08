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
        parentFileId: v.optional(v.id("notionFiles")), // Reference to the parent file (nullable for top-level files)
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

        // Validate parentFileId if provided
        if (args.parentFileId) {
            const parentFile = await ctx.db.get(args.parentFileId);
            if (!parentFile) {
                throw new Error("Invalid parentFileId: Parent file not found");
            }
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