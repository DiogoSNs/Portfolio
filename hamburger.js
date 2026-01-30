/* =================================================================
   MOBILE MENU - HAMBURGER (VERSÃO CORRIGIDA)
   ================================================================= */

class MobileMenu {
  constructor() {
    this.dropdown = document.querySelector(".dropdown");
    this.hamburger = document.querySelector(".hamburg");
    this.links = document.querySelectorAll(".dropdown .links a");
    this.body = document.body;
    
    this.init();
  }

  init() {
    if (!this.dropdown || !this.hamburger) return;

    // Abrir/Fechar menu ao clicar no hambúrguer
    this.hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggle();
    });
    
    // Fechar menu ao clicar em um link
    this.links.forEach(link => {
      link.addEventListener('click', () => {
        this.close();
      });
    });

    // Fechar menu ao clicar FORA
    document.addEventListener('click', (e) => {
      if (this.dropdown.classList.contains('active') && 
          !this.dropdown.contains(e.target) && 
          !this.hamburger.contains(e.target)) {
        this.close();
      }
    });

    // Fechar menu ao pressionar ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.dropdown.classList.contains('active')) {
        this.close();
      }
    });

    // Fechar menu ao redimensionar para desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 968 && this.dropdown.classList.contains('active')) {
        this.close();
      }
    });
  }

  toggle() {
    if (this.dropdown.classList.contains('active')) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.dropdown.classList.add('active');
    this.hamburger.classList.add('hide');
    this.body.style.overflow = 'hidden';
  }

  close() {
    this.dropdown.classList.remove('active');
    this.hamburger.classList.remove('hide');
    this.body.style.overflow = '';
  }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  new MobileMenu();
  console.log('✅ Menu mobile inicializado!');
});