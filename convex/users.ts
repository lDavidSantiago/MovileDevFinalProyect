import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Create a new task with the given text
export const createUser = mutation({
    args:{
        username: v.string(),
        fullname : v.string(),
        image: v.string(),
        email: v.string(),
        clerkId : v.string()
    }, handler: async(ctx, args)=>{
        
        const existingUser = await ctx.db.query("users")
        .withIndex("by_clerk_id",(q)=>q.eq("clerkId",args.clerkId))
        .first()
        if(existingUser)return;;
        //Create user in db
        await ctx.db.insert("users",
        {
            username: args.username,
            fullname: args.fullname,
            image: args.image,
            email: args.email,
            clerkId: args.clerkId,
        })
    }
})