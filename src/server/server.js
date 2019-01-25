const express = require('express');
const app = express();
const PostRouter = require('../routes/PostRouter');
const AuthRouter = require('../routes/AuthRouter');

const PORT = 3000;

app.use('/api', PostRouter);
app.use('/api', AuthRouter);

app.listen(PORT, () => {
	console.log("Server is running on port: " + 3000);
});