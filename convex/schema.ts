import {defineSchema, defineTable} from "convex/server"
import { v } from "convex/values"
export default defineSchema({
    //Table for users 
    users: defineTable({
        username: v.string(),
        fullname: v.string(),
        email: v.string(),
        image : v.string(),
        clerkId: v.string()
    }).index("by_clerk_id",["clerkId"]),

    // Notes Files Table
    notionFiles: defineTable({
        coverPhoto: v.string(), // URL or path to the cover photo
        icon: v.string(), // URL or path to the icon
        title: v.string(), // Title of the file
        description: v.string(), // Description of the file
        content: v.string(), // Main content of the file
        type: v.string(), // Type of the file (e.g., "document", "folder")
        authorId: v.string(), // Reference to the user who created the file
        order: v.number(), // Order of the file (e.g., for sorting)
        createdAt: v.number(), // Timestamp when the file was created
        updatedAt: v.number(), // Timestamp when the file was last updated
      })
      .index("by_author_id", ["authorId","order"]) // Index for querying files by author
      .index("by_order", ["order"]),

})