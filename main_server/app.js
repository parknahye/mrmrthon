const express = require('express');
const app = express();
const port = 9000;
const jwt = require('jsonwebtoken');

app.use(express.json());

const secretKey = 'test1234';

function decodeToken(token, secretKey){
    if( token === undefined){
        console.log('In decodToken Function, Your token is undefined');
        return null;
    }
    const token2 = token.split(' ')[1];

    try {
        const decodedToken = jwt.verify(token2, secretKey);
        console.log('In decodToken Function, Token verification success. your decoded token: ' + decodedToken);
        return decodedToken;
    } catch (error) {
        console.log('In decodToken Function, Token verification failed');
        console.error(error);
        return null;
    }
}

module.exports = {
    app,
    decodeToken,
    secretKey
};


app.get('/', (req, res) => {
    res.send('access key: ' + process.env.AWS_ACCESS_KEY_ID);
});

app.get('/token', (req, res) => {
    res.send('user_id: ' + user_id + ' user_type: ' + user_type);
});

const marathonRouter = require('./routes/api/marathon/index');
app.use('/marathon', marathonRouter);

const playerRouter = require('./routes/api/player/index');
app.use('/player', playerRouter);

const pointRouter = require('./routes/api/point/index');
app.use('/point', pointRouter);

const officialRecordRouter = require('./routes/api/official_record/index');
app.use('/official_record', officialRecordRouter);

const nonOfficialRecordRouter = require('./routes/api/non_official_record/index');
app.use('/non_official_record', nonOfficialRecordRouter);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});