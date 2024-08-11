document.addEventListener('DOMContentLoaded', function () {
    const circleContainer = document.getElementById('circle-container');
    const numberOfCircles = 7; // Number of circles to generate
    const minSize = 80;
    const maxSize = 250;
    const gridCols = 2; // Number of columns in the grid
    const gridRows = 2; // Number of rows in the grid
    const cellWidth = window.innerWidth / gridCols + 40;
    const cellHeight = window.innerHeight / gridRows;

    function getRandomSize() {
        return Math.random() * (maxSize - minSize) + minSize;
    }

    function getRandomPositionWithinCell(cellX, cellY, size) {
        const x = cellX * cellWidth + Math.random() * (cellWidth - size);
        const y = cellY * cellHeight + Math.random() * (cellHeight - size);
        return {x, y};
    }

    for (let i = 0; i < numberOfCircles; i++) {
        const size = getRandomSize();
        const cellX = Math.floor(i % gridCols);
        const cellY = Math.floor(i / gridCols);
        const position = getRandomPositionWithinCell(cellX, cellY, size);

        const circleElement = document.createElement('div');
        circleElement.classList.add('circle');
        Object.assign(circleElement.style, {
            width: `${size}px`,
            height: `${size}px`,
            left: `${position.x}px`,
            top: `${position.y}px`,
            zIndex: `-1`
        });
        circleContainer.appendChild(circleElement);
    }

    const navItems = document.querySelectorAll('.nav-item');

    // Smooth scroll to section
    navItems.forEach(item => {
        item.addEventListener('click', event => {
            event.preventDefault();
            document.querySelector(item.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    gsap.registerPlugin(TextPlugin);
    const phrases = [
        "Frontend Development",
        "Backend Development",
        "Web Development",
        "Full-stack Development",
        "Web-App Development"
    ];

    let index = 0;

    function typeWriterEffect() {
        const textElement = document.querySelector('.changing-text');
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
            }
        });
    }

    function backspaceEffect(text, onComplete) {
        const textElement = document.querySelector('.changing-text');
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

    gsap.registerPlugin(ScrollTrigger);

    // Example animation
    document.querySelectorAll('section').forEach(sec => {
        gsap.from(sec, {
            y: 200,
            opacity: 0,
            duration: 1,
            scrollTrigger: {
                trigger: sec,
                start: "top 80%", // When the top of the box hits 80% from the top of the viewport
                end: "top 50%", // When the top of the box hits 50% from the top of the viewport
                scrub: 1, // Smooth scrolling
                toggleActions: "play none none reverse", // Play animation on scroll, reverse on scroll back
            }
        });
    });

    document.getElementById('downloadResume').addEventListener('click', function () {
        const resumeUrl = '/Assets/Files/Shreedevi-RESUME.pdf';
        window.open(resumeUrl, '_blank');
    });
});
