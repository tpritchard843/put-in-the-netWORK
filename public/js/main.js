//document.querySelector('#clickMe').addEventListener('click', makeReq);

// Makes data request on Page load --> this is data-intensive and does not scale well. How can we refactor? Implement caching?

window.addEventListener('load', makeReq);
document.addEventListener('click', e => {
  if (e.target.dataset.edit) {
    console.log(e.target.dataset.edit); // logs id --> query based off id
    createUpdateFormHtml(e.target.dataset.edit);
    document.querySelector('.modal').removeAttribute('hidden');
  }
  if (e.target.dataset.update) {
    console.log(e.target.dataset.update);
    //updatePerson(e.target.dataset.update);
  }
  if (e.target.dataset.delete) {
    console.log(e.target.dataset.delete);
    deletePerson(e.target.dataset.delete);
    window.location.reload();
  }
})

async function createModal(userId) {
  const person = await getPersonById(userId);
  createUpdateFormHtml(person);
}

async function updatePerson(userId) {
  const person = await getPersonById(userId);
}

function createUpdateFormHtml(obj) {
  // query based off id
  let formContainer = document.createElement('div')
  let formHtml = `
  <form action="/persons" method="POST">
    <input type="text" name="name" placeholder="Name" value="${obj.name}">
    <input type="text" name="email" placeholder="Email" value="${obj.email}">
    <input type="text" name="company" placeholder="Company" value="${obj.company}">
    <input type="date" name="dateAdded" value="${obj.dateAdded}">
    <input type="text" name="spark" placeholder="Spark" value="${obj.spark}">
    <button class="clickMe" type="submit" data-update="${obj.uuid}">Update</button>
  </form>
  `;

  formContainer.innerHTML = formHtml;
  document.querySelector('#updateModal').appendChild(formContainer);
}

//delete working server side but not client side
async function deletePerson(userId) {
  try {
    const url = `/persons/:id?uuid=${userId}`
    console.log(url);
    const res = await fetch(`/persons/${userId}`, {
      method: 'delete',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uuid: userId
      })
    });
    let person = await res.json();
    console.log(person);
    //alert('Success, user deleted');
  }
  catch (err) {
    console.error(err);
  }
}

// ASYNC GET functions

async function makeReq(){
  try {
    const res = await fetch(`/persons`, {
      method:'get',
      headers: {'Content-Type': 'application/json'},
    });
    let rolodex = await res.json();
    console.log(rolodex); //object
    getCardHtml(rolodex);
  }
  catch(err) {
    console.error(err);
  }
}

async function getPersonById(userId) {
  try {
    const url = `/persons/:id?uuid=${userId}`
    console.log(url);
    const res = await fetch(`/persons/:id?uuid=${userId}`, {
      method: 'get',
      headers: {'Content-Type': 'application/json'},
    });
    let person = await res.json();
    return person;
  }
  catch (err) {
    console.error(err);
  }
}




function getCardHtml(arr) {
  const slideshow = document.querySelector('.slideshow-container');

    let cardHtml = ``;
    arr.forEach((person, i) => {
      let card = document.createElement('div');
      card.setAttribute("class", "fade");
      if (i > 0) {
        card.setAttributeAttribute("class", "mySlides fade");
      }
      cardHtml += `
        <div class="numbertext">${i+1} / ${arr.length}</div>
          <section class="cards">
            <h3 class="text name">${person.name}</h3>
            <h3 class="text email">${person.email}</h3>
            <h3 class="text company">${person.company}</h3>
            <h3 class="text dateAdded">${person.dateAdded}</h3>
            <h3 class="text spark">${person.spark}</h3>
            <button class="update-btn" id="updateBtn" data-edit="${person.uuid}">Update</button>
            <button class="delete-btn" id="deleteBtn" data-delete="${person.uuid}">Delete</button>
          </section>
      `;
      card.innerHTML = cardHtml;
      slideshow.appendChild(card);
    })
}

// refactor slideindex code to use array index in async func ==> can feed that array in as a parameter and use corresponding index
// maybe match ids?
let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}
