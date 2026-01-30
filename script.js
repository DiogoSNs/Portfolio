/* =================================================================
   PORTFOLIO - JAVASCRIPT MELHORADO
   ================================================================= */

// =================================================================
// TYPEWRITER EFFECT (EFEITO DE DIGITAÇÃO)
// =================================================================

const texts = ["DEVELOPER", "COMPUTER ENGINEER", "STUDENT"];

const CONFIG = {
  typeSpeed: 100,
  eraseSpeed: 50,
  delayBetweenTexts: 1000,
  delayBeforeErase: 2000
};

class Typewriter {
  constructor(element, texts, config) {
    this.element = element;
    this.texts = texts;
    this.config = config;
    this.textIndex = 0;
    this.characterIndex = 0;
  }

  type() {
    if (this.characterIndex < this.texts[this.textIndex].length) {
      this.element.innerHTML += this.texts[this.textIndex].charAt(this.characterIndex);
      this.characterIndex++;
      setTimeout(() => this.type(), this.config.typeSpeed);
    } else {
      setTimeout(() => this.erase(), this.config.delayBeforeErase);
    }
  }

  erase() {
    if (this.element.innerHTML.length > 0) {
      this.element.innerHTML = this.element.innerHTML.slice(0, -1);
      setTimeout(() => this.erase(), this.config.eraseSpeed);
    } else {
      this.textIndex = (this.textIndex + 1) % this.texts.length;
      this.characterIndex = 0;
      setTimeout(() => this.type(), this.config.delayBetweenTexts);
    }
  }

  start() {
    this.type();
  }
}

// =================================================================
// SCROLL TO TOP BUTTON
// =================================================================

class ScrollToTop {
  constructor() {
    this.button = document.querySelector('.scroll-button a');
    this.init();
  }

  init() {
    if (!this.button) return;
    
    // Mostrar/ocultar botão ao fazer scroll
    window.addEventListener('scroll', () => this.toggleButton());
    
    // Click no botão para voltar ao topo
    this.button.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      });
    });
  }

  toggleButton() {
    if (window.scrollY > 300) {
      this.button.classList.add('show');
    } else {
      this.button.classList.remove('show');
    }
  }
}

// =================================================================
// SCROLL REVEAL ANIMATION
// =================================================================

class ScrollReveal {
  constructor() {
    this.elements = document.querySelectorAll('.reveal');
    this.init();
  }

  init() {
    if (this.elements.length === 0) return;
    
    // Revelar elementos ao carregar a página
    this.reveal();
    
    // Revelar elementos ao fazer scroll
    window.addEventListener('scroll', () => this.reveal());
  }

  reveal() {
    this.elements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      // Ativar animação quando elemento está visível
      if (elementTop < windowHeight - 100) {
        element.classList.add('active');
      }
    });
  }
}

// =================================================================
// LOADING SCREEN
// =================================================================

class LoadingScreen {
  constructor() {
    this.loader = document.querySelector('.loader');
    this.init();
  }

  init() {
    if (!this.loader) return;
    
    // Esconder loader após página carregar
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.loader.classList.add('hidden');
      }, 500);
    });
  }
}

// =================================================================
// SMOOTH SCROLL PARA LINKS DE NAVEGAÇÃO
// =================================================================

class SmoothScroll {
  constructor() {
    this.links = document.querySelectorAll('a[href^="#"]');
    this.init();
  }

  init() {
    this.links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          const offsetTop = targetElement.offsetTop - 80; // Offset para compensar navbar
          
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
          
          // Fechar menu mobile se estiver aberto
          const dropdown = document.querySelector('.dropdown');
          if (dropdown && dropdown.classList.contains('active')) {
            dropdown.classList.remove('active');
          }
        }
      });
    });
  }
}

// =================================================================
// NAVBAR SCROLL EFFECT
// =================================================================

class NavbarScroll {
  constructor() {
    this.nav = document.querySelector('nav');
    this.init();
  }

  init() {
    if (!this.nav) return;
    
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        this.nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.8)';
      } else {
        this.nav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.5)';
      }
    });
  }
}

// =================================================================
// INICIALIZAÇÃO
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Inicializar Typewriter
  const typewriterElement = document.querySelector(".typewriter-text");
  if (typewriterElement) {
    const typewriter = new Typewriter(typewriterElement, texts, CONFIG);
    typewriter.start();
  }

  // Inicializar Scroll to Top
  new ScrollToTop();

  // Inicializar Scroll Reveal
  new ScrollReveal();

  // Inicializar Loading Screen
  new LoadingScreen();

  // Inicializar Smooth Scroll
  new SmoothScroll();

  // Inicializar Navbar Scroll Effect
  new NavbarScroll();

  // Log de inicialização
  console.log('✅ Portfolio JavaScript inicializado com sucesso!');
});

// =================================================================
// PERFORMANCE OPTIMIZATION
// =================================================================

// Lazy Loading de Imagens (se necessário no futuro)
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      }
    });
  });

  // Observar imagens com data-src (adicione data-src nas imgs para usar)
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// Debounce para otimizar eventos de scroll/resize
function debounce(func, wait = 10) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Aplicar debounce aos eventos de scroll (se necessário)
// window.addEventListener('scroll', debounce(() => {
//   // Seu código aqui
// }, 10));
