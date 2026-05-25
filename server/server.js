// import './config/instrument.js'
// import express from 'express'
// import cors from 'cors'
// import 'dotenv/config'
// import connectDB from './config/db.js'
// import * as Sentry from "@sentry/node";
// import { clerkWebhooks } from './controllers/webHooks.js'

// //Initialize Express
// const app=express()

// //Connect to database
// await connectDB()

// //Middlewares 
// // app.use(cors())
// // app.use(express.json()) // response
// app.use(cors())

// app.post(
//   '/webhooks',
//   express.raw({ type: 'application/json' }),
//   clerkWebhooks
// )

// app.use(express.json())

// //Routes
// app.get('/',(req,res)=>res.send("API Working"))
// app.get("/debug-sentry", function mainHandler(req, res) {
//   throw new Error("My first Sentry error!");
// });
// //app.post('/webhooks',clerkWebhooks)
// //Port
// const PORT=process.env.PORT || 5000
// Sentry.setupExpressErrorHandler(app);
// app.listen(PORT,()=>{
//     console.log(`Server is running on port ${PORT}`);
// })
import './config/instrument.js'
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js'
import * as Sentry from "@sentry/node";
import { clerkWebhooks } from './controllers/webHooks.js'
import companyRoutes from './routes/companyRoutes.js'
import connectCloudinary from './config/cloudinary.js'
import jobRoutes from './routes/jobRoutes.js'
import userRoutes from './routes/userRoutes.js'
import {clerkMiddleware} from '@clerk/express'
// Initialize Express
const app = express()

// Connect DB
await connectDB()
await connectCloudinary()

// Middlewares
app.use(cors())
app.use(clerkMiddleware())

// IMPORTANT: Clerk webhook BEFORE express.json()
app.post(
  '/webhooks/clerk',
  express.raw({ type: 'application/json' }),
  clerkWebhooks
)

// JSON middleware AFTER webhook
app.use(express.json())

// Routes
app.get('/', (req, res) => res.send("API Working"))

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});
app.use('/api/company',companyRoutes)
app.use('/api/jobs',jobRoutes)
app.use('/api/users',userRoutes)

// Port
const PORT = process.env.PORT || 5000

Sentry.setupExpressErrorHandler(app);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})