import express from 'express';
const app = express();
const port = 3000;  // You can change this port

// Serve static files from the "dist" folder
app.use(express.static('dist'));

app.listen(port, () => {
  console.log(`Deploying dist...`)
  console.log(`Server is running at http://localhost:${port}`);
});
