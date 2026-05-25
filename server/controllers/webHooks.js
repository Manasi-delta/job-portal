// import { Webhook } from "svix";
// import User from "../models/User.js";

// //API Controller Function to Manage Clerk User with database
// export const clerkWebhooks=async (req,res)=>{
//     try{
//         //create a Svix instance with clerk webhook secret
//         const whook=new Webhook(process.env.CLERK_WEBHOOK_SECRET)

//         //Verifying Headers
//         await whook.verify(JSON.stringify(req.body),{
//             "svix-id":req.headers["svix-id"],
//             "svix-timestamp":req.headers["svix-timestamp"],
//             "svix-signature":req.headers["svix-signature"]
//         })
//         //Getting Data from request body
//         const {data,type}=req.body
//         console.log(type)
//         console.log(data)
//         //Switch Cases for different Events
//         switch (type) {
//             case 'user.created':{
//                 const userData={
//                     _id:data.id,
//                     email:data.email_addresses[0]?.email_address || "",
//                     name:data.first_name+" "+data.last_name,
//                     image:data.image_url,
//                     resume:''
//                 }
//                 await User.create(userData);
//                 res.json({})
//                 break;
//             }
//             case 'user.updated':{
//                 const userData={
//                     email:data.email_addresses[0]?.email_address || "",
//                     name:data.first_name+" "+data.last_name, 
//                     image:data.image_url,
//                 }
//                 await User.findByIdAndUpdate(data.id,userData)
//                 res.json({})
//                 break;
//             }
//             case 'user.deleted':{
//                 await User.findByIdAndDelete(data.id)
//                 res.json({})
//                 break;
//             }
//             default:
//                 break;
//         }

//     }catch(error){
//     console.log(error)
//     res.json({success:false,message:error.message})
//     }
// } 
import express from "express";
import { Webhook } from "svix";
import mongoose from "mongoose";
import User from "../models/User.js";

const router = express.Router();

// Clerk Webhook Controller
export const clerkWebhooks = async (req, res) => {
  try {
    console.log("Webhook reached");

    // Create Svix instance
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Get headers
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // Verify webhook
    const evt = whook.verify(req.body, headers);

    // Get data and event type
    const { data, type } = evt;

    console.log("Type:", type);
    console.log("Data:", data);

    console.log("Connected DB:", mongoose.connection.name);

    // Handle different webhook events
    switch (type) {

      // USER CREATED
      case "user.created": {

        const emailObject = data.email_addresses?.find(
          (email) => email.id === data.primary_email_address_id
        );

        const userData = {
          _id: data.id,
          email: emailObject?.email_address || "",
          name: `${data.first_name || ""} ${data.last_name || ""}`,
          image: data.image_url,
          resume: "",
        };

        await User.findByIdAndUpdate(
          data.id,
          userData,
          { upsert: true, new: true }
        );

        console.log("User saved");

        break;
      }

      // USER UPDATED
      case "user.updated": {

        const emailObject = data.email_addresses?.find(
          (email) => email.id === data.primary_email_address_id
        );

        const userData = {
          email: emailObject?.email_address || "",
          name: `${data.first_name || ""} ${data.last_name || ""}`,
          image: data.image_url,
        };

        await User.findByIdAndUpdate(
          data.id,
          userData,
          { upsert: true, new: true }
        );

        console.log("User updated");

        break;
      }

      // USER DELETED
      case "user.deleted": {

        await User.findByIdAndDelete(data.id);

        console.log("User deleted");

        break;
      }

      default:
        console.log("Unhandled event type");
        break;
    }

    return res.status(200).json({
      success: true,
    });

  } catch (error) {

    console.log("Webhook Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// IMPORTANT ROUTE
router.post(
  "/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhooks
);

export default router;