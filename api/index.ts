const express = require("express");
const app = express();
//mongodb+srv://ArtRIFF:<password>@cluster0.psgko3h.mongodb.net/
app.get("/", (req: any, res: { send: (arg0: string) => any; }) => res.send("Express on Vercel"));

app.listen(3000, () => console.log("Server ready on port 3000."));

module.exports = app;