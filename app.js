import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { game } from "./engine.js"; // Đổi thành ./engine.js nếu file của bạn tên là engine.js

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Lấy Port linh hoạt từ hệ thống máy chủ, nếu chạy local thì dùng 3000
const PORT = process.env.PORT || 3000; 

app.use(express.json());
app.use(cors());

// Phục vụ thẳng file index.html nằm cùng thư mục
app.use(express.static(__dirname)); 

let gameInterval = null;
const TICK_RATE = 100;

app.get("/game", function (req, res) {
    res.send(game);
});

app.post("/game/start", function (req, res) {
    if (game.status !== "PLAYING") {
        game.status = "PLAYING";
        
        if (gameInterval) clearInterval(gameInterval);
        gameInterval = setInterval(() => {
            if (game.status === "PLAYING") {
                game.move();
            } else {
                clearInterval(gameInterval);
            }
        }, TICK_RATE);
    }
    res.send({ message: "Start OK" });
});

app.post("/game/reset", function (req, res) {
    if (typeof game.reset === "function") {
        game.reset();
    } else {
        game.snake = [{x: 10, y: 10}, {x: 10, y: 11}, {x: 10, y: 12}];
        game.currentDirection = "up";
        game.status = "WAITING FOR START";
        game.generateFood();
    }

    if (gameInterval) clearInterval(gameInterval);
    res.send({ message: "Reset OK" });
});

app.post("/game/direction", function (req, res) {
    const newDirection = req.body.direction;
    if (game.status === "PLAYING" && !game.invalidDirection(newDirection)) {
        game.currentDirection = newDirection;
        res.send({ message: "Direction updated" });
    } else {
        res.status(400).send({ message: "Invalid move" });
    }
});

app.listen(PORT, () => {
    console.log(`Server đang chạy tại port ${PORT}`);
});