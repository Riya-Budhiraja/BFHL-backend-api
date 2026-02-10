import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const EMAIL = "riya1030.be23@chitkara.edu.in"; 

app.get("/health", (req, res) => {
  res.status(200).json({
    is_success: true,
    official_email: EMAIL
  });
});

function fibonacci(n){
  if (!Number.isInteger(n) || n < 0) throw new Error("Invalid fibonacci input");
  const arr = [0, 1];
  for (let i = 2; i < n; i++){
    arr.push(arr[i - 1] + arr[i - 2]);
  }
  return arr.slice(0, n);
}
function isPrime(num){
  if (num <= 1) return false;
  for (let i = 2; i <= Math.sqrt(num); i++){
    if (num % i === 0) return false;
  }
  return true;
}
function gcd(a, b){
  return b === 0 ? a : gcd(b, a % b);
}

function hcf(arr){
  return arr.reduce((a, b) => gcd(a, b));
}

function lcm(arr){
  return arr.reduce((a, b) => (a * b) / gcd(a, b));
}
async function askAI(question) {
  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`;

  const response = await axios.post(url, {
    contents: [{ parts: [{ text: question }] }]
  });

  return response.data.candidates[0].content.parts[0].text
    .split(" ")[0];
}
app.post("/bfhl", async (req, res) => {
  try {
    const body = req.body;
    const keys = Object.keys(body);

    if (keys.length !== 1) {
      return res.status(400).json({
        is_success: false,
        official_email: EMAIL,
        error: "Exactly one key required"
      });
    }

    let data;
    const key = keys[0];

    switch (key) {
      case "fibonacci":
        data = fibonacci(body.fibonacci);
        break;

      case "prime":
        if (!Array.isArray(body.prime)) throw new Error("Prime must be array");
        data = body.prime.filter(isPrime);
        break;

      case "lcm":
        data = lcm(body.lcm);
        break;

      case "hcf":
        data = hcf(body.hcf);
        break;

      case "AI":
        data = await askAI(body.AI);
        break;

      default:
        return res.status(400).json({
          is_success: false,
          official_email: EMAIL,
          error: "Invalid key"
        });
    }

    res.status(200).json({
      is_success: true,
      official_email: EMAIL,
      data
    });

  } catch (err) {
    res.status(500).json({
      is_success: false,
      official_email: EMAIL,
      error: err.message
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
