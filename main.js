// var btnDelete = document.querySelector('#btn-delete');
// var btnDownvote = document.querySelector('#btn-downvote');
// var btnGenius = document.querySelector('#btn-genius');
// var btnPlausible = document.querySelector('#btn-plausible');
// var btnQuality = document.querySelector('#btn-quality');
var btnSave = document.querySelector('#btn-save');
// var btnStar = document.querySelector('#btn-star');
// var btnStarred = document.querySelector('#btn-star');
// var btnSwill = document.querySelector('#btn-swill');
// var btnUpvote = document.querySelector('#btn-upvote');
var inputBody = document.querySelector('#input-body');
// var inputQuality = document.querySelector('#input-quality');
// var inputSearch = document.querySelector('#input-search')
var inputTitle = document.querySelector('#input-title');
var cardArea = document.querySelector('.section-bottom');
var ideasArray = []
// for (i = 0; i > ideasArray.length; i++) {

//   (ideaCard + i) = document.querySelector(`idea-card-${i}`);
//   (ideaCard + i).addEventListener('blur', updateCard);
// }
var id = Date.now();

// btnGenius.addEventListener('click', );
// btnPlausible.addEventListener('click', );
// btnQuality.addEventListener('click', toggleArrow);
btnSave.addEventListener('click', addIdea);
cardArea.addEventListener('click', toggleStar);
// btnSwill.addEventListener('click', );

cardArea.addEventListener('focusout', handleFocusOut);
cardArea.addEventListener('keydown', handleTextEdit);
cardArea.addEventListener('click', handleCardButtons);
inputTitle.addEventListener('keyup', handleSaveBtn);
// do we want to change these keyups to blur?
inputBody.addEventListener('keyup', handleSaveBtn);
window.addEventListener('DOMContentLoaded', repopulateIdeasArray);

// handleBottom() {
// 	if (e.)
// 		make if functions to target every button/image
// }
function handleCardButtons(e) {
  deleteCard(e);
}

function addIdea(e) {
  console.log('here!');
	e.preventDefault();
	var idea = new Idea(Date.now(), inputTitle.value, inputBody.value, false, 0);
	ideasArray.push(idea);
	idea.saveToStorage(ideasArray);
	handleSaveBtn();
	addCard(idea);
	inputTitle.value = "";
	inputBody.value = "";
}

handleSaveBtn();

function addCard(object) {
  var changeStar = object.star ? 'images/star-active.svg' : 'images/star.svg';
  var numOfIdeas = ideasArray.length;
	cardArea.insertAdjacentHTML('afterbegin', `<article class="idea-card" data-id="${object.id}">
        <header>
          <img class="img-star star" src="${changeStar}" alt="star" id="btn-star">
          <img class="img-delete" src="images/delete.svg" alt="delete" id="btn-delete">
        </header>
        <div class="card-content">
          <h3 class="card-title" contenteditable="true">${object.title}</h3>
          <p class="card-body" contenteditable="true">${object.body}</p>
        </div>
        <footer>
          <img class="img-upvote" src="images/upvote.svg" alt="upvote" id="btn-upvote">
          <p class="quality-text">Quality: ${object.quality}</p>
          <img class="img-downvote" src="images/downvote.svg" alt="downvote" id="btn-downvote">    
        </footer>
      </article>`);
}


function repopulateIdeasArray() {
  var newArray = JSON.parse(localStorage.getItem('ideasArray')).map(function(idea) {
    return new Idea(idea.id, idea.title, idea.body, idea.star, idea.quality);
  });

  ideasArray = newArray;

  for (i = 0; i < ideasArray.length; i++) {
    addCard(ideasArray[i]);
  }
}

function deleteCard(e) {
  if (e.target.id === 'btn-delete'){
    e.target.closest('.idea-card').remove(); 
    var index = findIdeaIndex(e);
    ideasArray[index].deleteFromStorage(index, ideasArray);
  }
}

function findIdeaIndex(e) {
  var ideaId = e.target.closest('.idea-card').getAttribute('data-id');
  var identifier = ideasArray.findIndex(idea => parseInt(idea.id) == ideaId);
  return identifier;
}

function handleFocusOut(e) {
  if (e.target.className === 'card-title' || e.target.className === 'card-body') {
    var newTitle = e.target.closest('.card-content').querySelector('.card-title').innerText;
    var newBody = e.target.closest('.card-content').querySelector('.card-body').innerText;
    var index = findIdeaIndex(e);

    ideasArray[index].updateIdea(newTitle, newBody);
    ideasArray[index].saveToStorage(ideasArray);
  }
}

function toggleStar(e) {
  if(event.target.classList.contains('img-star')) {
    var getIdea = ideasArray[findIdeaIndex(e)];
    getIdea.updateStar();
    var changeStar = getIdea.star ? 'images/star-active.svg' : 'images/star.svg';
    event.target.setAttribute('src', changeStar);

   var index = findIdeaIndex(e);
   console.log(ideasArray[index]);
    ideasArray[index].saveToStorage(ideasArray);

  }
}

function handleTextEdit(e) {
  if (e.key === 'Enter') {
    e.target.blur();
    console.log("event:", event);
    var newTitle = e.target.closest('.card-content').querySelector('.card-title').innerText;
    var newBody = e.target.closest('.card-content').querySelector('.card-body').innerText;
    var index = findIdeaIndex(e);

    ideasArray[index].updateIdea(newTitle, newBody);
    ideasArray[index].saveToStorage(ideasArray);
  }
 } 

function handleSaveBtn() {
	btnSave.disabled = !inputTitle.value || !inputBody.value;
}



