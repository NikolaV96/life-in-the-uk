import { useState, useRef } from 'react'
import Head from 'next/head'
import questions from '../questions8.json'

export default function Test1() {
    const [answers, setAnswers] = useState({})
    const [score, setScore] = useState(null)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const answersRef = useRef(null)

    function handleOptionChange(event, questionId) {
        const { value, checked } = event.target
        setAnswers((prevAnswers) => {
            if (Array.isArray(questions.find((question) => question.id === questionId).answer)) {
                if (checked) {
                    return { ...prevAnswers, [questionId]: [...(prevAnswers[questionId] || []), value] }
                } else {
                    const newAnswer = prevAnswers[questionId].filter((selectedOption) => selectedOption !== value)
                    return { ...prevAnswers, [questionId]: newAnswer.length > 0 ? newAnswer : undefined }
                }
            } else {
                return { ...prevAnswers, [questionId]: value }
            }
        })
    }


    function handleSubmit(event) {
        event.preventDefault()
        let score = 0
        questions.forEach((question) => {
            const answer = question.answer
            const userAnswer = answers[question.id]
            if (Array.isArray(answer)) {
                const numCorrectAnswers = answer.filter((optionId) => userAnswer?.includes(optionId)).length
                score += numCorrectAnswers * 0.5
            } else {
                if (answer === userAnswer) {
                    score += 1
                }
            }
        })
        setScore(score)
        setIsSubmitted(true)

        // Wait for the component to render before calling scrollIntoView
        setTimeout(() => {
            const answersElement = document.getElementById('answers')
            if (answersElement) {
                answersElement.scrollIntoView({ behavior: 'smooth' })
            }
        }, 0)
    }




    return (
        <div>
            <Head>
                <title>Life in the UK Test - Test 8</title>
            </Head>

            <main className="max-w-lg mx-auto my-16">
                <h1 className="text-2xl font-bold mb-8">Life in the UK Test - Test 8</h1>

                <form onSubmit={handleSubmit}>
                    {questions.map((question) => (
                        <div key={question.id} className="mb-8">
                            <p className="text-lg font-bold mb-2">{question.question}</p>
                            <div>
                                {question.options.map((option) => (
                                    <label key={option.id} className="block mb-2">
                                        <input
                                            type={Array.isArray(question.answer) && question.options.length > 2 ? 'checkbox' : 'radio'}
                                            name={`question-${question.id}`}
                                            value={option.id}
                                            checked={answers[question.id] === option.id || (Array.isArray(answers[question.id]) && answers[question.id].includes(option.id))}
                                            onChange={(event) => handleOptionChange(event, question.id)}
                                            className="mr-2"
                                        />
                                        {option.text}
                                    </label>
                                ))}
                            </div>


                        </div>
                    ))}

                    <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                        Submit
                    </button>
                </form>

                {score !== null && (
                    <div className="mt-8" ref={answersRef}>
                        <p className="text-lg font-bold mb-4">Your score: {score}/{questions.length}</p>
                        <ul>
                            {isSubmitted && (
                                <div className="mt-8" id="answers">
                                    <h2 className="text-lg font-bold mb-2">Answers</h2>
                                    {questions.map((question) => (
                                        <div key={question.id} className="mb-6">
                                            <h2 className="text-lg font-bold mb-2">{question.text}</h2>
                                            <div className="mt-2">
                                                {/* <p className="text-gray-500 font-bold">Correct answer: {Array.isArray(question.answer) ? question.answer.map((optionId) => question.options.find((o) => o.id === optionId).text).join(', ') : question.options.find((option) => option.id === question.answer).text}</p>
                                                <p className="text-gray-500">Your answer: {question && answers[question.id] ? (
                                                    Array.isArray(answers[question.id]) ? answers[question.id].map((optionId) => question.options.find((o) => o.id === optionId).text).join(', ')
                                                        : question.options.find((option) => option.id === answers[question.id]).text
                                                ) : ''}</p> */}

                                                <p className={`font-bold ${Array.isArray(question.answer) ? question.answer.every((selectedOption) => answers[question.id]?.includes(selectedOption)) ? 'text-green-500' : 'text-red-500' : (answers[question.id] === question.answer ? 'text-green-500' : 'text-red-500')}`}>Correct answer: {Array.isArray(question.answer) ? question.answer.map((optionId) => question.options.find((o) => o.id === optionId).text).join(', ') : question.options.find((option) => option.id === question.answer).text}</p>

                                                <p className={`text-gray-500 ${Array.isArray(answers[question.id]) ? answers[question.id].every((selectedOption) => question.answer.includes(selectedOption)) ? 'text-green-500' : 'text-red-500' : (answers[question.id] === question.answer ? 'text-green-500' : 'text-red-500')}`}>Your answer: {question && answers[question.id] ? (
                                                    Array.isArray(answers[question.id]) ? answers[question.id].map((optionId) => question.options.find((o) => o.id === optionId).text).join(', ')
                                                        : question.options.find((option) => option.id === answers[question.id]).text
                                                ) : ''}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ul>
                    </div>
                )}
            </main>
        </div>
    )
}

