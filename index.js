const addItem = document.getElementById('submitbtn');
const Allqstn = document.getElementById('Allqstn');
const list = document.getElementById('newList');
const rightbefore = document.querySelector('.right-main');
const left = document.querySelector('.left-content');
const rightafter = document.querySelector(".right-after");
const newForm = document.querySelector(".btn-primary");
const response = document.getElementById('submitRes');
const responselist = document.querySelector(".response-box");
const resolve = document.getElementById("resolve");
const search = document.getElementById("search");
const result = document.querySelector('#noresult');
const details = document.getElementById('quesDetail');
const goback = document.getElementById('return');
var right = document.querySelector('.right-after');
let x = window.matchMedia("(max-width: 750px)");




addItem.addEventListener('click', addnewItem);


function addnewItem(e) {

    e.preventDefault();

    if (localStorage.getItem('questionContainer') == null) {
        localStorage.setItem('questionContainer', '[]');
    }

    let subject = document.getElementById('subject');
    let question = document.getElementById('question');

    let subjectValue = subject.value;
    let questionValue = question.value;


    if (subjectValue.trim().length && questionValue.trim().length > 0) {

        let oldData = JSON.parse(localStorage.getItem('questionContainer'));
        const newData = {
            'subject': subject.value,
            'question': question.value,
            'response': []
        }
        oldData.push(newData);
        localStorage.setItem('questionContainer', JSON.stringify(oldData));
        if (x.matches) {
            rightbefore.classList.add("hide");
            left.style.display = "block";
            goback.classList.remove("hide");
        }
        subject.value = '';
        question.value = '';

        upDateList();

    }


}

function upDateList() {
    const questionContainer = JSON.parse(localStorage.getItem('questionContainer'));
    list.innerHTML = '';
    for (let i = 0; i < questionContainer.length; i++) {

        let li = document.createElement('li');
        li.className = 'list-item';
        let h4 = document.createElement('h4');
        h4.className = 'text-primary';
        let p = document.createElement('p');
        p.className = "text-secondary";
        h4.innerText = questionContainer[i]["subject"];
        p.innerText = questionContainer[i]["question"];
        li.appendChild(h4);
        li.appendChild(p);
        li.id = i;

        li.addEventListener('click', function() {
            // details.innerHTML = '';
            while (details.firstChild) {
                details.removeChild(details.lastChild);
            }
            let questionId = li.getAttribute("id");
            rightbefore.classList.add('hide');
            rightafter.classList.remove('hide');
            if (x.matches) {
                left.style.display = "none";
            }


            let newh4 = document.createElement('h4');
            let newp = document.createElement('p');
            newh4.innerText = questionContainer[questionId]["subject"];
            newp.innerText = questionContainer[questionId]["question"];
            details.appendChild(newh4);
            details.appendChild(newp);
            details.setAttribute('id', questionId);

            updateResponse(questionId);
        });


        list.appendChild(li);

    }
}

window.onload = function() {
    if (localStorage.getItem('questionContainer') != null)
        if (localStorage.getItem('questionContainer').length > 0) {
            upDateList();
        }
}


// ADD NEW FORM 

newForm.addEventListener('click', newform);

function newform() {
    rightbefore.classList.remove('hide');
    rightafter.classList.add('hide');
    if (x.matches) {
        left.style.display = "none";
        Allqstn.classList.remove("hide");
    }
}

//GOBACK TO QUESTIONS PAGE FOR PHONE
goback.addEventListener('click', openQuestions);
Allqstn.addEventListener('click', function(e) {
    e.preventDefault();
    rightbefore.classList.add('hide');
    left.style.display = "block";
});

function openQuestions() {
    rightafter.classList.add('hide');
    left.style.display = "block";
}


//RESOLVE THE QUESTION

resolve.addEventListener('click', deleteList);

function deleteList() {
    if (details.childNodes) {
        const questionID = details.getAttribute('id');
        const questionContainer = JSON.parse(localStorage.getItem('questionContainer'));
        questionContainer.splice(questionID, 1);
        localStorage.setItem('questionContainer', JSON.stringify(questionContainer));

    }


    if (details.children.length > 0)
        details.removeChild(details.childNodes[0]);
    if (responselist.children.length > 0)
        responselist.removeChild(responselist.childNodes[0]);
    upDateList();
    newform();

}



//ADD RESPONSE

response.addEventListener('click', addResponse);

function addResponse(e) {
    e.preventDefault();
    //get input value

    const questionId = details.getAttribute('id');

    let name = document.getElementById('name');
    let comment = document.getElementById('comment');

    let nameValue = name.value;
    let commentValue = comment.value;


    if (nameValue.trim().length && commentValue.trim().length > 0) {
        let oldData = JSON.parse(localStorage.getItem('questionContainer'));
        const newData = {
            'name': name.value,
            'comment': comment.value
        }

        if (!oldData[questionId]['response'])
            oldData[questionId]['response'] = [];

        oldData[questionId]['response'].push(newData);

        // Saving the updated array of object in the questioContainer
        localStorage.setItem('questionContainer', JSON.stringify(oldData));

        name.value = '';
        comment.value = '';



        updateResponse(questionId);
    }
}

function updateResponse(questionId) {
    const questionContainer = JSON.parse(localStorage.getItem('questionContainer'));
    responselist.innerHTML = '';
    for (let i = 0; i < questionContainer[questionId]["response"].length; i++) {
        let div = document.createElement('div');
        div.className = 'question';
        let h4 = document.createElement('h4');
        let p = document.createElement('p');
        p.className = "caption";
        h4.innerHTML = questionContainer[questionId]["response"][i]["name"];
        p.innerHTML = questionContainer[questionId]["response"][i]["comment"];
        div.appendChild(h4);
        div.appendChild(p);
        responselist.appendChild(div);
    }
}


//FILTER ITEMS WHEN SEARCHING

search.addEventListener('keyup', filterItems);

function filterItems(e) {
    //convert text to lowercase
    var text = e.target.value.toLowerCase();
    var items = list.getElementsByTagName('li');
    // convert to an array
    Array.from(items).forEach(function(item) {
        var itemName = item.firstChild.innerHTML;

        if (itemName.toLowerCase().indexOf(text) != -1) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}