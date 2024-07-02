// Setup imports
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { doubleCsrf } = require("csrf-csrf");
const logger = require("./logger");
const expressWinston = require("express-winston");

const {
  doubleCsrfProtection, // This is the default CSRF protection middleware.
  generateToken,        // Generate CSRF tokens
} = doubleCsrf({
  getSecret: () => 'f9hBPxPvhZy2TQRzamQZpq3BLFXUBCpDLBD3maq3FoGjTFdPe1laxDTmikJiddOu', // A function that optionally takes the request and returns a secret
  cookieName: "__Host-psifi.x-csrf-token", // The name of the cookie to be used, recommend using Host prefix.
  size: 64, // The size of the generated tokens in bits
  getTokenFromRequest: (req) => req.headers["x-csrf-token"], // A function that returns the token from the request
});

// Create an Express app
const app = express();

// Enable CORS
const corsOptions = {
  origin: 'http://localhost:4200',
  credentials: true,
  optionsSuccessStatus: 200,
};

// Enable cookie parsing to read CSRF token from cookie
app.use(cors(corsOptions));
app.use(cookieParser("zTJAMljnVbFjoCUEDUIjvNbzSmlYf9X2RaOphoFljH0ssm7KF8wZesHXhjLHOWsN"));
app.use(express.json());

// Middleware to log all requests
app.use(
  expressWinston.logger({
    winstonInstance: logger,
    meta: true, // Log metadata about the request
    msg: "HTTP {{req.method}} {{req.url}}", // Custom message format
    expressFormat: true, // Use Express format
    colorize: false, // Disable colorization
  })
);

// Middleware to log errors
app.use(
  expressWinston.errorLogger({
    winstonInstance: logger,
  })
);

// Middleware to log request headers
app.use((req, res, next) => {
  console.log("Request Headers:", req.headers);
  next();
});

const router = express.Router();

// Route to get CSRF token
router.get("/csrf-token", (req, res) => {
  const csrfToken = generateToken(req, res);
  res.json({ csrfToken });
});

// API endpoint to get the OAuth2 token
router.post("/oauth/token", doubleCsrfProtection, async (req, res) => {
  res.json({ token: 'fake-token' });
});

app.use(doubleCsrfProtection);
app.use("/api", router);

// Define the port
const port = 3000;

// Start the server
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
