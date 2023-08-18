const express = require('express');
const { Client } = require('@notionhq/client');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv'); // 導入dotenv套件

dotenv.config(); // 從.env檔案加載環境變數

const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 10000;
const HOST = process.env.HOST || 'localhost';

const notion = new Client({ auth: process.env.NOTION_API_KEY }); // 從環境變數中獲取API金鑰
const databaseId = process.env.DATABASE_ID; // 從環境變數中獲取數據庫ID

app.post('/submitFormToNotion', async (req, res) => {
    const name = req.body.name;
    const phoneNumber = req.body.phoneNumber;
    const extraInfo = req.body.extraInfo;

    try {
        const response = await notion.pages.create({
            parent: { database_id: databaseId },
            properties: {
                Name: {
                    title: [
                        {
                            text: {
                                content: name
                            }
                        }
                    ]
                },
                "Phone Number": {
                    rich_text: [
                        {
                            text: {
                                content: phoneNumber
                            }
                        }
                    ]
                },
                "Extra Information": {
                    rich_text: [
                        {
                            text: {
                                content: extraInfo
                            }
                        }
                    ]
                },
            }
        });
        console.log(response);
        console.log("success!");
        res.sendStatus(200); // 如果請求成功，發送成功狀態碼
    } catch (error) {
        console.log(error);
        res.sendStatus(500); // 如果發生錯誤，發送錯誤狀態碼
    }
});

app.listen(PORT, HOST, () => {
    console.log("starting proxy at " + HOST + ":" + PORT);
});