/*
JS for carousel in landing page
*/
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.carousel');
    const images = Array.from(carousel.querySelectorAll('img'));
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');
    let currentIndex = 0; // Start with the first image

    function updateCarousel() {
        const imageWidth = images[0].clientWidth + 10; // Get image width with margin
        const offset = -currentIndex * imageWidth; // Center image between arrows
        carousel.style.transform = `translateX(${offset}px)`;
    }

    rightArrow.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % images.length; // Loop back to first image
        updateCarousel();
    });

    leftArrow.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length; // Loop to last image
        updateCarousel();
    });

    // Center first image on load
    updateCarousel();
});