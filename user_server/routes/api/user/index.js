const express = require('express');
const router = express.Router();
const db = require('../../../database/mysql');
const jwt = require('jsonwebtoken');

// 토큰 생성 함수 선언
function generateJWT(user_id, user_type, secretKey){
    const payload = { user_id, user_type };
    // const option = { expiresIn };

    const token = jwt.sign(payload, secretKey);
    return token;
}

// GET all users
router.get('/', (req, res) => {
    db.query('SELECT * FROM USERS', (error, results) => {
        if (error) {
            console.error('Error retrieving users:', error);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json(results);
        }
    });
});

// 회원가입
router.post('/signup', (req, res) => {
    const { type, login_id, password, name, phone } = req.body;

    db.query('INSERT INTO USERS (`type`, login_id, password, name, phone) VALUES(?, ?, ?, ?, ?)', [type, login_id, password, name, phone], (error, results) => {
        if (error) {
            console.error('Error creating user:', error);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json({ message: '회원가입 완료! ' + name+ "님 환영합니다." });
        }
    });
});


// 회원정보 수정
router.put('/update/:id', (req, res) => {
    const userId = req.params.id;
    const { login_id, password, name, phone } = req.body;

    db.query('UPDATE USERS SET  name=?, phone=? WHERE login_id =? and password =? and id =?', [login_id, password, name, phone, userId], (error, results) => {
        if (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ error: '아이디와 비밀번호를 확인하세요.' });
        } else {
            res.json({ message: '수정이 완료되었습니다!' });
        }
    });
});

//로그인
router.get('/login',(req, res) => {

    const login_id = req.body.login_id
    const password = req.body.password

    console.log("request : " + login_id +"," + password)

    db.query("SELECT * FROM USERS WHERE login_id=? and password =?", [login_id, password], (error, results) => {
        if (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ error: '로그인 실패! 아이디와 패스워드를 확인하세요.' });
        } else {
            const user_type = results[0].type;
            const user_id = results[0].id;
            console.log("user_type: " + user_type + "user_id: " + user_id);

            const secretKey = 'test1234'
            // const expiresIn = '5m'
            const token = generateJWT(user_id, user_type, secretKey);
            console.log(token);

            if(user_type == 1){
                res.json({message : '로그인 성공! 주최자님 환영합니다. Token: ' + token})
            }else {
                res.json({message: '로그인 성공! 개인 사용자님 환영합니다. Token: ' + token})
            } 

        }
    })

})

// 회원 탈퇴
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM USERS WHERE id = ?', [id], (error, results) => {
        if (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        if (results.affectedRows > 0) {
            res.json({ id });
        } else {
            res.status(404).json({ error: 'Data not found' });
        }
    });
});

module.exports = router;
