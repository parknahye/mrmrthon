// import express
const express = require('express')
const router = express.Router();
router.use(express.json())

/*      import all our functions from the dynamodb.js
        that perform crud operations
*/
const {getMarathons, addMarathon, updateMarathons, deleteMarathon} = require('../../../database/dynamodb')

const {decodeToken, secretKey} = require('../../../app')

const err ="에러 발생"


// 마라톤 전체조회
router.get('/', async (req, res) => {
        // 토큰 검증
        const token = req.headers['authorization'];
        console.log('your token: ' + token);
        const decoded = decodeToken(token, secretKey);
        if (decoded) {
                const { user_id, user_type } = decoded;
                console.log('In decoded token, user_id: ' + user_id + ' user_type: ' + user_type);
        
                if ( decoded.user_type == 1) {
                        try {
                                const marathon = await getMarathons()
                                res.json(marathon)
                        } catch (error) {
                                console.error(err)
                                res.status(500).json({err: `Something went wrong`})
                        }
                }else {
                        res.json('제한된 접근! 대회 주최자만 접근 가능합니다.')
                }
        }
        else {
                res.json('제한된 접근! 대회 주최자만 접근 가능합니다.')
        }
        
})

// 특정 마라톤 조회
// router.get('/:id', async (req, res) => {
//         const { id } = req.params
//         try {
//                 const parsedId = parseInt(id, 10)
//                 const marathon = await getMarathonsById(parsedId)
//                 res.json(marathon)
//         } catch (error) {
//                 console.error(error)
//                 res.status(500).json({err: `Something went wrong`})
//         }
        
// })


// 새로운 마라톤 추가
router.post('/add', async (req, res) => {
        // 토큰 검증
        const token = req.headers['authorization'];
        console.log('your token: ' + token);
        const decoded = decodeToken(token, secretKey);
        if (decoded) {
                const { user_id, user_type } = decoded;
                console.log('In decoded token, user_id: ' + user_id + ' user_type: ' + user_type);

                if ( decoded.user_type == 1) {
                        const data = req.body
                        try {
                                const newMarathon = await addMarathon(data)
                                res.json(newMarathon)
                        } catch (error) {
                                console.error(err)
                                res.status(500).json({err: `Something went wrong`})
                        }
                }else {
                        res.json('제한된 접근! 대회 주최자만 접근 가능합니다.')
                }
        }
        else {
                res.json('제한된 접근! 대회 주최자만 접근 가능합니다.')
        }


})

// 특정 마라톤 수정
router.put('/update/:id', async (req, res) => {
        // 토큰 검증
        const token = req.headers['authorization'];
        console.log('your token: ' + token);
        const decoded = decodeToken(token, secretKey);
        if (decoded) {
                const { user_id, user_type } = decoded;
                console.log('In decoded token, user_id: ' + user_id + ' user_type: ' + user_type);

                if ( decoded.user_type == 1) {
                        const { id } = req.params
                        const marathonData = req.body
                        try {
                                const parsedId = parseInt(id, 10)
                                const updateById = await updateMarathons(parsedId, marathonData)
                                res.json(updateById)
                        } catch (error) {
                                console.error(error)
                                res.status(500).json({ err: `Something went wrong` })
                        }
                }else {
                        res.json('제한된 접근! 대회 주최자만 접근 가능합니다.')
                }
        }
        else {
                res.json('제한된 접근! 대회 주최자만 접근 가능합니다.')
        }
});

// 특정 마라톤 삭제
router.delete('/:id', async (req, res) => {
        // 토큰 검증
        const token = req.headers['authorization'];
        console.log('your token: ' + token);
        const decoded = decodeToken(token, secretKey);
        if (decoded) {
                const { user_id, user_type } = decoded;
                console.log('In decoded token, user_id: ' + user_id + ' user_type: ' + user_type);
        
                if ( decoded.user_type == 1) {
                        const { id } = req.params
                        try {
                                // 정수형으로 변환
                                const parsedId = parseInt(id, 10)
                                const deleteById = await deleteMarathon(parsedId)
                                res.json(deleteById)
                        } catch (error) {
                                console.error(error)
                                res.status(500).json({err: `Something went wrong`})
                        }
                }else {
                        res.json('제한된 접근! 대회 주최자만 접근 가능합니다.')
                }
        }
        else {
                res.json('제한된 접근! 대회 주최자만 접근 가능합니다.')
        }
        
});

module.exports = router
