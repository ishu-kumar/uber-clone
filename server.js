import http from "http";
import app from "./app.js";
import connectToDB from "./db/db.js";
import {PORT} from "./config/env.js"

const server = http.createServer(app);

connectToDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Field to connet db ${err.message}`);
  });
