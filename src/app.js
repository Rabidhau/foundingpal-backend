const express = require("express");
const cors = require("cors");
const path = require("path");

const notFoundMiddleware = require("./middleware/not-found");
const errorMiddleware = require("./middleware/error-handler");

const authRoute = require("./routes/auth");
const ideaRoute = require("./routes/idea");
const imageRoute = require("./routes/image");
const userRoute = require("./routes/users");
const payRoute = require("./routes/payment");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Serve static uploads
app.use("/uploads", express.static(path.join(__dirname, "public/uploads"))); 

// Use namespaced API routes
app.use("/", ideaRoute);
app.use("/", authRoute);
app.use("/", imageRoute); // Updated path for clarity
app.use("/", userRoute);
app.use("/", payRoute);

// Error Handling Middleware
app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});