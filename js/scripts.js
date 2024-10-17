document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.carousel');
    const images = Array.from(carousel.querySelectorAll('img'));
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');
    let currentIndex = 1; // Start from the first actual image
    
    // Clone first and last images to create seamless loop
    const firstClone = images[0].cloneNode(true);
    const lastClone = images[images.length - 1].cloneNode(true);
    
    carousel.appendChild(firstClone);
    carousel.insertBefore(lastClone, images[0]);
    
    const totalImages = images.length + 2; // Include the clones
    const imageWidth = images[0].offsetWidth + 20; // Adjust for margin
    
    // Dynamically set the carousel width
    carousel.style.width = `${totalImages * imageWidth}px`;
    
    // Set initial position
    carousel.style.transform = `translateX(-${currentIndex * imageWidth}px)`;
  
    function moveCarousel(direction) {
        currentIndex += direction;
        
        carousel.style.transition = 'transform 0.5s ease';
        carousel.style.transform = `translateX(-${currentIndex * imageWidth}px)`;
        
        if (currentIndex === totalImages - 1) {
            setTimeout(() => {
                carousel.style.transition = 'none';
                currentIndex = 1;
                carousel.style.transform = `translateX(-${currentIndex * imageWidth}px)`;
            }, 500); // Wait for the transition to end
        } else if (currentIndex === 0) {
            setTimeout(() => {
                carousel.style.transition = 'none';
                currentIndex = totalImages - 2;
                carousel.style.transform = `translateX(-${currentIndex * imageWidth}px)`; 
            }, 500);
        }
    }
  
    rightArrow.addEventListener('click', () => moveCarousel(1));
    leftArrow.addEventListener('click', () => moveCarousel(-1));
  
    setInterval(() => moveCarousel(1), 3000); // Automatic scrolling
});

console.log(`Current Index: ${currentIndex}`);
console.log(`Transform: translateX(-${currentIndex * imageWidth}px)`);
