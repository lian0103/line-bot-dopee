# nodeJS & line-bot message API

使用 nodeJS 和 Express 套件架設基礎的 http 服務。並串接 line-bot message API。
實作功能:line 官方帳號訊息回覆和紀錄、推播文字和圖片訊息。

demo: https://line-bot-dopee-zhy7lseifa-an.a.run.app/

API docs: https://line-bot-dopee-zhy7lseifa-an.a.run.app/api-docs/

使用語言: javascript  
套件模組:nodeJS、express  
第三方服務: line-developer API 、 MongoDB  
部署工具:Heroku  
API 文件工具:swagger

開發流程可參考 note.md

---

2021-11-18  
更新功能: 1.查詢火車起迄站時刻  
說明:使用者可透過輸入「火車 ${起站} ${終點站}」得知台鐵近幾班車次

![](https://i.imgur.com/TC4OTQD.jpg)

2.查詢各縣市活動資訊
說明:使用者可透過輸入「活動 ${縣市名稱}」得知該縣市近幾筆將舉辦的活動

![](https://i.imgur.com/VOptuwr.jpg)

界接資料來源: 交通部公共運輸整合資訊平台
2023-10 API 已失效

---

2023-03-17
issues:
1.Heroku 免費運行方案取消。需要尋找替代平台
-> 再把 linebot message webhook 重新設定

改使用 google cloud run 部署

---

2023-11-05
新增 chatGPT 串接
翻譯後，輸出 wav 音訊檔案

![](https://i.imgur.com/yudlDs2.png)
