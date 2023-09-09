require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
mongoose.User = {};
const productRouter = require("./routes/Product");
const brandRouter = require("./routes/Brand");
const categoryRouter = require("./routes/Category");
const userRouter = require("./routes/User");
const authRouter = require("./routes/auth");
const cartRouter = require("./routes/Cart");
const orderRouter = require("./routes/Order");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const { User } = require("./models/User");
const { isAuth, sanitizeUser, cookieExtractor } = require("./services/common");
const crypto = require("crypto");
const cookieParser = require("cookie-parser");
const { Strategy } = require("passport-local");
const path = require("path");
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("database connected");
}

// WebHook...

// Replace this endpoint secret with your endpoint's unique secret
// If you are testing with the CLI, find the secret by running 'stripe listen'
// If you are using an endpoint defined with the API or dashboard, look in your webhook settings
// at https://dashboard.stripe.com/webhooks
const endpointSecret = process.env.ENDPOINT_SECRET;

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (request, response) => {
    let event = request.body;
    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse
    if (endpointSecret) {
      // Get the signature sent by Stripe
      const signature = request.headers["stripe-signature"];
      try {
        event = stripe.webhooks.constructEvent(
          request.body,
          signature,
          endpointSecret
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return response.sendStatus(400);
      }
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        console.log(
          `PaymentIntent for ${paymentIntent.amount} was successful!`
        );
        // Then define and call a method to handle the successful payment intent.
        // handlePaymentIntentSucceeded(paymentIntent);
        break;
      case "payment_method.attached":
        const paymentMethod = event.data.object;
        // Then define and call a method to handle the successful attachment of a PaymentMethod.
        // handlePaymentMethodAttached(paymentMethod);
        break;
      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}.`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

// middlewares...
app.use(express.static(path.resolve(__dirname, "build")));
app.use(express.json());

app.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(cookieParser());
// app.use(
//   session({
//     secret: "keyboard cat",
//     resave: false, // don't save session if unmodified
//     saveUninitialized: true, // don't create session until something stored
//     // cookie: { secure: false, maxAge: 3600000 }, //yahi cookie feild cooke bhejta h
//   })
// );

app.use(passport.initialize());
// app.use(passport.session());

// app.use((req, res, next) => {
//   console.log("Session Data:", req.session);
//   next();
// });

// This is your test secret API key.
const stripe = require("stripe")(process.env.STRIPE_SERVER_KEY);

// const calculateOrderAmount = (items) => {
//   // Replace this constant with a calculation of the order's amount
//   // Calculate the order total on the server to prevent
//   // people from directly manipulating the amount on the client
//   return 1400;
// };

// Creating Payment Intent...
app.post("/create-payment-intent", async (req, res) => {
  const { totalAmount } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount * 100,
    currency: "eur",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

app.use("/products", isAuth(), productRouter.router);
app.use("/brands", isAuth(), brandRouter.router);
app.use("/category", isAuth(), categoryRouter.router);
app.use("/user", isAuth(), userRouter.router);
app.use("/auth", authRouter.router);
app.use("/cart", isAuth(), cartRouter.router);
app.use("/orders", isAuth(), orderRouter.router);
app.get("*", (req, res) => res.sendFile(path.resolve("build", "index.html")));
// jwt Strategy...

const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.JWT_SECRET;

// opts.issuer = "accounts.examplesoft.com";
// opts.audience = "yoursite.net";

passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const user = await User.findById(jwt_payload.id);
      console.log("jwt called");
      return done(null, sanitizeUser(user));
    } catch (err) {
      return done(err);
    }
  })
);

// Login Strategy...
passport.use(
  "local",
  new LocalStrategy(
    {
      usernameField: "email", // Assuming the email is used as the username
    },
    async (email, password, done) => {
      try {
        // Find the user by email
        const user = await User.findOne({ email });
        // If user doesn't exist
        if (!user) {
          return done(null, false, { message: "Invalid credentials" });
        }

        crypto.pbkdf2(
          password,
          user.salt,
          310000,
          32,
          "sha256",
          async function (err, hashedPassword) {
            if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
              return done(null, false, { message: "invalid credentials" });
            }
            // const token = jwt.sign(sanitizeUser(user), SECRET_KEY);
            console.log("login successful");
            done(null, sanitizeUser(user)); // this lines sends to serializer
          }
        );
      } catch (error) {
        return done(error);
      }
    }
  )
);

// this creates session variable req.user on being called from callbacks
// Serialize user for session
// passport.serializeUser((user, done) => {
//   console.log("serializer ko user mil raha hai", user);
//   if (user) {
//     return done(null, user.id);
//   }
//   return done(null, false);
// });

// // this changes session variable req.user when called from authorized request

// // Deserialize user from session
// passport.deserializeUser(async (id, done) => {
//   try {
//     console.log("deserializer ko id mil rahi hai", id);
//     const user = await User.findOne({ _id: id });
//     return done(null, sanitizeUser(user));
//   } catch (error) {
//     return done(error);
//   }
// });
app.listen(process.env.PORT, () => {
  console.log("server started");
});
