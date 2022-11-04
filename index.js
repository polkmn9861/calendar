const dateTitle = document.querySelector('.dateTitle');
const dateBoard = document.querySelector('.dateBoard');
const prevDay = document.querySelector('.prevDay');
const nextDay = document.querySelector('.nextDay');
const dayList = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']; //요일 배열
const date = new Date(); //현재 시간
let day = 0; //배열의 순서
let clickDay = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
let todos = []//할일들의 집합
let index = 0; 
const inputBox = document.querySelector('#input-box');
const inputList = document.querySelector('.input-list');
const todoDay = document.querySelector('.todoDay');
const todoDate = document.querySelector('.todoDate');
const inputData = document.querySelector('#input-data');

const makeCalendar = (date) => {
    //date의 현재년도,월 받아오기
    const nowYear = new Date(date).getFullYear();
    const nowMonth = new Date(date).getMonth() + 1;
    
    //한달전의 마지막 일
    const prevDay = new Date(nowYear, nowMonth-1, 1).getDay();
    let prev = new Date(nowYear,nowMonth-1, 0).getDate()-prevDay+1;
    
    //현재 월의 마지막 일 구하기
    const lastDay = new Date(nowYear,nowMonth, 0).getDate()

    //남은 div만큼의 다음날의 날짜 구하기 
    const limitDay = prevDay + lastDay;
    const nextDay = Math.ceil(limitDay / 7) * 7;

    let daysHtml = ''; //htmlDummy
    let j = 1; //남은 div만큼 만들때 쓰는 변수
    
    dateTitle.innerText = `${nowYear}.${nowMonth}`;

    //한달전 div 생성
    for(let i = 0; i < prevDay; i++){
        daysHtml += `
        <div class="noColor">
            <span id="${nowYear}-${nowMonth-1}-${prev}" class=${dayList[day]}>${prev}</span>
            <ul id="${nowYear}-${nowMonth-1}-${prev}"></ul>
        </div>
        `
        prev++;
        day++;
    }

    //이번달 div 생성 
    for(let i=1; i<=lastDay;i++){
        daysHtml += `
        <div class="todoDay">
            <span class=${dayList[day]}>${i}</span>
            <ul id="${nowYear}-${nowMonth}-${i}"></ul>
        </div>
        `
        day++;
        if(day == 7){
            day = 0;
        }
    }

    //남은 div 생성
    for(let i=limitDay; i<nextDay; i++){
        daysHtml += `
        <div class="noColor">
            <span id="${nowYear}-${nowMonth+1}-${j}" class=${dayList[day]}>${j}</span>
            <ul id="${nowYear}-${nowMonth+1}-${j}"></ul>
        </div>
        `
        j++;
        day++;
        if(day == 7){
            day = 0;
        }
    }

    dateBoard.innerHTML = daysHtml;
}

makeCalendar(date);

prevDay.onclick = () => {
    makeCalendar(new Date(date.setMonth(date.getMonth() - 1)));
}

nextDay.onclick = () => {
    makeCalendar(new Date(date.setMonth(date.getMonth() + 1)));
}

const saveTodos = () => {
    localStorage.setItem('object',JSON.stringify(todos));
}

const delTodos = (e) => {
    todos.forEach( (val,ind) => {
        if(val.index == e){
            todos.splice(ind,1);
        }
    })
    saveTodos();
}

const clickDel = (e) => {
    const del = e.target;
    const delDiv = document.getElementById(`${del.className}`);
    const delLi = document.querySelectorAll(`li`);
    delLi.forEach((x) => {
        console.log(delDiv, x.className);
        if(delDiv.id == x.className) {
            console.log(true);
            x.remove();
        }
    })
    delDiv.innerHTML = '';
    delDiv.remove();
    delTodos(del.className);
}

const paintInputList = (id,content,index) => {
    const div = document.createElement('div');
    const li = document.createElement('li');
    const btn = document.createElement('button');
    li.innerText = content;
    btn.innerText = 'X';
    btn.classList = index;
    btn.id = 'del';
    div.id = index;
    console.log(div.id);
    div.appendChild(li);
    div.appendChild(btn);
    inputList.appendChild(div);
    btn.addEventListener('click', clickDel);
}

const paintTodo = (id,content) => {
    const ulTodo = document.getElementById(`${id}`);
    const li = document.createElement('li');
    li.innerText = `${content}`;
    li.classList = index;
    ulTodo.appendChild(li);
    const todoObj = {
        id : id,
        content : content,
        index : index
    };
    paintInputList(id,content,index);
    index++;
    todos.push(todoObj);
    saveTodos();
}

inputBox.addEventListener('keypress', (e) => {
    if(e.key === 'Enter'){
        paintTodo(e.target.classList[0],e.target.value);
        // paintInputList(e.target.classList[1],e.target.value);
    }
})

inputData.addEventListener('click', (e) => {
    paintTodo(inputBox.classList[0], inputBox.value);
})

const loadTodos = () => {
    const loadedTodos = localStorage.getItem('object');
    if(loadedTodos !== null){
        const parsedTodos = JSON.parse(loadedTodos);
        parsedTodos.forEach((x) => {
            paintTodo(x.id, x.content)
            // paintInputList(x.index,x.content);
        })
    }
}

const clickBoard = () => {
    dateBoard.addEventListener('click', (e) => {
        if(e.target.className == 'todoDay' || e.target.className == 'noColor'){
            clickDay = ` ${e.target.children[1].id}`;
            inputBox.classList = ` ${clickDay}`;
            todoDay.innerText = e.target.children[0].className;
            todoDate.innerText = (e.target.children[1].id).split('-')[2];
            inputList.innerHTML = '';
            const paintInputs = e.target.children[1].children;
            console.log(e);
            [...paintInputs].forEach((e) => {
                console.log(e);
                paintInputList(e.className,e.innerText,e.classList);
            })
        }
    })
}

const setinit = () => {
    inputBox.classList += ` ${clickDay}`
    const Day = document.getElementById(`${clickDay}`)
    todoDay.innerText = Day.previousElementSibling.className;
    todoDate.innerText = (clickDay).split('-')[2];
    loadTodos();
    clickBoard();
}

setinit()