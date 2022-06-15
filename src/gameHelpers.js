export const STAGE_WIDTH = 12;
export const STAGE_HEIGHT = 20;

export const createStage = () => 
    Array.from(Array(STAGE_HEIGHT), () => 
        new Array(STAGE_WIDTH).fill([0, 'clear']));


export const checkCollision = (player, stage, {x: moveX, y: moveY}) => {
    for (let y=0; y < player.tetromino.length;  y+= 1) {
        for (let x=0; x<player.tetromino[y].length; x+=1) {
//check if on the tetromino Cell
     if (player.tetromino[y][x] !== 0) {
        if (
        // check if mov is inside the game areas height (y)
        //dont go through the bottom
        !stage[y+player.pos.y + moveY] ||

        //check if mov inside the game area width (x)
        !stage[y + player.pos.y + moveY][x + player.pos.x + moveX] || 
        //check if the moved cell not set to clear
        stage[y + player.pos.y + moveY][x + player.pos.x + moveX][1] !== 
        'clear' 
        ) {
        return true;
            }
        }
    }
}
return false;
};