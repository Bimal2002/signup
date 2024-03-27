const express = require('express');
const userRouter = require('./routes/user');
const blogRouter = require('./routes/blog');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/v1/user', userRouter);
app.use('/api/v1/blog', blogRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
