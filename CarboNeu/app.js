const express = require("express");
const session = require("express-session");
const passport = require("passport");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");
const engine = require("ejs-mate");
const User = require("./Models/user");
const userRoutes = require("./router/user");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const flash = require("connect-flash");

dotenv.config();
connectDB();
const app = express();

app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use("/assets", express.static("assets"));

// --- SESSION CONFIG ---
app.use(
  session({
    secret: "yourSecretKey", // you can move this to .env
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());

// --- PASSPORT INIT ---
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentUser = req.user || null;
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// --- PASSPORT LOCAL STRATEGY ---
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) return done(null, false, { message: "No user found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
          return done(null, false, { message: "Incorrect password" });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// --- SERIALIZE / DESERIALIZE USER ---
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routers
const inputRouter = require("./router/input");
const analyticsRouter = require("./router/analytics");
const neutralization = require("./router/neutral");

// Main Routes
// app.get('/', (req, res) => {
//     res.render('pages/index');
// });
app.use("/input", inputRouter);
app.use("/neutral", neutralization);
app.use("/analytics", analyticsRouter);
app.use("/home", (req, res) => res.render("pages/index")); // Home page
app.use("/", userRoutes);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
