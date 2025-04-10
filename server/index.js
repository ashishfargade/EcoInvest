import app from "./app.js";
import { connectDB } from "./db.js";
import { port } from "./config.js";

try {
    await connectDB();

    app.listen(port, () => {
        console.log(`Server running on PORT ${port}`);
    });
} catch (err) {
    console.error("Error starting server: ", err.message);
}
