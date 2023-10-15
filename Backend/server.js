import express  from "express";
import cors from "cors"
import path from "path";
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from "fs"

const app = express()
app.use(express.json());
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = process.env.PORT || 3001;

app.get('/', (req, res) => res.send("hello world"))

app.get("/generate-pdf", async (req, res) => {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
  
      await page.goto("https://real-assist-ai-fe.netlify.app/");
  
      await page.waitForSelector(".graph-inner-container canvas");
  
      const pdfPath = path.join(__dirname, "public/report.pdf");
  
      await page.pdf({
        path: pdfPath,
        format: "A4",
        printBackground: true,
      });
  
      await browser.close();
  
      res.sendFile(pdfPath);
    } catch (error) {
      console.error("Error generating PDF:", error);
      res.status(500).send("Error generating the PDF.");
    }
  });
    
  app.post("/save-chart-image", (req, res) => {
    const { image } = req.body;
  
    const imageBuffer = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ""), "base64");
    const imagePath = path.join(__dirname, "chart.png"); // Adjust the path as needed
  
    fs.writeFileSync(imagePath, imageBuffer);
  
    res.send("Chart image saved on the server");
  });

  app.listen(port,console.log(`listening on port ${port}`));
