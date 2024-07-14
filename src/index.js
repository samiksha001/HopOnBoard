const express = require("express");
const app = express();
const path = require("path");
const bcrypt = require("bcryptjs");
const collection = require("./mongodb");

// Middleware to parse incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up paths
const templatePath = path.join(__dirname, '../templates');
const publicPath = path.join(__dirname, '../');

// Set up view engine
app.set("view engine", "hbs");
app.set("views", templatePath);

// Serve static files from the public directory
app.use(express.static(publicPath));

// Route for the root page
app.get("/", (req, res) => {
    res.render("Page1");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.sendFile(path.join(publicPath, 'signup.html'));
});

app.post("/signup", async (req, res) => {
    try {
        console.log('Request body:', req.body);
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).send("All fields are required.");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const data = { name, email, password: hashedPassword };
        await collection.insertMany([data]);
        res.redirect("/home");
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).send("An error occurred during signup.");
    }
});

app.post("/login", async (req, res) => {
    try {
        console.log('Request body:', req.body);
        const { email, password } = req.body;
        const user = await collection.findOne({ email });

        if (user && await bcrypt.compare(password, user.password)) {
            res.redirect("/home");
        } else {
            res.status(401).send("Invalid credentials");
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send("An error occurred during login.");
    }
});

app.get("/home", (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(7000, () => {
    console.log("Server is running on port 7000");
});
