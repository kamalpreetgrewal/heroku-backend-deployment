const express = require('express');
const app = express();
const PostRouter = require('../routes/PostRouter');
const AuthRouter = require('../routes/AuthRouter');

require('babel-register')({
    presets: [ 'env' ]
})

const PORT = 4000;

app.use('/api', PostRouter);
app.use('/api', AuthRouter);

app.listen(PORT, () => {
	console.log("Server is running on port: " + PORT);
})