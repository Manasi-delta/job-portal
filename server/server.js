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

// Initialize Express
const app = express()

// Connect DB
await connectDB()

// Middlewares
app.use(cors())

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

// Port
const PORT = process.env.PORT || 5000

Sentry.setupExpressErrorHandler(app);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})