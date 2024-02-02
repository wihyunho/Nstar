const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()
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

app.get('/getDBResaturant', async (req, res) => {
  try {
    const query = {
      text: "SELECT * FROM old_restaurant WHERE addr LIKE $1 LIMIT 10",
      values: ['%성수%'],
    };

    const result = await dbClient.query(query);
    res.send(result.rows);
  } catch (e) {
    console.error(e.stack);
    res.status(500).send("서버 에러 발생");
  }
});

app.get('/getDBRestaurant2', async (req, res) => {
  try {
    // Prisma Client를 사용하여 쿼리 실행
    const result = await prisma.oldRestaurant.findMany({
      where: {
        addr: {
          contains: '성수',
        },
      },
      take: 10,
    });

    res.send(result);
  } catch (e) {
    console.error(e);
    res.status(500).send("서버 에러 발생");
  }
});

app.post('/getDBRestaurant', async (req, res) => {
  try {
    var params = req.body; // POST 요청이므로 일반적으로 req.body를 사용합니다.

    // Prisma Client 인스턴스를 가져옵니다.
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    const { itemsPerPage, curPage } = params;
    const restaurants = await prisma.oldRestaurant.findMany({
      where: {
        addr: {
          contains: '성수',
        },
      },
      orderBy: {
        start_date: 'asc',
      },
      take: itemsPerPage,
      skip: (curPage - 1) * itemsPerPage,
      select: {
        name: true,
        addr: true,
        category: true,
        start_date: true,
      }    
    });
    

    // start_date를 'yyyy-mm-dd' 형식으로 포맷하려면, 결과를 받은 후 JavaScript로 처리해야 합니다.
    // Prisma 자체적으로 날짜 포맷을 변경하는 기능은 제공하지 않습니다.
    var result1 = restaurants.map(restaurant => ({
        ...restaurant,
        start_date: restaurant.start_date.toISOString().split('T')[0], // 'yyyy-mm-dd' 형식으로 변환
    }));

    var result2 = await prisma.oldRestaurant.count({
      where: {
        addr: {
          contains: '성수',
        },
      },
    });
    
    console.log(result1);
    console.log(result2);
    // 두 결과를 하나의 객체로 결합
    const responseData = {
      data: result1, // 첫 번째 쿼리 결과
      totalCount: result2 // 두 번째 쿼리에서 totalCount 추출
    };

    res.send(responseData);
  } catch (e) {
    console.error(e.stack);
    res.status(500).send("서버 에러 발생");
  }
});

app.get('/getPlaceList', async (req, res) => {
  try {
    // Prisma Client를 사용하여 쿼리 실행
    const result = await prisma.restaurant.findMany({
      where: {
        old_addr: {
          contains: '성수',
        },
      },
      take: 10,
    });

    res.send(result);
  } catch (e) {
    console.error(e);
    res.status(500).send("서버 에러 발생");
  }
});

app.post('/getPlaceList', async (req, res) => {
  try {
    var params = req.body; // POST 요청이므로 일반적으로 req.body를 사용합니다.

    // Prisma Client 인스턴스를 가져옵니다.
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    const { itemsPerPage, curPage } = params;
    const restaurants = await prisma.restaurant.findMany({
      where: {
        old_addr: {
          contains: '성수',
        },
      },
      take: itemsPerPage,
      skip: (curPage - 1) * itemsPerPage,
      select: {
        name: true,
        old_addr: true,
        category_nm: true,
        update_date: true,
      }
    });


    // start_date를 'yyyy-mm-dd' 형식으로 포맷하려면, 결과를 받은 후 JavaScript로 처리해야 합니다.
    // Prisma 자체적으로 날짜 포맷을 변경하는 기능은 제공하지 않습니다.
    var result_one = restaurants.map(item => ({
      ...item,
      update_date: item.update_date.toISOString().split('T')[0], // 'yyyy-mm-dd' 형식으로 변환
    }));

    var result_two = await prisma.restaurant.count({
      where: {
        old_addr: {
          contains: '성수',
        },
      },
    });

    console.log(result_one);
    console.log(result_two);
    // 두 결과를 하나의 객체로 결합
    const responseData = {
      data: result_one, // 첫 번째 쿼리 결과
      totalCount: result_two // 두 번째 쿼리에서 totalCount 추출
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

