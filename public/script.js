const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});


// JavaScript for automatic slider

let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

// Function to show a specific slide
function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.style.display = (i === index) ? 'block' : 'none';
    });
}

// Show the first slide initially
showSlide(currentSlide);

// Automatic slide transition (every 5 seconds)
setInterval(() => {
    currentSlide = (currentSlide + 1) % totalSlides; // Loop back to the first slide after the last one
    showSlide(currentSlide);
}, 5000); // Change every 5 seconds
