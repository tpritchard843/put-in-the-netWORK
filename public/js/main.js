//document.querySelector('#clickMe').addEventListener('click', makeReq);
// add anon function to event listener and save makeReq promise to var in order to manipulate the fetched data
// maybe call makeReq from that function()
window.addEventListener('load', makeReq);

async function makeReq(){
  try {
    const res = await fetch(`/persons`, {
      method:'get',
      headers: {'Content-Type': 'application/json'},
    });
    const rolodex = await res.json();
    console.log(rolodex);

    const slideshow = document.querySelector('.slideshow-container');

    let cardHtml = ``;
    rolodex.forEach((person, i) => {
      let card = document.createElement('div');
      card.setAttribute("class", "fade");
      if (i > 0) {
        card.setAttributeAttribute("class", "mySlides fade");
      }

      cardHtml += `
        <div class="numbertext">1 / 3</div>
          <section class="cards">
            <h3 class="text name">${person.name}</h3>
            <h3 class="text email">${person.email}</h3>
            <h3 class="text company">${person.company}</h3>
            <h3 class="text dateAdded">${person.dateAdded}</h3>
            <h3 class="text spark">${person.spark}</h3>
          </section>
    `;

    card.innerHTML = cardHtml;
    slideshow.appendChild(card);
  })
  }
  catch(err) {
    console.error(err);
  }
  // fetch data and return json object containing rolodex array. return this arr as a promise of makeReq()
}

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
