document.querySelector('#clickMe').addEventListener('click', makeReq);
// add anon function to event listener and save makeReq promise to var in order to manipulate the fetched data
// maybe call makeReq from that function()


async function makeReq(){

  const userName = document.querySelector("#userName").value;
  // const res = await fetch(`/api?student=${userName}`)
  const res = await fetch(`/api?student=${userName}`);
  const data = await res.json();

  // fetch data and return json object containing rolodex array. return this arr as a promise of makeReq()

  console.log(data);
  document.querySelector("#personName").textContent = data.name;
  document.querySelector("#personStatus").textContent = data.status;
  document.querySelector("#personOccupation").textContent = data.currentOccupation;
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
