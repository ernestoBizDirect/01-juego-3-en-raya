import {useState, useEffect} from 'react'
import './App.css'
import {Square} from "./components/Square.jsx";
import {TURNS} from "./constants.js";
import {checkWinner} from "./logic/board.js";
import {Winner} from "./components/Winner.jsx";

function App() {

    const [board, setBoard] = useState(() => {
        const boardFromStorage = window.localStorage.getItem("board");
        return boardFromStorage ? JSON.parse(boardFromStorage) :
            Array(9).fill(null)
    });

    const [turn, setTurn] = useState(() => {
        const turnFromStorage = window.localStorage.getItem("turn");
        return turnFromStorage ?? TURNS.X
    });

    const [winner, setWinner] = useState(null)

    const checkEndGame = (newBoard) => {
        return newBoard.every((square) => square !== null)
    }

    const handleUpdateBoard = (index) => {
        if (board[index] || winner) return
        const newBoard = [...board]
        newBoard[index] = turn
        setBoard(newBoard)
        const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
        setTurn(newTurn)

        // Revisar si hay un ganador
        const newWinner = checkWinner(newBoard)
        if (newWinner) {
            setWinner(newWinner)
        } else if (checkEndGame(newBoard)) {
            setWinner(false)
        }
    }

    const resetGame = () => {
        setBoard(Array(9).fill(null))
        setTurn(TURNS.X)
        setWinner(null)

        window.localStorage.removeItem('board')
        window.localStorage.removeItem('turn')
    }

    /// Si no se le especifican las depedencias se ejecuta siempre que se renderice el componente
    // Las dependencias se ponen en un array
    // Si se especifica como dependencia un array vacio se ejecuta una unica vez
    useEffect(()=> {
        // Como minimo se ejecuta una vez
        console.log("Use Effect");
    },[])

    return (
        <main className='board'>
            <h1>Tic Tac Toe</h1>
            <button onClick={resetGame}>Reset del juego</button>
            <section className='game'>
                {
                    board.map((_, index) => {
                        return (
                            <Square key={index} index={index} updateBoard={handleUpdateBoard}>
                                {board[index]}
                            </Square>
                        )
                    })
                }
            </section>
            <section className='turn'>
                <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
                <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
            </section>

            <Winner winner={winner} resetGame={resetGame}/>
        </main>
    )
}

export default App
