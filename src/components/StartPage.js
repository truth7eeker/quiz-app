import React from 'react'

export default function StartPage(props) {
    return (
            <div className='start-page'> 
                <div className='start-page--info'>
                    <h3 className='start-page-info--name'>Quizzical</h3>
                    <p>Check your knowledge by answering 5 questions </p>
                    <button onClick = {props.handleClick}>Start quiz</button>
                </div>  
            </div>
    )
}
