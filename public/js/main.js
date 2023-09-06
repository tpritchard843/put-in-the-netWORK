//document.querySelector('#clickMe').addEventListener('click', makeReq);

// Makes data request on Page load --> this is data-intensive and does not scale well. How can we refactor? Implement caching?

window.addEventListener('load', makeReq);

//Helper functions to feed Async
//function to handle cardHTML
//function to handle update
//function to handle delete

async function makeReq(){
  try {
    const res = await fetch(`/persons`, {
      method:'get',
      headers: {'Content-Type': 'application/json'},
    });
    let rolodex = await res.json();
    console.log(typeof rolodex); //object
    getCardHtml(rolodex);
  }
  catch(err) {
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
            <button class="delete-btn" data-card="${person._id}">Delete</button>
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
