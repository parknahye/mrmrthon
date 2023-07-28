const mysql = require('mysql');

exports.handler = async (event) => {

    console.log(process.env.MYSQL_HOST)
    // MySQL 연결 설정
    const connection = mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
    });
    console.log(connection)
    
    const test = event.Records[0]
    const json = JSON.parse(test.body).Message

    console.log(test)
    console.log(json)

    const json2 = JSON.parse(json)
    console.log(typeof (json2))

    const user_id = json2.user_id
    const point = json2.marathon_point
    const marathon_id = json2.marathon_id



    try {
        // 연결 시작
        await new Promise((resolve, reject) => {
            connection.connect((error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });

        // 데이터베이스에 쿼리 실행
        await new Promise((resolve, reject) => {
            const sql = "INSERT INTO POINT (user_id, `point`, marathon_id) VALUES(?, ?, ?)";
            connection.query(sql, [user_id, point, marathon_id], (error) => {
                if (error) {
                    console.error('Error occurred:', error);
                    reject(error);
                } else {
                    console.log('successfully updated!', 'user_id:', user_id, 'point:', point, 'marathon_id :', marathon_id);
                    resolve();
                }
            });
        });

        await new Promise((resolve, reject) => {
            const sql = "UPDATE USERS SET total_point=total_point+? WHERE id=?";
            connection.query(sql, [point, user_id], (error) => {
                if (error) {
                    console.error('Error occurred:', error);
                    reject(error);
                } else {
                    console.log('successfully updated!', 'user_id:', user_id, 'point:', point);
                    resolve();
                }
            });
        });


        // 응답 생성
        const response = {
            statusCode: 200,
            body: 'Scores updated successfully.'
        };

        return response;
    } finally {
        // 연결 종료
        connection.end();
    }
};
