// marathon.js

const AWS = require('aws-sdk')
const dynamoClient = new AWS.DynamoDB.DocumentClient()

const PLAYER = "player"

// 참가자 전체조회
const getPlayer = async () => {
  const params = {
    TableName: PLAYER
  }

  const list = await dynamoClient.scan(params).promise()
  return list
}

// 특정 참가자 조회
const getPlayerById = async (id) => {
  const params = {
    TableName: PLAYER,
    Key: {
      id: id
    }
  }

  const list = await dynamoClient.scan(params).promise()
  return list
}

// 참가자 신청
const addPlayer = async (data) => {
  const params = {
    TableName: PLAYER,
    Item: data
  }

  return await dynamoClient.put(params).promise()
}

// 참가 취소
const deletePlayer = async (id) => {
  const params = {
    TableName: PLAYER,
    Key: {
      id: id
    }
  }

  return await dynamoClient.delete(params).promise()
}

module.exports = {
  getPlayer,
  getPlayerById,
  addPlayer,
  deletePlayer
}