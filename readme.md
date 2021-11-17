# nodeJS & line-bot message API
預計使用nodeJS 和 Express 套件架設基礎的http服務。並串接line-bot message API。
實作功能:line官方帳號訊息回覆和紀錄、推播文字和圖片訊息。

demo: https://line-bot-doope.herokuapp.com/     

API docs: https://line-bot-doope.herokuapp.com/api-docs/#/

使用語言: javascript   
套件模組:nodeJS、express   
第三方服務: line-developer API 、 MongoDB   
部署工具:Heroku   
API文件工具:swagger   

開發流程可參考note.md

2021-11-17
更新功能: 查詢火車起迄站時刻
說明:使用者可透過輸入「火車 ${起站} ${終點站}」得知台鐵近幾班車次
界接資料來源: 交通部公共運輸整合資訊平台
