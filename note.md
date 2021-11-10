# 開發環境與套件安裝

### nodeJS 安裝方式:

1.[官網下載](https://nodejs.org/zh-tw/download/)

2.nvm工具安裝 可指定nodeJS版本號和切換 [安裝教學](https://titangene.github.io/article/nvm.html)

### 檢查安裝結果

npm為nodeJS套件模組的管理工具，安裝nodeJS好也會一併安裝完成。

```shell
node -v 
// v12.13.0

npm -v
// 6.12.0

```

### 套件安裝

在專案資料夾下安裝套件前，可以先初始化

```shell
npm init

```

或選擇直接安裝第一個套件 express

```shell
npm install express

//express@4.17.1
//added 50 packages from 37 contributors and audited 50 packages in 4.261s
//found 0 vulnerabilities

```

安裝結果: package.json dependencies中就會出現剛剛安裝好的套件。 [![](https://books.greattree.com.tw/uploads/images/gallery/2021-10/scaled-1680-/image-1635127880186.jpg)](https://books.greattree.com.tw/uploads/images/gallery/2021-10/image-1635127880186.jpg)

本機啟動express app服務 在設置監聽路由的部分，也加上了一個404的對應

```shell
const express = require("express")
const port = 3010;

const app = express();

app.get('/',(req,res)=>{
    res.send('Hello Express App')
})

app.get('*',(req,res)=>{
    res.send('404')
})

app.listen(port,()=>{
    console.log("app is listening at port" + port)
})

```

[![](https://books.greattree.com.tw/uploads/images/gallery/2021-10/scaled-1680-/image-1635141074694.jpg)](https://books.greattree.com.tw/uploads/images/gallery/2021-10/image-1635141074694.jpg)

# line官方頻道 、 Messaging API、mongoDB 設定

### 官方line

[官方line後台連結](https://manager.line.biz/)  
1.建一個官方頻道 「豆皮」 [![](https://books.greattree.com.tw/uploads/images/gallery/2021-10/scaled-1680-/image-1635130570130.jpg)](https://books.greattree.com.tw/uploads/images/gallery/2021-10/image-1635130570130.jpg)

### line developer

[開發者後台連結](https://developers.line.biz/zh-hant/)

1.登入 [![](https://books.greattree.com.tw/uploads/images/gallery/2021-10/scaled-1680-/image-1635129092147.jpg)](https://books.greattree.com.tw/uploads/images/gallery/2021-10/image-1635129092147.jpg)

2.line Messaging API服務開啟 [![](https://books.greattree.com.tw/uploads/images/gallery/2021-10/scaled-1680-/image-1635130603398.jpg)](https://books.greattree.com.tw/uploads/images/gallery/2021-10/image-1635130603398.jpg)

[![](https://books.greattree.com.tw/uploads/images/gallery/2021-10/scaled-1680-/image-1635146221644.jpg)](https://books.greattree.com.tw/uploads/images/gallery/2021-10/image-1635146221644.jpg)

服務啟用後，可以找到之後和line串接需要用到的channelAccessToken和channelSecret。

```javascript=
const config = { 		
 channelAccessToken:"xxxxxxx",
channelSecret: "ooooo",
};

```

### MongoDB

[後台登入](https://www.mongodb.com/)

1.可以建立一個免費的Cluster。如果要建兩個以上，看起來就會需要填付費資料。 [![](https://books.greattree.com.tw/uploads/images/gallery/2021-10/scaled-1680-/image-1635148920741.jpg)](https://books.greattree.com.tw/uploads/images/gallery/2021-10/image-1635148920741.jpg)

2.新增DB

[![](https://books.greattree.com.tw/uploads/images/gallery/2021-10/scaled-1680-/image-1635150445054.jpg)](https://books.greattree.com.tw/uploads/images/gallery/2021-10/image-1635150445054.jpg)

> MongoDB的資料階層 Cluster &gt; DB &gt; collections(Model) &gt; doc  
> 最基本的doc物件會在實作時定義。  
> 而上圖中，DB line和它之下的collection linebotRecord就是這次串接範例產生的。

稍後在express app要連線mongoDB時，需要將上面建立的Cluster名稱和DB名稱帶入uri  
也就是之後資料會在這個DB做存取。而user和password則需要在左邊選單的Database Access做新增/編輯。

```javascript=
const uri = "mongodb+srv://<user>:<password>@<Cluster name>.f2mhj.mongodb.net/<DB名稱>?retryWrites=true&w=majority";

// const dbUri =
  "mongodb+srv://lien0103:xxxxxx@chatroom.f2mhj.mongodb.net/line?retryWrites=true&w=majority";


```
# 功能實作
#### 進入點:herokuApp.js

app啟動流程，會先使用mongoose模組連接mondoDB，這裡會使用到的uri必須填入在mondoDB後台所設定的資訊。 連接mondoDB成功後，會使用Express提供的listen API 把這個服務啟動。

利用app.use()，監聽了指定路由以及對應的https方法。  
[express 路由與中介軟體介紹 ](https://expressjs.com/zh-tw/guide/using-middleware.html)

[![](https://books.greattree.com.tw/uploads/images/gallery/2021-10/scaled-1680-/image-1635233960445.jpg)](https://books.greattree.com.tw/uploads/images/gallery/2021-10/image-1635233960445.jpg)

本地啟用指令

```shell=
node herokuApp.js

//成功連線 console.log
//connected to DB
//line-bot-dopee listening on 3005

```

- - - - - -

### line bot 服務串接

[Messaging API reference](https://developers.line.biz/en/reference/messaging-api/)

### 服務流程

[![](https://books.greattree.com.tw/uploads/images/gallery/2021-10/scaled-1680-/image-1635234574868.png)](https://books.greattree.com.tw/uploads/images/gallery/2021-10/image-1635234574868.png)

### 功能
#### 1.推播訊息給官方line user

[Messaging API reference #send-broadcast-message](https://developers.line.biz/en/reference/messaging-api/#send-broadcast-message)

在msgController.js暴露了3個方法 [![](https://books.greattree.com.tw/uploads/images/gallery/2021-10/scaled-1680-/image-1635236022987.jpg)](https://books.greattree.com.tw/uploads/images/gallery/2021-10/image-1635236022987.jpg)

broadcast是用來呼叫 line send-broadcast-message

```javascript=
//msgController.js
module.exports.broadcast = async (req, res) => {
...(略)
  if (msg && msg != "") { //msg是從後台畫面帶來。
    let reqOption = {
      url: "https://api.line.me/v2/bot/message/broadcast",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.channelAccessToken}`,
      },
      body: JSON.stringify({
        messages: [
          {
            type: "text",
            text: msg,
          },
        ],
      }),
    };
    request.post(reqOption, (error, result, body) => {
      // console.log(result);
      res.json(result);
    });
 }
 ...(略)

```

#### 2.回應user主動傳的訊息

官方line收到user的訊息後，必須接收來自line的https POST，這個接口就設在nodeJS這個服務上。  
而line developer後台要找到Webhook填上這個接口的地址。  
完整的地址: https://line-bot-doope.herokuapp.com/callback

[![](https://books.greattree.com.tw/uploads/images/gallery/2021-10/scaled-1680-/image-1635237126908.jpg)](https://books.greattree.com.tw/uploads/images/gallery/2021-10/image-1635237126908.jpg)

[![](https://books.greattree.com.tw/uploads/images/gallery/2021-10/scaled-1680-/image-1635237282452.jpg)](https://books.greattree.com.tw/uploads/images/gallery/2021-10/image-1635237282452.jpg)

而回應給line的內容，就是實作在msgController.handleLineCallback

```javascript
//msgController.js
...(略)
const config = require("../lineConfig");
const client = new line.Client(config);

async function handleMsgReply(event) {
  let replyMsg = "";
  let replyImg = null;
	
  ...(略)
  const echo = replyImg
    ? [{ type: "text", text: replyMsg }, replyImg]
    : { type: "text", text: replyMsg };

  return client.replyMessage(event.replyToken, echo);
}


module.exports.handleLineCallback = async (req, res) => {
  Promise.all(req.body.events.map(handleMsgReply))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
};

```

#### 3.上傳圖片給推播使用

在line message API 也可以推送圖檔類型的訊息給官方line粉絲。demo的前端則要用POST formData的格式傳給nodeJS。

```javascript
// main.js
    let imgFile = $("#fileInput").prop("files")[0];
    let uploadFilename = null;
    if (imgFile) {
      await new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append("file", imgFile);

        $.ajax({
          url: domain + `/upload`,
          data: formData,
          processData: false,
          contentType: false,
          type: "POST",
          success: function (data) {
            console.log(data);
            uploadFilename = data.filename;
            resolve(true);
          },
          error: function (err) {
            reject(err);
          },
        });
      });
    }

```

在後端預計要把接到的file圖檔存進MongoDB，用到了處理資料流、檔案上傳、檔案分割的套件。

```json=
//package.json
...
  "dependencies": {
    "@line/bot-sdk": "^7.4.0",
    "dotenv": "^10.0.0",
    "express": "^4.17.1",
    "express-fileupload": "^1.2.1", //檔案上傳
    "linebot": "^1.6.1",
    "mongoose": "^6.0.9", //內建mongoose.mongo.GridFSBucket API
    "multer": "^1.4.3",
    "request": "^2.88.2",
    "streamifier": "^0.1.1" //處理資料流
  },
...

```

程式實作部分

```javascript
//imgController.js
const streamifier = require("streamifier");
const mongoose = require("mongoose");

module.exports.handleFileUploadToMongoDB = (req, res, next) => {
  let filename = req.files.file.name;
  let gridfsbucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    chunkSizeBytes: 1024,
    bucketName: "filesBucket",
  });

  streamifier
    .createReadStream(req.files.file.data)
    .pipe(gridfsbucket.openUploadStream(filename))
    .on("error", function (error) {
      console.log(err);
    })
    .on("finish", function () {
      console.log("done!");
      res.status(200).json({
        success: true,
        msg: "File Uploaded successfully..",
        filename: filename,
      });
    });
};


``` 
# Heroku 部署

### Heroku

Heroku是一個支援多種程式語言的雲平台即服務。在2010年被Salesforce.com收購。Heroku作為最元祖的雲平台之一，從2007年6月起開發，當時它僅支援Ruby，但後來增加了對Java、Node.js、Scala、Clojure、Python以及PHP和Perl的支援。 [![](https://books.greattree.com.tw/uploads/images/gallery/2021-10/scaled-1680-/image-1635301671637.jpg)](https://books.greattree.com.tw/uploads/images/gallery/2021-10/image-1635301671637.jpg)

### 開設app

[![](https://books.greattree.com.tw/uploads/images/gallery/2021-10/scaled-1680-/image-1635301778019.png)](https://books.greattree.com.tw/uploads/images/gallery/2021-10/image-1635301778019.png)

本次使用的是line-bot-doope [![](https://books.greattree.com.tw/uploads/images/gallery/2021-10/scaled-1680-/image-1635301821713.jpg)](https://books.greattree.com.tw/uploads/images/gallery/2021-10/image-1635301821713.jpg)

### 部署設定

server部署時預設是執行 npm start 所對應的腳本。所以在package.json需要有對應的在專案的啟動指令

```json=
//package.json
...
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node appHeroku.js " // appHeroku.js 作為應用的進入點
  },

```

### 確認部署的source

在介面上可以專案來自github，所以專案在本機修改後，可推送到github。

### 使用heroku指令

要先下載heroku在本機後安裝 [heroku-cli](https://devcenter.heroku.com/articles/heroku-cli)

```shell=
#本機登入
heroku login 

#把本地專案跟heroku app綁定
heroku git:remote -a ${heroku app name} # line-bot-doope

#部署 (把本地的分支版本推上heroku app 就會開始部署)
git push heroku ${分支名稱}  #master、main...

#查看運行時的log
heroku logs --tail


```

進入到heroku app 的介面，也可以進行操作 [![](https://books.greattree.com.tw/uploads/images/gallery/2021-10/scaled-1680-/image-1635302712788-heroku-com-apps-line-bot-doope-deploy-github-li.jpg)](https://books.greattree.com.tw/uploads/images/gallery/2021-10/image-1635302712788-heroku-com-apps-line-bot-doope-deploy-github-li.jpg) 
# 小結
### 豆皮機器人回應

[![](https://books.greattree.com.tw/uploads/images/gallery/2021-10/scaled-1680-/image-1635305902289.jpg)](https://books.greattree.com.tw/uploads/images/gallery/2021-10/image-1635305902289.jpg)

### 簡易的demo

[demo連結](https://line-bot-doope.herokuapp.com/)[![](https://books.greattree.com.tw/uploads/images/gallery/2021-10/scaled-1680-/image-1635305982616.jpg)](https://books.greattree.com.tw/uploads/images/gallery/2021-10/image-1635305982616.jpg)

### 專案完整

[github](https://github.com/lian0103/line-bot-dopee)

- - - - - -

參考資源彙整: [神Q超人 heroku部署基礎教學](https://medium.com/enjoy-life-enjoy-coding/heroku-%E6%90%AD%E9%85%8D-git-%E5%9C%A8-heroku-%E4%B8%8A%E9%83%A8%E7%BD%B2%E7%B6%B2%E7%AB%99%E7%9A%84%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E5%AD%B8-bf4fd6f998b8)

[swagger API docs 建立參考](https://github.com/brian-childress/node-autogenerate-swagger-documentation)