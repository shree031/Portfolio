document.addEventListener('DOMContentLoaded', function () {
    const circleContainer = document.getElementById('circle-container');
    const numberOfCircles = 7; // Number of circles to generate
    const minSize = 80;
    const maxSize = 250;
    const gridCols = 2; // Number of columns in the grid
    const gridRows = 2; // Number of rows in the grid
    const cellWidth = window.innerWidth / gridCols;
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

   /* // Smooth scroll to section
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', event => {
            event.preventDefault();
            document.querySelector(item.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });*/

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
            y: 100,
            opacity: 0,
            duration: 1,
            scrollTrigger: {
                trigger: sec,
                start: "top 80%",
                end: "top 50%",
                scrub: 1,
                toggleActions: "play none none reverse",
            }
        });
    });

    const navItems = document.querySelectorAll('.nav-item');
    const offcanvasElement = document.getElementById('offcanvasNavbar');
    const bsOffcanvas = new bootstrap.Offcanvas(offcanvasElement);

    navItems.forEach(item => {
        item.addEventListener('click', event => {
            event.preventDefault();

            const targetId = item.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }

            if (window.innerWidth < 992) {  // Close offcanvas only on small screens
                bsOffcanvas.hide();
            }
        });
    });

    const sections = document.querySelectorAll("section");
    // const navItems = document.querySelectorAll(".nav-item");

    const observerOptions = {
        root: null, // Use the viewport as the container
        rootMargin: "0px",
        threshold: 0.5 // Trigger when 50% of the section is visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navItems.forEach(item => {
                    item.classList.remove("active-nav");
                    if (item.getAttribute("href").substring(1) === entry.target.id) {
                        item.classList.add("active-nav");
                    }
                });
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

});
