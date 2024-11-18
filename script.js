class InteractiveBackground {
    constructor() {
      this.svg = document.querySelector('.bg-svg');
      this.gridContainer = document.getElementById('gridContainer');
      this.spacing = 5; // Grid spacing
      this.maxDistance = 15; // Effect radius
      this.maxDisplacement = 2; // Max bend amount
      
      this.createGrid();
      this.attachEvents();
    }

    createGrid() {
      // Create vertical lines
      for (let x = 0; x <= 100; x += this.spacing) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
        line.setAttribute('class', 'grid-line vertical');
        line.setAttribute('d', `M ${x} 0 L ${x} 100`);
        line.setAttribute('stroke', '#ffffff');
        line.setAttribute('stroke-width', '0.1');
        line.setAttribute('opacity', '0.05');
        this.gridContainer.appendChild(line);
      }
      
      // Create horizontal lines
      for (let y = 0; y <= 100; y += this.spacing) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
        line.setAttribute('class', 'grid-line horizontal');
        line.setAttribute('d', `M 0 ${y} L 100 ${y}`);
        line.setAttribute('stroke', '#ffffff');
        line.setAttribute('stroke-width', '0.1');
        line.setAttribute('opacity', '0.05');
        this.gridContainer.appendChild(line);
      }
    }

    updateGrid(mouseX, mouseY) {
      const bounds = this.svg.getBoundingClientRect();
      const svgPoint = {
        x: (mouseX / bounds.width) * 100,
        y: (mouseY / bounds.height) * 100
      };

      const lines = document.querySelectorAll('.grid-line');
      
      lines.forEach(line => {
        const isVertical = line.classList.contains('vertical');
        const linePos = isVertical ? 
          parseFloat(line.getAttribute('d').split(' ')[1]) : 
          parseFloat(line.getAttribute('d').split(' ')[2]);
        
        if (isVertical) {
          const distance = Math.abs(svgPoint.x - linePos);
          if (distance < this.maxDistance) {
            const displacement = (1 - distance / this.maxDistance) * this.maxDisplacement;
            const controlX = linePos + (svgPoint.x > linePos ? displacement : -displacement);
            line.setAttribute('d', `M ${linePos} 0 Q ${controlX} ${svgPoint.y} ${linePos} 100`);
          } else {
            line.setAttribute('d', `M ${linePos} 0 L ${linePos} 100`);
          }
        } else {
          const distance = Math.abs(svgPoint.y - linePos);
          if (distance < this.maxDistance) {
            const displacement = (1 - distance / this.maxDistance) * this.maxDisplacement;
            const controlY = linePos + (svgPoint.y > linePos ? displacement : -displacement);
            line.setAttribute('d', `M 0 ${linePos} Q ${svgPoint.x} ${controlY} 100 ${linePos}`);
          } else {
            line.setAttribute('d', `M 0 ${linePos} L 100 ${linePos}`);
          }
        }
      });
    }

    attachEvents() {
      window.addEventListener('mousemove', (e) => {
        requestAnimationFrame(() => {
          this.updateGrid(e.clientX, e.clientY);
        });
      });
    }
  }

  // Initialize when the document is loaded
  document.addEventListener('DOMContentLoaded', () => {
    new InteractiveBackground();
  });

  // Custom Cursor Effect
  document.addEventListener('mousemove', (e) => {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorGlow = document.querySelector('.cursor-glow');
    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top = e.clientY + 'px';
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
  });

  // Horizontal Scroll with Mouse Wheel
  document.querySelector('.projects-section').addEventListener('wheel', (e) => {
    e.preventDefault();
    const container = e.currentTarget;
    container.scrollBy({
      left: e.deltaY, // Horizontal scrolling
      behavior: 'smooth'
    });
  });

  // Drag-to-Scroll for Touch Devices and Desktop
  let isDown = false;
  let startX;
  let scrollLeft;
  const projectsSection = document.querySelector('.projects-section');

  projectsSection.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - projectsSection.offsetLeft;
    scrollLeft = projectsSection.scrollLeft;
  });

  projectsSection.addEventListener('mouseleave', () => isDown = false);
  projectsSection.addEventListener('mouseup', () => isDown = false);

  projectsSection.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - projectsSection.offsetLeft;
    const walk = (x - startX) * 2; // Speed multiplier
    projectsSection.scrollLeft = scrollLeft - walk;
  });