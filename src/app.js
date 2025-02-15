const express = require("express");
const cors = require('cors');

const notFoundMiddleware = require("./middleware/not-found");
const errorMiddleware = require("./middleware/error-handler");

const app = express();

const authRoute = require("./routes/auth");
const ideaRoute = require("./routes/idea");

// middleware
app.use(express.json());
app.use(cors());

app.use("/", ideaRoute);
app.use("/", authRoute);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.listen(3000);
