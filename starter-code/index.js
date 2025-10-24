const buttons = document.querySelectorAll('.btn');
const heading2 = document.getElementsByTagName("h2");
const toggleSwitch = document.getElementById('switch');

const menu = document.getElementById('menu');
const quiz = document.getElementById('quiz');
const resultElement = document.getElementById('results');

const subjectButtons = document.querySelectorAll('.btn-subject');
const quizButtons = document.querySelectorAll('.option-btn');
const submitBtn = document.getElementById('submitAnswer');

const correctSpanElement = document.createElement('span');
const incorrectSpanElement = document.createElement('span');
const correctImgElement = document.createElement('img')
const incorrectImgElement = document.createElement('img')

correctImgElement.setAttribute('src', './assets/images/icon-correct.svg'); 
incorrectImgElement.setAttribute('src', './assets/images/icon-incorrect.svg'); 
correctSpanElement.classList.add('feedback-icon');
incorrectSpanElement.classList.add('feedback-icon');

correctSpanElement.appendChild(correctImgElement);
incorrectSpanElement.appendChild(incorrectImgElement);

mainMenu();

const headerImageBackgroundColor = {
    html: 'orange',
    css: 'green',
    javascript: 'blue',
    accessibility: 'purple'
}

let subject;
let questionCount = 1;
let points = 0;

// light mode / dark mode
toggleSwitch.addEventListener('change', function() {
    let mode = this.checked ? 'light' : 'dark';
    localStorage.setItem('theme', this.checked);
    const lightIcon = document.getElementById('sun-icon');
    const darkIcon = document.getElementById('moon-icon');

    lightIcon.src=`assets/images/icon-sun-${mode}.svg`;
    darkIcon.src=`assets/images/icon-moon-${mode}.svg`

    buttons.forEach(button => button.classList.toggle('light'));
    document.body.classList.toggle('light');

    for(let i = 0; i < heading2.length; i++) {
        heading2[i].classList.toggle('light');
    }
});


// call the data from the menu that was pressed
function mainMenu(){
    subjectButtons.forEach(button => {
        button.addEventListener('click', function() {
            let selectedSubject = this.lastElementChild.textContent;
            subject = selectedSubject;
            
            getData().then(data => {
                menu.style.display = 'none';
                quiz.style.display = 'block';
                data.quizzes.forEach(d => {
                    if(d.title === subject) {
                        handleData(d);
                        return;
                    }
                });
            });
        })
    });
}


document.getElementById('playAgain').addEventListener('click', function() {
    resultElement.style.display = 'none';
    menu.style.display = 'block';
    questionCount = 1;
    points = 0;
    mainMenu();

})

// get the data
async function getData() {
    return await fetch('data.json').then(res => res.json());
}

// send data to different functions
function handleData(questions) {
    changeHeader(questions.title, questions.icon);
    displayQuestions(questions.questions);
}

const subjectTitle = {}

// change the header title based off the quiz title
function changeHeader(title, icon){
    const subjectHeader = document.getElementById('subject-header');
    const iconBackground = document.querySelector('.subject-icon');
    const headerIcon = document.getElementById('header-icon');
    const headingText = document.getElementById("heading-text");
    const headerContainer = document.querySelector('.header-container')

    let background = subjectTitle.background = headerImageBackgroundColor[title.toLowerCase()]
    headerIcon.src = subjectTitle.icon = icon;
    headingText.textContent = subjectTitle.text = title;
    iconBackground.classList.add(background);
    subjectHeader.style.display = 'block';

    
    headerContainer.classList.add('header-gap');
}

// assisting the display of the questions
class quizQuestions {
    #answer;
    #question;

    handleOptions() {
        const currentQuestionNumber = questionCount - 1;
        for(let i = 1; i < this.#question[currentQuestionNumber].options.length+1; i++){
            const optionElement = document.getElementById(`option-${i}`);
            optionElement.textContent = this.#question[currentQuestionNumber].options[i-1];
        }
    }
    set answer(value) { this.#answer = value }
    get answer() { return this.#answer}

    set question(value) {this.#question = value}
    get question() { return this.#question }
}

// Display the questions 
function displayQuestions(question) {
    if(questionCount > question.length) {
        result()
        return;
    }
    const displayQuestion = document.getElementById('question');
    const displayQuestionCount = document.getElementById('questionNumber');
    displayQuestionCount.textContent = `Question ${questionCount} of ${question.length}`;
    displayQuestion.textContent = question[questionCount-1].question;

    currentQuestion.answer = question[questionCount - 1].answer;
    currentQuestion.question = question;
    currentQuestion.handleOptions();
    setupOptions();
}

// related to options
const currentQuestion = new quizQuestions();
let answerSelected = false;
let option, answerElement, previousSelection;

// quiz buttons
function setupOptions() {
    quizButtons.forEach(btn => {
            if(btn.lastElementChild.textContent === currentQuestion.answer) answerElement = btn.parentElement;
            if(answerSelected) return;
            btn.onclick = function() {
                if(previousSelection) previousSelection.classList.remove('selected-option');
                previousSelection = this.parentNode;
                btn.parentNode.classList.add('selected-option');   
                option = this.lastElementChild.textContent;       
            }       
            
            
        })
}
// submit anwswer button
submitBtn.addEventListener('click', () => {
    const errorEl = document.getElementById('error')
        if(!option) {
        errorEl.style.display = 'block';
        document.getElementById('error-msg').textContent = 'Please select an answer';
        return;
    }
    if(answerSelected) {
        option = ''
        submitBtn.textContent = 'Submit answer'
        answerSelected = false;
        clear(previousSelection, answerElement)
        displayQuestions(currentQuestion.question);
    } else {
        checkAnswer(option, currentQuestion.answer, previousSelection, answerElement);
        clearError(errorEl)
        disableDoubleSelectionDuringAnswerState()
        answerSelected = true;
        submitBtn.textContent = 'Next question'
        questionCount++;
    }
})

// make sure you cant click on other options while in check answer state
function disableDoubleSelectionDuringAnswerState(){
     quizButtons.forEach(btn => {
            btn.onclick = function() {
                btn.classList.remove('selected-option');
            }
        })
}

// check the users answer
function checkAnswer(userAnswer, actualAnswer, element, correctAnswerElement) {

    if(actualAnswer === userAnswer) {
        element.classList.add('correct-answer');  
        element.appendChild(correctSpanElement);
        points++
    } else {
        element.classList.add('incorrect-answer');  
        correctAnswerElement.appendChild(correctSpanElement);
        element.appendChild(incorrectSpanElement);
    }
}

// clear any errors in the quiz
function clearError(errorElement) {
    errorElement.style.display = 'none'
}

// clear the previous question elements like correct, incorrect etc
function clear(element, answerElement) {
    [element, answerElement].forEach(el => {
        if (!el) return;
        el.classList.remove('incorrect-answer', 'correct-answer', 'selected-option');
        el.querySelectorAll('.feedback-icon').forEach(node => node.remove());
    });
}

// Display results
function result(){
    resultElement.style.display = 'block'
    quiz.style.display = 'none'
    document.getElementById('score').textContent = points;
    document.getElementById('totalQuestions').textContent = questionCount-1;

    document.querySelector('.result-subject-icon').classList.add(subjectTitle.background);
    document.getElementById('result-subject-icon').src = subjectTitle.icon;
    document.getElementById('subjectTitle').textContent = subjectTitle.text;
}
