const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

// 内存存储（上线建议改成数据库）
let appData = {
  flowers: [
    { id: '1', name: '我的小花', waterCount: 0, growthLog: [] }
  ],
  wreaths: [],
  currentFlowerId: '1',
  currentWreathId: null,
  isEditor: false
};

app.get('/api/data', (req, res) => {
  res.json(appData);
});

app.post('/api/update', (req, res) => {
  appData = req.body;
  io.emit('dataUpdate', appData); // 实时广播
  res.json({ ok: true });
});

io.on('connection', (socket) => {
  console.log('有用户连接');
});

server.listen(3000, () => {
  console.log('后端服务已启动 http://localhost:3000');
});
