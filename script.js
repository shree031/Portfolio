document.addEventListener("DOMContentLoaded", function () {
  const circleContainer = document.getElementById("circle-container");
  const numberOfCircles = 7; // Number of circles to generate
  const minSize = 80;
  const maxSize = 250;
  const gridCols = 2; // Number of columns in the grid
  const gridRows = 2; // Number of rows in the grid
  const cellWidth = window.innerWidth / gridCols;
  const cellHeight = window.innerHeight / gridRows;

  function isMobileDevice() {
    return window.innerWidth <= 768;
  }

  if (isMobileDevice()) {
    circleContainer.remove();
  } else {
    for (let i = 0; i < numberOfCircles; i++) {
      const size = getRandomSize();
      const cellX = Math.floor(i % gridCols);
      const cellY = Math.floor(i / gridCols);
      const position = getRandomPositionWithinCell(cellX, cellY, size);

      const circleElement = document.createElement("div");
      circleElement.classList.add("circle");
      Object.assign(circleElement.style, {
        width: `${size}px`,
        height: `${size}px`,
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: `-1`,
      });
      circleContainer.appendChild(circleElement);
    }
  }

  function getRandomSize() {
    return Math.random() * (maxSize - minSize) + minSize;
  }

  function getRandomPositionWithinCell(cellX, cellY, size) {
    const x = cellX * cellWidth + Math.random() * (cellWidth - size);
    const y = cellY * cellHeight + Math.random() * (cellHeight - size);
    return { x, y };
  }

  gsap.registerPlugin(TextPlugin);
  const phrases = [
    "Frontend Development",
    "Backend Development",
    "Web Development",
    "Full-stack Development",
    "Web-App Development",
  ];

  let index = 0;

  function typeWriterEffect() {
    const textElement = document.querySelector(".changing-text");
    const currentText = phrases[index];

    // Animate typing effect
    gsap.to(textElement, {
      duration: currentText.length * 0.1, // Speed of typing
      text: currentText,
      ease: "none",
      onComplete: () => {
        // Pause for a bit before starting the backspace effect
        gsap.delayedCall(1, () => {
          backspaceEffect(currentText, () => {
            // Move to the next phrase
            index = (index + 1) % phrases.length;
            typeWriterEffect();
          });
        });
      },
    });
  }

  function backspaceEffect(text, onComplete) {
    const textElement = document.querySelector(".changing-text");
    let currentLength = text.length;

    const interval = setInterval(() => {
      currentLength--;
      textElement.textContent = text.slice(0, currentLength);

      if (currentLength === 0) {
        clearInterval(interval);
        onComplete();
      }
    }, 50); // Speed of backspace
  }

  typeWriterEffect();


  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show-section');
      }else {
        entry.target.classList.remove('show-section'); // optional if you want them to re-hide
      }
    });
  }, {
    threshold: 0.2, // triggers when 30% of the element is visible
    rootMargin: "0px 0px -50px 0px" // or adjust bottom margin to delay trigger
  });
  
  document.querySelectorAll('.hidden-section').forEach(section => {
    observer.observe(section);
  });
  
});
