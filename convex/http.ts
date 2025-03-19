import { httpRouter, HttpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import {Webhook} from "svix";
import {api} from "./_generated/api";

const http = httpRouter();

http.route({
    path:"/clerk-webhook",
    method: "POST",
    //ctx = context
    handler : httpAction(async (ctx,request) => {
        console.log("Webhook request received");
        
        const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
        console.log("Webhook secret exists:", !!webhookSecret);

        if (!webhookSecret){
            console.log("Missing webhook secret");
            return new Response("No webhook secret", {
                status: 400
            });
        }

        const svix_id = request.headers.get("svix-id");
        const svix_signature = request.headers.get("svix-signature");
        const svix_timestamp = request.headers.get("svix-timestamp");

        console.log("Headers received:", {
            svix_id,
            svix_signature,
            svix_timestamp
        });

        if (!svix_id || !svix_signature || !svix_timestamp){
            console.log("Missing headers:", { svix_id, svix_signature, svix_timestamp });
            return new Response("No svix headers", {
                status: 400
            });
        }

        const payload = await request.json();
        console.log("Payload received:", payload);
        
        const body = JSON.stringify(payload);
        const wh = new Webhook(webhookSecret);
        let evt:any;

        // Verify Webhook
        try{
            evt = wh.verify(body,{
                "svix-id":svix_id,
                "svix-signature":svix_signature,
                "svix-timestamp":svix_timestamp,
            }) as any;
        }catch(err){
            console.error("Error verifying webhook",err);
            return new Response("Error verifying webhook",{
                status:400,
            });
        }
        const eventType = evt.type; 

        if(eventType === "user.created"){
            const {id,first_name,last_name,email_addresses,image_url} = evt.data;

            const email = email_addresses[0].email_address;
            const name = `${ first_name|| ""} ${ last_name|| ""}`.trim();
        
            try{   
                await ctx.runMutation(api.users.createUser,{
                    email,
                    fullname:name,
                    image:image_url,
                    clerkId : id,
                    //Example Overlimits@yopmail.com 
                    //username will be Overlimits
                    username: email.split("@")[0],  
                });
            }catch (error){
                console.error("Error creating user",error);
                return new Response("Error creating user",{status:500});
            }
        
        
        }
        return new Response("Webhook processed successfully",{status:200});
    }),


})

export default http;