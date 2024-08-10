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
            zIndex : `-1`
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

});
