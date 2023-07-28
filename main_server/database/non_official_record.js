const AWS = require('aws-sdk')
const dynamoClient = new AWS.DynamoDB.DocumentClient()

const NON_OFFICIAL_RECORD = "non_official_record"

const getNonOfficialRecord = async () => {
    const params = {
      TableName: NON_OFFICIAL_RECORD
    }
  
    const list = await dynamoClient.scan(params).promise()
    return list
  }

const addNonOfficialRecord = async (data) => {
const params = {
    TableName: NON_OFFICIAL_RECORD,
    Item: data
}

return await dynamoClient.put(params).promise()
}


const updateNonOfficialRecord = async (id, data) => {
    const record = parseFloat(data.record);
    const params = {
        TableName: NON_OFFICIAL_RECORD,
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

const deleteNonOfficialRecord = async (id) => {
    const params = {
      TableName: NON_OFFICIAL_RECORD,
      Key: {
        id: id
      }
    }
  
    return await dynamoClient.delete(params).promise()
  }

module.exports = {
    getNonOfficialRecord,
    addNonOfficialRecord,
    updateNonOfficialRecord,
    deleteNonOfficialRecord
}