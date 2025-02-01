// Matrix text scramble effect
class TextScramble {
  constructor(el) {
      this.el = el;
      this.chars = '!<>-_\\/[]{}—=+*^?#________';
      this.update = this.update.bind(this);
  }
  
  setText(newText) {
      const oldText = this.el.innerText;
      const length = Math.max(oldText.length, newText.length);
      const promise = new Promise((resolve) => this.resolve = resolve);
      this.queue = [];
      
      for (let i = 0; i < length; i++) {
          const from = oldText[i] || '';
          const to = newText[i] || '';
          const start = Math.floor(Math.random() * 40);
          const end = start + Math.floor(Math.random() * 40);
          this.queue.push({ from, to, start, end });
      }
      
      cancelAnimationFrame(this.frameRequest);
      this.frame = 0;
      this.update();
      return promise;
  }
  
  update() {
      let output = '';
      let complete = 0;
      
      for (let i = 0, n = this.queue.length; i < n; i++) {
          let { from, to, start, end, char } = this.queue[i];
          
          if (this.frame >= end) {
              complete++;
              output += to;
          } else if (this.frame >= start) {
              if (!char || Math.random() < 0.28) {
                  char = this.randomChar();
                  this.queue[i].char = char;
              }
              output += `<span class="dud">${char}</span>`;
          } else {
              output += from;
          }
      }
      
      this.el.innerHTML = output;
      
      if (complete === this.queue.length) {
          this.resolve();
      } else {
          this.frameRequest = requestAnimationFrame(this.update);
          this.frame++;
      }
  }
  
  randomChar() {
      return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

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
  const title = document.querySelector('.matrix-title');
  const image = document.querySelector('.profile-image');
  const fx = new TextScramble(title);
  
  // Start the scramble effect
  fx.setText('SUDHANTHIRAN').then(() => {
      // Reveal image after text animation
      setTimeout(() => {
          image.classList.add('show');
      }, 300);
  });
  
  new InteractiveBackground();
});

// Custom Cursor Effect
document.addEventListener('mousemove', (e) => {
  const cursor = document.querySelector('.custom-cursor');
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});


const projectsSection = document.querySelector('.projects-section');

let scrollAmount = 0;
let isScrolling = false;

projectsSection.addEventListener('wheel', (e) => {
  e.preventDefault();

  // Calculate new scroll position
  let newScrollLeft = projectsSection.scrollLeft + e.deltaY * 3;

  // Stop scrolling if at start or end
  if (newScrollLeft <= 0 || newScrollLeft >= projectsSection.scrollWidth - projectsSection.clientWidth) {
    return;
  }

  scrollAmount += e.deltaY * 3;
  if (!isScrolling) {
    isScrolling = true;
    requestAnimationFrame(smoothScroll);
  }
});

function smoothScroll() {
  projectsSection.scrollLeft += scrollAmount / 0.9;

  // Stop if at the end
  if (projectsSection.scrollLeft <= 0 || projectsSection.scrollLeft >= projectsSection.scrollWidth - projectsSection.clientWidth) {
    scrollAmount = 0;
    isScrolling = false;
    return;
  }

  scrollAmount *= 0.9;
  if (Math.abs(scrollAmount) > 0.5) {
    requestAnimationFrame(smoothScroll);
  } else {
    isScrolling = false;
  }
}

