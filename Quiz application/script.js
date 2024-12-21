const API_URL = "https://opentdb.com/api.php?amount=5&category=18&difficulty=medium&type=multiple";

let quizData = [];
let currentQuestionIndex = 0;
let score = 0;

//DOM elements

const questionEI = document.getElementById("question");
const optionsEI = document.getElementById("options");
const nextBtn = document.getElementById("next-btn");
const resultEI = document.getElementById("result");
const scoreEI= document.getElementById("score");
const restartBtn = document.getElementById("restart-btn");

//fetch quiz data from API

async function fetchQuizData(){
    try{
        const response = await fetch(API_URL);
        const data = await response.json();
        quizData = data.results.map((item)=>{
            return{
                question:decodeHTML(item.question),
                options:shuffle([item.correct_answer,...item.incorrect_answers]),
                answer:item.correct_answer,
            };
        });

        startQuiz();
    }catch(error){
        console.error("Failed to fetch quiz data" , error);
    }
}

// start the quiz

function startQuiz(){
    score = 0;
    currentQuestionIndex = 0 ;
    resultEI.style.display = "none";
    document.getElementById("quiz").style.display = "block";
    loadQuestion();
}


// load a question 

function loadQuestion(){
    resetState();
    const currentQuestion = quizData[currentQuestionIndex];
    questionEI.textContent = currentQuestion.question;

    currentQuestion.options.forEach((option)=>{
        const li = document.createElement("li");
        li.textContent = decodeHTML(option);
        li.addEventListener("click", ()=>selectOption(li,currentQuestion.answer));
        optionsEI.appendChild(li);
    });
}

//Reset state

function resetState(){
    nextBtn.disabled = true;
    optionsEI.innerHTML = "";
}

//select an option

function selectOption(selectedOption , correct_answer){
    const alloptions = document.querySelectorAll("#options li");
    alloptions.forEach((option)=>{
        option.removeEventListener("click", ()=>selectOption(option , correct_answer));
        option.style.pointerEvents = "none"; // diabled further clicks
    });

    if(selectedOption.textContent===correct_answer){
        selectedOption.classList.add("correct");
        score++;
    }
    else{
        selectedOption.classList.add("wrong");
    }

    nextBtn.disabled = false;
}

//show results

function showResult(){
    document.getElementById("quiz").style.display = "none";
    resultEI.style.display = "block";
    scoreEI.textContent = `Your score : ${score} / ${quizData.length}`;
}

//Restart quiz

function restartQuiz(){
    fetchQuizData(); // fetch new question and restart the quiz
}

//shuffle array (to random option)

function shuffle(array){
    for(let i=array.length-1;i>=0;i--){
        const j = Math.floor(Math.random()*(i+1));
        [array[i],array[j]]= [array[j] , array[i]];
    }
    return array;
}


// Decode HTML entities in API data

function decodeHTML(html){
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

//Next button logic 

nextBtn.addEventListener("click" , ()=>{
    currentQuestionIndex++;
    if(currentQuestionIndex < quizData.length){
        loadQuestion();
    }
    else{
        showResult();
    }
});

// Restart button logic 

restartBtn.addEventListener("click" , restartQuiz);

//Initialize the app

fetchQuizData();