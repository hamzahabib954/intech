import React, { useState, useEffect } from "react";

const questionsData = [
    {
        "id": 1,
        "text": "Does your business operate in CA?",
        type: "select",
    },
    {
        "id": 2,
        "text": "How many employees do you have?",
        type: "number",
    },
    {
        "id": 3,
        "text": "Do you serve food?",
        type: "select",
    },
    {
        "id": 4,
        "text": "Do you serve hot food?",
        type: "select",
    },
    {
        "id": 5,
        "text": "Are you open past midnight?",
        type: "select",
    },
    {
        "id": 6,
        "text": "Do you host live music?",
        type: "select",
    }
]

const selectOptions = ["Yes", "No"]


export default function Questionnaire() {
    const [questions, setQuestions] = useState([]);
    const [history, setHistory] = useState([]);
    const [currentId, setCurrentId] = useState(1);
    const [inputValue, setInputValue] = useState("");
    const [error, setError] = useState("");
    const [completed, setCompleted] = useState(false);
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        // As during the interview you mentioned to make it scalable we can make API call and set Questions
        setQuestions(questionsData)
    }, [])

    const currentQuestion = questions.find((q) => q.id === currentId);

    const handleSelectNext = (answer) => {
        if (answer === "No") {
            setCompleted(true);
        } else {
            setCurrentId(currentId + 1);
        }
    };

    const handleNumberNext = (answer) => {
        const num = Number(answer);

        if (num > 100) {
            setCompleted(true);
        } else {
            setCurrentId(currentId + 1);
        }
    };

    const handleNext = () => {
        if (!inputValue) {
            setError("This field is required");
            return;
        }

        setError("");
        setHistory((prevHistory)=> [...prevHistory, { ...currentQuestion, answer: inputValue }]);

        if (currentQuestion.type === "select") {
            handleSelectNext(inputValue);
        } else if (currentQuestion.type === "number") {
            handleNumberNext(inputValue);
        }
        if(currentId===questions.length) setCompleted(true)

        setInputValue("");
    };

    const handleNumberChange = (e) => {
        const val = e.target.value;
        if (val && +val <= 0) {
            setError("Value cannot be negative or zero");
            setDisabled(true);
        } else {
            setError("");
            setDisabled(false);
        }
        setInputValue(val);
    };


    const handleBack = () => {
        if (history.length === 0) return;
        const newHistory = [...history];
        const last = newHistory.pop();
        setHistory(newHistory);
        setCurrentId(last.id);
        setInputValue("");
    };
    const handleReset = () => {
        setHistory([]);
        setCurrentId(1);
        setInputValue("");
        setError("");
        setCompleted(false);
    };

    return (
        <div>
            {currentId !== 1 && <div style={{marginBottom: "30px"}} >
                <h2>History</h2>
                <ul>
                    {history.map((h, i) => (
                        <li key={i}>
                            {h.text} - <b>{h.answer}</b>
                        </li>
                    ))}
                </ul>
            </div>}
            <h1>Questionnaire</h1>

            {!completed ? <div>
                <h3>{currentQuestion?.text}</h3>

                {currentQuestion?.type === "select" && (
                    <select
                        value={inputValue ?? ""}
                        onChange={(e) => setInputValue(e.target.value)}
                    >
                        <option value="" disabled hidden>
                            Select an option
                        </option>
                        {selectOptions.map((opt) => (
                            <option key={opt} value={opt}>
                                {opt}
                            </option>
                        ))}
                    </select>
                )}

                {currentQuestion?.type === "number" && (
                    <input
                        type="number"
                        value={inputValue}
                        onChange={handleNumberChange}
                    />
                )}

                {error && <p style={{color: "red"}}>{error}</p>}

                <div style={{ display: 'flex', justifyContent:"space-between",  gap: '1rem', marginTop: "10px" }} >
                    {history.length > 0 && <button style={{width:"100%"}} onClick={handleBack}>Back</button>}
                    <button disabled={disabled} style={{width:"100%"}} onClick={handleNext}>Next</button>
                </div>
            </div> : <div><h2>Thank You!</h2><button onClick={handleReset}>Reset</button></div>}
        </div>
    );
}