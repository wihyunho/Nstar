const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config();
var cors = require('cors');

//DB 접속 정보
const { Client } = require("pg");
const dbClient = new Client({
    user: "postgres",
    host: "192.168.31.90",
    database: "postgres",
    password:process.env.DB_PW,
    port: 5432
});
dbClient.connect();

//서버 포트
app.listen(8080, function () {
  console.log('listening on 8080');
});

//api 사용시 cors 정책 무시 관련
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'hello-react/build')));

app.get('/getDBRestaurant', async (req, res) => {
  try {
    const query = {
      text: "SELECT * FROM restaurant WHERE addr LIKE $1 LIMIT 10",
      values: ['%성수%'],
    };

    const result = await dbClient.query(query);
    res.send(result.rows);
  } catch (e) {
    console.error(e.stack);
    res.status(500).send("서버 에러 발생");
  }
});

app.post('/getDBRestaurant', async (req, res) => {
  try {
    var params = req.body; // POST 요청이므로 일반적으로 req.body를 사용합니다.

    const query1 = {
      text: 
        "SELECT name,addr,category, TO_CHAR(start_date, 'yyyy-mm-dd') as start_date " +
        "FROM restaurant " +
        "WHERE addr LIKE $1 " +
        "ORDER BY start_date " +
        "LIMIT $2 " +
        "OFFSET ($3 - 1) * $2;",
      values: ['%성수%', params.itemsPerPage, params.curPage],
    };
    
    var result1 = await dbClient.query(query1);

    const query2 = {
      text: "SELECT count(*) as totalcount FROM restaurant WHERE addr LIKE $1",
      values: ['%성수%'],
    };

    var result2 = await dbClient.query(query2);

    // 두 결과를 하나의 객체로 결합
    const responseData = {
      data: result1.rows, // 첫 번째 쿼리 결과
      totalCount: result2.rows[0].totalcount // 두 번째 쿼리에서 totalCount 추출
    };

    res.send(responseData);
  } catch (e) {
    console.error(e.stack);
    res.status(500).send("서버 에러 발생");
  }
});



//server에서 정한 방식 외에는 react-router에 연동
app.get('*', function (요청, 응답) {
  응답.sendFile(path.join(__dirname, '/hello-react/build/index.html'));
});