// import express
const express = require('express')
const router = express.Router();
router.use(express.json())

const {decodeToken, secretKey} = require('../../../app')


/*      import all our functions from the dynamodb.js
        that perform crud operations
*/
const {getPlayer, getMarathonsById, addPlayer, deletePlayer} = require('../../../database/dynamodb')


const err ="에러 발생"


// 참가자 전체조회
router.get('/', async (req, res) => {
        try {
                const player = await getPlayer()
                res.json(player)
        } catch (error) {
                console.error(error)
                res.status(500).json({err: `Something went wrong`})
        }
        
})

// 특정 참가자 조회
router.get('/:id', async (req, res) => {
        const { id } = req.params
        try {
                const parsedId = parseInt(id, 10)
                const player = await getMarathonsById(parsedId)
                res.json(player)
        } catch (error) {
                console.error(error)
                res.status(500).json({err: `Something went wrong`})
        }
        
})


// 참가자 등록
router.post('/add', async (req, res) => {
        // 토큰 검증
        const token = req.headers['authorization'];
        console.log('your token: ' + token);
        const decoded = decodeToken(token, secretKey);
        if (decoded) {
                const { user_id, user_type } = decoded;
                console.log('In decoded token, user_id: ' + user_id + ' user_type: ' + user_type);

                if ( decoded.user_type == 0) {
                        const data = req.body
                        try {
                                const newPlayer = await addPlayer(data)
                                res.json(newPlayer)
                        } catch (error) {
                                console.error(error)
                                res.status(500).json({err: `Something went wrong`})
                        }
                }else {
                        res.json('제한된 접근! 개인 사용자만 접근 가능합니다.')
                }
        }
        else {
                res.json('제한된 접근! 개인 사용자만 접근 가능합니다.')
        }

})

// 특정 참가자 삭제
router.delete('/:id', async (req, res) => {
        const { id } = req.params

        try {
                // 정수형으로 변환
                const parsedId = parseInt(id, 10)
                const deleteById = await deletePlayer(parsedId)

                res.json(deleteById)
        } catch (error) {
                console.error(error)
                res.status(500).json({err: `Something went wrong`})
        }
});

module.exports = router