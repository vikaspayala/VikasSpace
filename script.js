// Initialize AOS (scroll animations)
AOS.init();

// Scroll Reveal Logic
const scrollElements = document.querySelectorAll(".js-scroll");

const elementInView = (el, dividend = 1) => {
  const elementTop = el.getBoundingClientRect().top;
  return elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend;
};

const elementOutofView = (el) => {
  const elementTop = el.getBoundingClientRect().top;
  return elementTop > (window.innerHeight || document.documentElement.clientHeight);
};

const displayScrollElement = (element) => {
  element.classList.add("scrolled");
};

const hideScrollElement = (element) => {
  element.classList.remove("scrolled");
};

const handleScrollAnimation = () => {
  scrollElements.forEach((el) => {
    if (elementInView(el, 1.25)) {
      displayScrollElement(el);
    } else if (elementOutofView(el)) {
      hideScrollElement(el);
    }
  });
};

window.addEventListener("scroll", () => {
  handleScrollAnimation();
});

document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.cert-carousel');
    const items = document.querySelectorAll('.cert-item');
    const indicatorsContainer = document.querySelector('.carousel-indicators');
    const prevButton = document.querySelector('.carousel-arrow.prev');
    const nextButton = document.querySelector('.carousel-arrow.next');
    let currentIndex = 0;
    let autoSlideInterval;
  
    // Create indicators
    items.forEach((_, index) => {
      const indicator = document.createElement('span');
      indicator.addEventListener('click', () => goToSlide(index));
      indicatorsContainer.appendChild(indicator);
    });
  
    const indicators = document.querySelectorAll('.carousel-indicators span');
  
    // Update carousel position and active indicator
    function updateCarousel() {
      const offset = -currentIndex * 100;
      carousel.style.transform = `translateX(${offset}%)`;
      indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentIndex);
      });
    }
  
    // Go to a specific slide
    function goToSlide(index) {
      currentIndex = index;
      updateCarousel();
      resetAutoSlide();
    }
  
    // Move to the next slide
    function nextSlide() {
      currentIndex = (currentIndex + 1) % items.length;
      updateCarousel();
    }
  
    // Move to the previous slide
    function prevSlide() {
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      updateCarousel();
    }
  
    // Reset the auto-slide interval
    function resetAutoSlide() {
      clearInterval(autoSlideInterval);
      autoSlideInterval = setInterval(nextSlide, 5000);
    }
  
    // Event listeners for buttons
    nextButton.addEventListener('click', () => {
      nextSlide();
      resetAutoSlide();
    });
  
    prevButton.addEventListener('click', () => {
      prevSlide();
      resetAutoSlide();
    });
  
    // Initialize
    indicators[0].classList.add('active');
    resetAutoSlide();
  
    // Pause on hover
    carousel.parentElement.addEventListener('mouseenter', () => {
      clearInterval(autoSlideInterval);
    });
  
    carousel.parentElement.addEventListener('mouseleave', () => {
      resetAutoSlide();
    });
  });

// Text Scramble for .text (cycles phrases)
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+;()?#_';
    this.update = this.update.bind(this);
  }

  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => (this.resolve = resolve));
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

// Phrases to scramble through
const phrases = [
  'Ex-Software Engineer',
  'Web Developer',
  'Python Developer',
  'I Love to Develop'
];

// Start the scramble effect once DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const textEl = document.querySelector('.text');
  if (!textEl) return; // if there's no .text element, skip

  const fx = new TextScramble(textEl);
  let counter = 0;

  const next = () => {
    fx.setText(phrases[counter]).then(() => {
      setTimeout(next, 800);
    });
    counter = (counter + 1) % phrases.length;
  };

  next();
});
