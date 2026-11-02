export let game = {
    snake : [
        {x : 10, y : 10}, // head
        {x : 10, y : 11}, // body
        {x : 10, y : 12}, // tail
    ],
    currentDirection : "up",
    food: {x: 15, y: 15},
    status: "WAITING FOR START",

    invalidDirection : function(newDirection) {
        if (this.currentDirection === "up" && newDirection === "down") return true;
        if (this.currentDirection === "down" && newDirection === "up") return true;
        if (this.currentDirection === "left" && newDirection === "right") return true;
        if (this.currentDirection === "right" && newDirection === "left") return true;
        return false;
    },

    generateFood : function() {
        const maxPlayGroundColumn = 40;
        const maxPlayGroundRow = 40;
        let foodX, foodY;

        do {
            foodX = Math.floor(Math.random() * maxPlayGroundColumn);
            foodY = Math.floor(Math.random() * maxPlayGroundRow);
        } while(this.snake.some(segment => segment.x === foodX && segment.y === foodY));
        
        this.food = { x: foodX, y: foodY };
    },

    move: function() {
        if (this.status === "GAME OVER") return;

        let newHead;
        if (this.currentDirection === "up") newHead = {x : this.snake[0].x, y : this.snake[0].y - 1};
        else if (this.currentDirection === "down") newHead = {x : this.snake[0].x, y : this.snake[0].y + 1};
        else if (this.currentDirection === "left") newHead = {x : this.snake[0].x - 1 , y : this.snake[0].y};
        else if (this.currentDirection === "right") newHead = {x : this.snake[0].x + 1 , y : this.snake[0].y};

        // 1. Đâm tường (Giới hạn bản đồ 40x40)
        if (newHead.x < 0 || newHead.x >= 40 || newHead.y < 0 || newHead.y >= 40) {
            this.status = "GAME OVER";
            return;
        }

        // Kiểm tra xem lượt này có ăn mồi hay không
        const willEatFood = (newHead.x === this.food.x && newHead.y === this.food.y);

        // 2. Tự cắn thân (Nếu không ăn mồi thì bỏ qua đốt đuôi cuối cùng vì đuôi sẽ co lại)
        const bodyCheckLength = willEatFood ? this.snake.length : this.snake.length - 1;
        for (let i = 0; i < bodyCheckLength; i++) {
            if (this.snake[i].x === newHead.x && this.snake[i].y === newHead.y) {
                this.status = "GAME OVER";
                return;
            }
        }

        // 3. Cập nhật vị trí
        this.snake.unshift(newHead);

        if (willEatFood) {
            this.generateFood(); 
        } else {
            this.snake.pop();
        }
    }
};