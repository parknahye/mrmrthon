const express = require('express');
const app = express();
const port = 9000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('host: '+ process.env.MYSQL_HOST);
});

const userRouter = require('./routes/api/user/index');
app.use('/user', userRouter);


app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});