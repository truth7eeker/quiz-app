import {useEffect, useState} from "react";
import nextId from "react-id-generator";

export default function Content () {

    const [quiz, setQuiz] = useState([])

    const [chosenAnswers, setChosenAnswers] = useState([])

    const [endGame, setEndGame] = useState(false)

    const [score, setScore] = useState(0)

    const [playAgain, setPlayAgain] = useState(false)

    useEffect(() => {
        fetch('https://opentdb.com/api.php?amount=5&category=22&difficulty=easy&type=multiple')
        .then(response => response.json())
        .then(result => 
            {
                const answers = result.results.map(item => item.incorrect_answers.concat(item.correct_answer))
                const shuffledAnswers = answers.map(item => item.sort(() => Math.random() - 0.5))
                result.results.map((item, index) => item.answers = shuffledAnswers[index])
                const answersObj = result.results.map(item => 
                    item.answers.map(answer => 
                        ({id: nextId(), option: answer, chosen: false, isCorrect: answer === item.correct_answer ? true : false})
                ))
                result.results.map((item, index) => item.answers = answersObj[index])        

                setQuiz(result.results)
            }) 
    }, [playAgain])
  
    function handleSelect(e) {

        const allClickedAnswers = [{}, {}, {}, {}, {}]

        // copy quiz
        const newQuiz = [...quiz]
        
        const chosen = newQuiz.map((item, index) => 
            {
                item.answers.map(answer => {
        //  flip chosen attribute from true to false and vice-versa
                if (answer.id === e.target.id) {
                    answer.chosen = !answer.chosen
                } 
        // only one answer can be chosen, set others to false
                if (answer.chosen) {
                    item.answers.map(option => option.id !== answer.id ? option.chosen = false : null)
        // save chosen answer into an array with its original place (with index)
                    allClickedAnswers.splice(index, 1, answer)
                } 
            })
                return item
            })
            
        setChosenAnswers(allClickedAnswers)
        setQuiz(chosen)  
    }

    function handleCheckAnswersButton() {

        // show score and play again button
        setEndGame(true)

        // copy quiz
        const newQuiz = [...quiz]
        // increase score if the answer is correct
        for (let i = 0; i < newQuiz.length; i++) {
            if (!chosenAnswers.length) {
                return null
            }
            else if (newQuiz[i].correct_answer === chosenAnswers[i].option) {
                setScore(prev => prev + 1)
            }  
        }
    }

    function handlePlayAgainButton() {
        setPlayAgain(!playAgain)
        setEndGame(false)
        setScore(0)
    }

    function handleMouseOver(e) {
        e.target.style.cursor = endGame === true ? 'default' : 'pointer'
    }

    const question = quiz.map((item, index) => (
        // display question
        <div className="question" key={index}>
            <h3 dangerouslySetInnerHTML={{__html: item.question}} />
            <div className="answers"  onMouseOver = {(e) => handleMouseOver(e)}>
                {/* display answers  */}
                {quiz[index].answers.map((answer, i) => (
                   <button className={!endGame && answer.chosen ? 'selected-answer' : endGame && answer.isCorrect ? 'correct' : endGame && !answer.isCorrect && answer.chosen ? 'incorrect' : 'button-answer'}
                           id = {answer.id}
                           key={i}
                           onClick={(e) => handleSelect(e)}
                           dangerouslySetInnerHTML={{__html: answer.option}}
                           value = {answer.option}
                           disabled = {endGame}      
                   />
                ))}
            </div>
        </div>
    ))

    const resultSection = endGame ? 
        <div className="score-section">
            <p>You scored {score}/{quiz.length} correct answers</p>
            <button className="play-again" onClick={handlePlayAgainButton}>Play again</button>
        </div> : 
        <button className="check" onClick={handleCheckAnswersButton}>Check answers</button> 
    
    
    return (
        <div className="content">
            <div className='quiz'>
                {
                    quiz.length ? 
                    <>
                    {question}   
                    {resultSection}
                    </>
                    :   
                    <div className="loading">
                    <p>Loading questions...</p>
                    </div>
                }
           </div>   
         </div>
    )
}