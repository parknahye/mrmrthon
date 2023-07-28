// import express
const express = require('express')
const router = express.Router();
router.use(express.json())

/*      import all our functions from the dynamodb.js
        that perform crud operations
*/
const {getNonOfficialRecord, addNonOfficialRecord, updateNonOfficialRecord, deleteNonOfficialRecord} = require('../../../database/dynamodb')
const {decodeToken, secretKey} = require('../../../app')

//const err ="에러 발생"

// 비공식 기록 조회
router.get('/', async (req, res) => {
    try {
            const nonOfficialRecord = await getNonOfficialRecord()
            res.json(nonOfficialRecord)
    } catch (error) {
            console.error(error)
            res.status(500).json({err: `Something went wrong`})
    }
    
})

// 비공식 기록 추가
router.post('/add', async (req, res) => {
        // 토큰 검증
        const token = req.headers['authorization'];
        console.log('your token: ' + token);
        const decoded = decodeToken(token, secretKey);
        if (decoded) {
                const { user_id, user_type } = decoded;
                console.log('In decoded token, user_id: ' + user_id + ' user_type: ' + user_type);

                if ( decoded.user_type == 0) {
                        const data = req.body;
                        try {
                        const officialRecord = await addNonOfficialRecord(data);
                        res.json(officialRecord)
                        } catch (err) {
                        console.error(err);
                        res.status(500).json({ err: 'Something went wrong' });
                        }
                }else {
                        res.json('제한된 접근! 개인 사용자만 접근 가능합니다.')
                }
        }
        else {
                res.json('제한된 접근! 개인 사용자만 접근 가능합니다.')
        }
    
  });

// 비공식 기록 수정
router.put('/:id', async (req, res) => {
        // 토큰 검증
        const token = req.headers['authorization'];
        console.log('your token: ' + token);
        const decoded = decodeToken(token, secretKey);
        if (decoded) {
                const { user_id, user_type } = decoded;
                console.log('In decoded token, user_id: ' + user_id + ' user_type: ' + user_type);

                if (decoded.user_type == 0) {
                        const { id } = req.params
                        const offocialRecordData = req.body

                        try {
                                const parsedId = parseInt(id, 10)
                                const updateById = await updateNonOfficialRecord(parsedId, offocialRecordData)
                                res.json(updateById)
                        } catch (error) {
                                console.error(error)
                                res.status(500).json({ err: `Something went wrong` })
                        }
                } else {
                        res.json('제한된 접근! 개인 사용자만 접근 가능합니다.')
                }
        }
        else {
                res.json('제한된 접근! 개인 사용자만 접근 가능합니다.')
        }

        c

})

// 비공식 기록 삭제
router.delete('/:id', async (req, res) => {
        // 토큰 검증
        const token = req.headers['authorization'];
        console.log('your token: ' + token);
        const decoded = decodeToken(token, secretKey);
        if (decoded) {
                const { user_id, user_type } = decoded;
                console.log('In decoded token, user_id: ' + user_id + ' user_type: ' + user_type);

                if ( decoded.user_type == 0) {
                        const { id } = req.params
                        try {
                                // 정수형으로 변환
                                const parsedId = parseInt(id, 10)
                                const deleteById = await deleteNonOfficialRecord(parsedId)
                                res.json(deleteById)
                        } catch (error) {
                                console.error(error)
                                res.status(500).json({ err: `Something went wrong` })
                        }
                } else {
                        res.json('제한된 접근! 개인 사용자만 접근 가능합니다.')
                }
        }
        else {
                res.json('제한된 접근! 개인 사용자만 접근 가능합니다.')
        }
    
    
})


module.exports = router