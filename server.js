const express = require("express");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const app = express();
const PORT = process.env.PORT || 3000;  // 這樣才會兼容 Railway

app.use(express.json());
app.use(express.static("."));

// CSV 檔案路徑
const csvFilePath = path.join(__dirname, "backend_notes.csv");

// CSV 寫入器配置
const csvWriter = createCsvWriter({
  path: csvFilePath,
  header: [
    { id: "houseName", title: "houseName" },
    { id: "city", title: "city" },
    { id: "originalDesc", title: "originalDesc" },
    { id: "backendDesc", title: "backendDesc" },
    { id: "username", title: "username" },
    { id: "timestamp", title: "timestamp" },
  ],
  encoding: "utf8",
});

// 初始化 CSV 檔案
function initializeCSV() {
  if (!fs.existsSync(csvFilePath)) {
    const initialData = [];
    csvWriter.writeRecords(initialData);
  }
}

// 讀取 CSV 資料
app.get("/api/backend-notes", (req, res) => {
  const results = [];

  if (!fs.existsSync(csvFilePath)) {
    initializeCSV();
  }

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on("data", (data) => {
      results.push(data);
    })
    .on("end", () => {
      res.json(results);
    })
    .on("error", (error) => {
      res.status(500).json({ error: "讀取 CSV 檔案失敗" });
    });
});

// 更新後台敘述
// 更新後台敘述
app.post("/api/update-note", (req, res) => {
  const { houseName, city, originalDesc, newNote, username } = req.body;

  if (!newNote || !newNote.trim()) {
    return res.status(400).json({ error: "備註內容不可為空白" });
  }

  // 新增一筆記錄
  const newRecord = {
    houseName,
    city,
    originalDesc,
    backendDesc: newNote,
    username: username || "匿名使用者",
    timestamp: new Date().toISOString(),
  };

  const csvWriterAppend = createCsvWriter({
    path: csvFilePath,
    header: [
      { id: "houseName", title: "houseName" },
      { id: "city", title: "city" },
      { id: "originalDesc", title: "originalDesc" },
      { id: "backendDesc", title: "backendDesc" },
      { id: "username", title: "username" },
      { id: "timestamp", title: "timestamp" },
    ],
    encoding: "utf8",
    append: true, // ✅ 重點：追加而不是覆蓋
  });

  csvWriterAppend
    .writeRecords([newRecord])
    .then(() => {
      res.json({
        success: true,
        updatedDesc: newNote,
      });
    })
    .catch((error) => {
      res.status(500).json({ error: "寫入 CSV 檔案失敗" });
    });
});

//點擊簡毓萱
const clickCountFile = path.join(__dirname, "/data/click-count.json");

// 取得目前點擊次數
app.get("/api/get-click-count", (req, res) => {
  try {
    const raw = fs.readFileSync(clickCountFile, "utf8");
    const json = JSON.parse(raw);
    res.json({ success: true, count: json.count });
  } catch (err) {
    console.error("讀取點擊數錯誤", err);
    res.status(500).json({ success: false, error: "讀取點擊數失敗" });
  }
});

// 點擊一次就遞增
app.post("/api/increment-click", (req, res) => {
  try {
    const raw = fs.readFileSync(clickCountFile, "utf8");
    const json = JSON.parse(raw);
    json.count += 1;
    fs.writeFileSync(clickCountFile, JSON.stringify(json, null, 2), "utf8");
    res.json({ success: true, newCount: json.count });
  } catch (err) {
    console.error("更新點擊數錯誤", err);
    res.status(500).json({ success: false, error: "更新點擊數失敗" });
  }
});

//點擊簡毓萱 end

// 聊天區
const commentsCsv = path.join(__dirname, "/data/Chat.csv");

// 初始化 comments.csv
function initCommentCSV() {
  if (!fs.existsSync(commentsCsv)) {
    fs.writeFileSync(commentsCsv, "username,comment,datetime\n", "utf8");
  }
}
initCommentCSV();

// API: 取得留言列表
app.get("/api/comments", (req, res) => {
  const results = [];
  fs.createReadStream(commentsCsv)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => res.json(results))
    .on("error", () => res.status(500).json({ error: "讀取留言失敗" }));
});

// API: 新增留言
app.post("/api/add-comment", (req, res) => {
  const { username, comment, datetime } = req.body;
  if (!username || !comment) {
    return res.status(400).json({ error: "資料不完整" });
  }

  const newLine = `\n"${username.replace(/"/g, '""')}","${comment.replace(/"/g, '""')}","${datetime}"`;
  fs.appendFile(commentsCsv, newLine, (err) => {
    if (err) {
      res.status(500).json({ error: "寫入留言失敗" });
    } else {
      res.json({ success: true });
    }
  });
});

// 聊天區end

// 啟動伺服器
app.listen(PORT,  () => {
  console.log(`Server running on port ${PORT}`);
  initializeCSV();
});

function initializeCSV() {
  if (!fs.existsSync(csvFilePath)) {
    // 只建立空的 CSV 檔案，不填充預設資料
    const initialData = [];

    csvWriter
      .writeRecords(initialData)
      .then(() => {
        console.log("CSV 檔案已初始化（空檔案）。");
      })
      .catch((error) => {
        console.error("初始化 CSV 檔案失敗:", error);
      });
  }
}
