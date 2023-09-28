//document.querySelector('#clickMe').addEventListener('click', makeReq);

// Makes data request on Page load --> this is data-intensive and does not scale well. How can we refactor? Implement caching?
// window.addEventListener('load', makeReq);

const bcrypt = require("bcryptjs");


document.addEventListener('click', e => {
  if (e.target.dataset.edit) {
    createModal(e.target.dataset.edit);
  }
  if (e.target.dataset.update) {
    updatePerson(e.target.dataset.update);
    window.location.reload();
  }
  if (e.target.dataset.delete) {
    console.log(e.target.dataset.delete);
    deletePerson(e.target.dataset.delete);
   //alert('Success! User deleted.');
    window.location.reload();
  }
  if (e.target.id === 'signupBtn') {
    openSignupModal();
  }
  if (e.target.id === 'loginBtn') {
    openLoginModal();
  }
  if (e.target.id === 'loginModalButton') {
    login();
  }
})

//READ

async function makeReq(){
  try {
    const res = await fetch(`/persons`, {
      method:'get',
      headers: {
        'Content-Type': 'application/json', "x-access-token": localStorage.getItem("jwt")
      },
    });
    let rolodex = await res.json();
    console.log(rolodex);
  }
  catch(err) {
    console.error(err);
  }
}

async function getPersonById(userId) {
  try {
    const url = `/persons/${userId}`
    console.log(url);
    const res = await fetch(url, {
      method: 'get',
      headers: {'Content-Type': 'application/json'},
    });
    let person = await res.json();
    console.log(person);
    return person;
  }
  catch (err) {
    console.error(err);
  }
}

//UPDATE

async function updatePerson(userId) {
  const updateForm = document.querySelector('#updateForm');
  let formData = new FormData(updateForm);
  const name = formData.get('name');
  const email = formData.get('email');
  const company = formData.get('company');
  const spark = formData.get('spark');

  try {
    const res = await fetch(`/persons/${userId}`, {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name,
        email: email,
        company: company,
        spark: spark
      })
    });
    let person = await res.json();
    return person;
  }
  catch (err) {
    console.error(err);
  }
}

async function createModal(userId) {
  const person = await getPersonById(userId);
  createUpdateFormHtml(person);
  // document.querySelector('#updateModal').style.display = 'block';
  document.querySelector('.modal-container').classList.remove('hidden');
  document.querySelector('body').classList.add('bg');
}

function createUpdateFormHtml(arr) {
  // query based off id
  let formContainer = document.createElement('div');
  let formHtml = `
  <form id="updateForm" class="update-form">
    <label for="update-name">
      Name:
      <input type="text" id="update-name" name="name" placeholder="Name" value="${arr[0].name}"/>
    </label>
    <label for="update-email">
      Email:
      <input type="text" id="update-email" name="email" placeholder="Email" value="${arr[0].email}"/>
    </label>
    <label for="update-company">
      Company:
      <input type="text" id="update-company" name="company" placeholder="Company" value="${arr[0].company}"/>
    </label>
    <label for="update-spark">
      Spark:
      <input type="text" id="update-spark" name="spark" placeholder="Spark" value="${arr[0].spark}"/>
    </label>
    <button class="clickMe" type="submit" data-update="${arr[0].uuid}">Update</button>
  </form>
  `;

  formContainer.innerHTML = formHtml;
  document.querySelector('#updateModal').appendChild(formContainer);
}

//DELETE

async function deletePerson(userId) {
  try {
    const res = await fetch(`/persons/${userId}`, {
      method: 'delete',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uuid: userId,
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
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slides[slideIndex-1].style.display = "block";
}



// SIGNUP FEATURES
function openSignupModal() {
  document.querySelector('#signupModal').classList.remove('hidden');
  document.querySelector('body').classList.add('bg');
}

//Loginfeatures
function openLoginModal() {
  document.querySelector('#loginModal').classList.remove('hidden');
  document.querySelector('body').classList.add('bg');
}

async function login() {
  const loginForm = document.querySelector('#loginForm');
  let formData = new FormData(loginForm);
  const username = formData.get('username');
  const password = formData.get('password');

  try {
    const res = await fetch(`/login`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        {
        username,
        password: bcrypt.hashSync(password, 8)
        }
      )
    });
    let user = await res.json();
    console.log(user)
    //localStorage.setItem("jwt", user.accessToken)
    return user;
  }
  catch (err) {
    console.error(err);
  }
}
