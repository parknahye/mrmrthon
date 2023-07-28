// DynamoDB 데이터베이스 연결 설정
const AWS = require('aws-sdk')
const dynamoClient = new AWS.DynamoDB.DocumentClient()

const MARATHON = "official_marathon"

// 마라톤 전체조회
const getMarathons = async () => {
    const params = {
        TableName: MARATHON
    }

    const list = await dynamoClient.scan(params).promise()
    return list
}

// 특정 마라톤 조회
const getMarathonsById = async (id) => {
    const params = {
      TableName: MARATHON,
      Key: {
        id: id
      }
    }
    console.log(params)
    const list = await dynamoClient.get(params).promise()
    return list
  }

// 새로운 마라톤 추가
const addMarathon = async (list) => {
    const params = {
        TableName: MARATHON,
        Item: list
    }

    return await dynamoClient.put(params).promise()
}

// 마라톤 업데이트
const updateMarathons = async (id, data) => {
    const params = {
      TableName: MARATHON,
      Key: {
        id: id
      },
      UpdateExpression: 'SET title = :newtitle',
      ExpressionAttributeValues: {
        ':newtitle': data.title
      },
      ReturnValues: 'ALL_NEW'
    }
  
    return await dynamoClient.update(params).promise()
  }

// 마라톤 삭제
const deleteMarathon= async (id) => {
    const params = {
        TableName: MARATHON,
        Key: {
            id: id 
        }
    }

    return await dynamoClient.delete(params).promise()
}

module.exports = {
    getMarathons,
    getMarathonsById,
    addMarathon,
    updateMarathons,
    deleteMarathon
}