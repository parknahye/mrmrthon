const express = require('express')
const router = express.Router();
router.use(express.json())

const { decodeToken, secretKey } = require('../../../app')

/*      import all our functions from the dynamodb.js
        that perform crud operations
*/
const { getOfficialRecord, addOfficialRecord, updateOfficialRecord, deleteOfficialRecord } = require('../../../database/dynamodb')
const mysql = require('../../../database/mysql')

//const err ="에러 발생"

// 공식 기록 조회
router.get('/', async (req, res) => {
        try {
                const officialRecord = await getOfficialRecord()
                res.json(officialRecord)
        } catch (error) {
                console.error(error)
                res.status(500).json({ err: `Something went wrong` })
        }

})

// 공식 기록 추가
router.post('/', async (req, res) => {
        // 토큰 검증
        const token = req.headers['authorization'];
        console.log('your token: ' + token);
        const decoded = decodeToken(token, secretKey);
        if (decoded) {
                const { user_id, user_type } = decoded;
                console.log('In decoded token, user_id: ' + user_id + ' user_type: ' + user_type);

                if (decoded.user_type == 1) {
                        const user_id = req.body.user_id;
                        const marathon_id = req.body.marathon_id;

                        const data = req.body;

                        try {
                                // const officialRecord = await addOfficialRecord(data);
                                await addOfficialRecord(data);

                                res.json("user_id : " + user_id + ", marathon_id : " + marathon_id)
                        } catch (err) {
                                console.error(err);
                                res.status(500).json({ err: 'Something went wrong' });
                        }
                } else {
                        res.json('제한된 접근! 대회 주최자만 접근 가능합니다.')
                }
        }
        else {
                res.json('제한된 접근! 대회 주최자만 접근 가능합니다.')
        }

});

// 공식 기록 수정
router.put('/:id', async (req, res) => {
        // 토큰 검증
        const token = req.headers['authorization'];
        console.log('your token: ' + token);
        const decoded = decodeToken(token, secretKey);
        if (decoded) {
                const { user_id, user_type } = decoded;
                console.log('In decoded token, user_id: ' + user_id + ' user_type: ' + user_type);

                if (decoded.user_type == 1) {
                        const { id } = req.params
                        const offocialRecordData = req.body

                        try {
                                const parsedId = parseInt(id, 10)
                                const updateById = await updateOfficialRecord(parsedId, offocialRecordData)
                                res.json(updateById)
                        } catch (error) {
                                console.error(error)
                                res.status(500).json({ err: `Something went wrong` })
                        }
                } else {
                        res.json('제한된 접근! 대회 주최자만 접근 가능합니다.')
                }
        }
        else {
                res.json('제한된 접근! 대회 주최자만 접근 가능합니다.')
        }



})

// 공식 기록 삭제
router.delete('/:id', async (req, res) => {
        // 토큰 검증
        const token = req.headers['authorization'];
        console.log('your token: ' + token);
        const decoded = decodeToken(token, secretKey);
        if (decoded) {
                const { user_id, user_type } = decoded;
                console.log('In decoded token, user_id: ' + user_id + ' user_type: ' + user_type);

                if (decoded.user_type == 1) {
                        const { id } = req.params
                        try {
                                // 정수형으로 변환
                                const parsedId = parseInt(id, 10)
                                const deleteById = await deleteOfficialRecord(parsedId)
                                res.json(deleteById)
                        } catch (error) {
                                console.error(error)
                                res.status(500).json({ err: `Something went wrong` })
                        }
                } else {
                        res.json('제한된 접근! 대회 주최자만 접근 가능합니다.')
                }
        }
        else {
                res.json('제한된 접근! 대회 주최자만 접근 가능합니다.')
        }


})


module.exports = router