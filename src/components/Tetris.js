import React, {useState} from 'react';
import {StyledTetris, StyledTetrisWrapper} from './styles/StyledTetris';
import {createStage, checkCollision} from '../gameHelpers';

import {useInterval} from '../hooks/useInterval';
import {usePlayer} from '../hooks/usePlayer';
import {useStage} from '../hooks/useStage';
import { useGameStatus } from '../hooks/useGameStatus';

import Stage from './Stage';
import Display from './Display';
import StartButton from './StartButton';


const Tetris = () => {
    const [dropTime, setDropTime] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    
    const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
    const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
    const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(rowsCleared);
        
    console.log('re-render');
    console.log(score)

    //where dir comes from?
    const movePlayer = dir => {
        //why not?
        if(!checkCollision(player, stage, {x:dir, y:0})) {
        updatePlayerPos({x:dir, y:0});
        }
    };


    const keyUp = ({keyCode}) => {
        if(!gameOver) {
            //if u press:
            if(keyCode === 40) {
                //activate the interval
                //minos start dropping acc to lvl
                setDropTime(1000/ (level+1));
            }
        }
    };

    const startGame = () => {
        //reset everything
    setStage(createStage());
    setDropTime(1000);
    resetPlayer();
    setScore(0);
    setLevel(0);
    setRows(0);
    setGameOver(false);
    };

    const drop = () => {
        //increase lvl when player cleared 10 rows
        if(rows > (level +1) * 10) {
            //set lvl higher
            setLevel(prev => prev +1 );
            //increase speed
            setDropTime(1000/ (level +1) + 200);
        }

        if(!checkCollision(player,stage, {x:0, y:1})) {
        updatePlayerPos({x:0, y:1, collided:false});
        } else {

            if(player.pos.y < 1) {
                console.log("GAME OVER");
                setGameOver(true);
                setDropTime(null);  
             }
        updatePlayerPos({x: 0, y:0, collided:true});
    }};

    

    const dropPlayer = () => {
        
        setDropTime(null);
        drop();
    };

    useInterval(() => {
        drop();
    }, dropTime);
    
    const move = ({ keyCode }) => {
        if(!gameOver) {
            if(keyCode === 37) {
                movePlayer(-1);
            } else if(keyCode === 39) {
                movePlayer(1);
            } else if (keyCode === 40) {
                dropPlayer();
            } else if (keyCode === 38) {
                playerRotate(stage, 1);
            }
        }

    };


    return (
        <StyledTetrisWrapper role="button" tabIndex="0" onKeyDown={e => move(e)} onKeyUp={keyUp}>
         
            <StyledTetris>
                <Stage stage={stage}/>
                    <aside>
                    {gameOver ? (
                        <Display gameOver={gameOver} text="Game Over" />
                    ) : (
                        <div>
                            <Display text={`Score: ${score}`} />
                            <Display text={`Rows: ${rows}`} />
                            <Display text={`Level: ${level}`} />
                        </div>
                    )}
                        <StartButton callback={startGame} />
                    </aside>
            </StyledTetris>
        </StyledTetrisWrapper>
    );
};

export default Tetris;