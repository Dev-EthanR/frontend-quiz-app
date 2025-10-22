const buttons = document.querySelectorAll('.btn');
const heading2 = document.getElementsByTagName("h2");
const toggleSwitch = document.getElementById('switch');

const menu = document.getElementById('menu');
const quiz = document.getElementById('quiz');
const subjectButtons = document.querySelectorAll('.btn-subject');

let subject;

const headerImageBackgroundColor = {
    html: 'orange',
    css: 'green',
    javascript: 'blue',
    accessibility: 'purple'
}

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


subjectButtons.forEach(button => {
    button.addEventListener('click', function() {
        let selectedSubject = this.lastElementChild.textContent;
        subject = selectedSubject;
        menu.style.display = 'none';
        quiz.style.display = 'block';
        getData().then(data => {
            data.quizzes.forEach(d => {
                if(d.title === subject) handleData(d);
            });
        });
    })
});

function getData() {
    return fetch('data.json').then(res => res.json());
}

function handleData(questions) {
    changeHeader(questions.title, questions.icon)
}

function changeHeader(title, icon){
    const subjectHeader = document.getElementById('subject-header');
    const iconBackground = document.querySelector('.subject-icon');
    const headerIcon = document.getElementById('header-icon');
    const headingText = document.getElementById("heading-text");
    const headerContainer = document.querySelector('.header-container')

    let background = headerImageBackgroundColor[title.toLowerCase()]
    headerIcon.src = icon;
    headingText.textContent = title;
    iconBackground.classList.add(background);
    subjectHeader.style.display = 'block'

    headerContainer.classList.add('header-gap')
}