const AWS = require('aws-sdk')
const dynamoClient = new AWS.DynamoDB.DocumentClient()

const OFFICIAL_RECORD = "official_record"
const MARATHON = "official_marathon"


const getOfficialRecord = async () => {
    const params = {
      TableName: OFFICIAL_RECORD
    }
  
    const list = await dynamoClient.scan(params).promise()
    return list
  }

const addOfficialRecord = async (data) => {
const params = {
    TableName: OFFICIAL_RECORD,
    Item: data
}

return await dynamoClient.put(params).promise()
}

const selectPointByMid = async (marathon_id) => {

    const params = {
      TableName: MARATHON,
      Key: {
        id: marathon_id
      }
    }

    const list = await dynamoClient.get(params).promise()
    const pointByMid = list.Item.point
    return pointByMid
  }

const updateOfficialRecord = async (id, data) => {
    const record = parseFloat(data.record);
    const params = {
        TableName: OFFICIAL_RECORD,
        Key: {
        id: id
        },
        UpdateExpression: 'SET #officialRecord = :newrecord',
        ExpressionAttributeNames: {
            '#officialRecord': 'record'
          },
          ExpressionAttributeValues: {
            ':newrecord': record
          },
          ReturnValues: 'ALL_NEW'
        };

return await dynamoClient.update(params).promise()
}

const deleteOfficialRecord = async (id) => {
    const params = {
      TableName: OFFICIAL_RECORD,
      Key: {
        id: id
      }
    }
  
    return await dynamoClient.delete(params).promise()
  }

module.exports = {
    getOfficialRecord,
    addOfficialRecord,
    selectPointByMid,
    updateOfficialRecord,
    deleteOfficialRecord
}