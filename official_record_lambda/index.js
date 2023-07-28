const AWS = require('aws-sdk');

AWS.config.update({ region: 'ap-northeast-2' }); // 리전을 필요에 따라 변경하세요.

const docClient = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();

exports.handler = async (event) => {
  try {
    const record = event.Records[0]; // 첫 번째 트리거 레코드만 조회하도록 설정

    // 트리거로 들어온 데이터의 키 값 추출
    const keyObject = record.dynamodb.Keys.id;
    const key = keyObject.N
    const id = parseInt(key)

    const params = {
      TableName: 'official_record',
      Key: { id: id }
    };

    const data = await docClient.get(params).promise();

    console.log(data)
    
    const user_id = data.Item.user_id
    const marathon_id = data.Item.marathon_id

    const params2 = {
      TableName: 'official_marathon',
      Key: { id: marathon_id }
    }

    const data2  = await docClient.get(params2).promise();
    console.log(data2)
    const marathon_point = data2.Item.point;

   // const result =  "user_id: " + user_id + ", marathon_id: " + marathon_id + ", marathon_point :" + marathon_point 
   const result = {
      user_id: user_id,
      marathon_id: marathon_id,
      marathon_point: marathon_point
    };

    const jsonResult = JSON.stringify(result);

    console.log(jsonResult);

    //const message = JSON.stringify(result);

    const snsParams = {
      TopicArn: 'arn:aws:sns:ap-northeast-2:477644685304:api_receive', 
      Message: jsonResult
    };

    await sns.publish(snsParams).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(data.Item),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
