/* =================================================================
   MOBILE MENU - HAMBURGER
   ================================================================= */

class MobileMenu {
  constructor() {
    this.dropdown = document.querySelector(".dropdown");
    this.hamburger = document.querySelector(".hamburg");
    this.cancel = document.querySelector(".cancel");
    this.links = document.querySelectorAll(".dropdown a");
    this.body = document.body;
    
    this.init();
  }

  init() {
    // Abrir menu
    if (this.hamburger) {
      this.hamburger.addEventListener('click', () => this.open());
    }
    
    // Fechar menu
    if (this.cancel) {
      this.cancel.addEventListener('click', () => this.close());
    }
    
    // Fechar menu ao clicar em um link
    this.links.forEach(link => {
      link.addEventListener('click', () => this.close());
    });

    // Fechar menu ao clicar fora dele
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.dropdown') && 
          !e.target.closest('.hamburg') && 
          this.dropdown.classList.contains('active')) {
        this.close();
      }
    });

    // Fechar menu ao pressionar ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.dropdown.classList.contains('active')) {
        this.close();
      }
    });

    // Ajustar menu ao redimensionar janela
    window.addEventListener('resize', () => {
      if (window.innerWidth > 968) {
        this.close();
      }
    });
  }

  open() {
    this.dropdown?.classList.add('active');
    this.hamburger?.classList.add('active');
    this.body.style.overflow = 'hidden'; // Previne scroll do body
    
    // Adiciona animação de fade-in nos links
    this.animateLinks();
  }

  close() {
    this.dropdown?.classList.remove('active');
    this.hamburger?.classList.remove('active');
    this.body.style.overflow = ''; // Restaura scroll do body
  }

  animateLinks() {
    // Adiciona delay progressivo nas animações dos links
    this.links.forEach((link, index) => {
      link.style.animation = `fadeInLeft 0.5s ease ${index * 0.1}s forwards`;
    });
  }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  new MobileMenu();
  console.log('✅ Menu mobile inicializado!');
});

// Animação CSS (adicione ao CSS se quiser efeito extra)
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInLeft {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;
document.head.appendChild(style);

/* =================================================================
   FUNÇÕES GLOBAIS (mantidas para compatibilidade)
   ================================================================= */

// Funções globais para serem chamadas via onclick no HTML
function hamburg() {
  document.querySelector(".dropdown")?.classList.add("active");
  document.querySelector(".hamburg")?.classList.add("active");
  document.body.style.overflow = 'hidden';
}

function cancel() {
  document.querySelector(".dropdown")?.classList.remove("active");
  document.querySelector(".hamburg")?.classList.remove("active");
  document.body.style.overflow = '';
}
