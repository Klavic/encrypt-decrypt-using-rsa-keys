import express from "express";
import cors from "cors";
import * as bodyParser from "body-parser";
import { CryptoUtils } from "./cryptoUtils";

const app = express();

/**
 * App Configuration
 */

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/decript", async (req, res) => {
  const { privateKeyEncoded, encryptedText } = req.body;

  const privateKeyImported = await CryptoUtils.importPrivateKey(
    privateKeyEncoded
  );
  const decriptedText = await CryptoUtils.decryptText(
    privateKeyImported,
    encryptedText
  );

  res.json({ text: decriptedText }).status(200);
});

app.listen(3000, () => {
  console.info("Server running on port 3000");
});
