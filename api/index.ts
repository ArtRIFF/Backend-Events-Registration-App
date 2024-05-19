const express = require("express");
const app = express();


app.get("/", (req: any, res: { send: (arg0: string) => any; }) => {
	console.log("/----------------");
  res.send("Express on Vercel")
	
});

app.get("/check", (req: any, res: { send: (arg0: string) => any; }) => {
  console.log("/check----------");
	res.send("checked")
	
});

app.listen(3000, () => console.log("Server ready on port 3000."));



