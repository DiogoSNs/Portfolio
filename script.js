/* =================================================================
   PORTFOLIO - JAVASCRIPT
   ================================================================= */

// =================================================================
// SAFE STORAGE HELPER (Evita erros com file:// ou restrições de cookies)
// =================================================================

const SafeStorage = {
  get(key, fallback = "en") {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        return localStorage.getItem(key) || fallback;
      }
    } catch (e) {
      console.warn("localStorage inacessível:", e);
    }
    return fallback;
  },
  set(key, val) {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem(key, val);
      }
    } catch (e) {
      console.warn("Não foi possível salvar no localStorage:", e);
    }
  }
};

// =================================================================
// TYPEWRITER EFFECT (EFEITO DE DIGITAÇÃO)
// =================================================================

const defaultTexts = ["DEVELOPER", "ENGINEER", "STUDENT"];

const CONFIG = {
  typeSpeed: 100,
  eraseSpeed: 50,
  delayBetweenTexts: 1000,
  delayBeforeErase: 2000,
};

class Typewriter {
  constructor(element, texts, config) {
    this.element = element;
    this.texts = Array.isArray(texts) && texts.length ? texts : defaultTexts;
    this.config = config || CONFIG;
    this.textIndex = 0;
    this.characterIndex = 0;
    this.timeoutId = null;
  }

  type() {
    if (!this.element) return;
    const currentWord = this.texts[this.textIndex % this.texts.length] || "";

    if (this.characterIndex < currentWord.length) {
      this.element.innerHTML += currentWord.charAt(this.characterIndex);
      this.characterIndex++;
      this.timeoutId = setTimeout(() => this.type(), this.config.typeSpeed);
    } else {
      this.timeoutId = setTimeout(() => this.erase(), this.config.delayBeforeErase);
    }
  }

  erase() {
    if (!this.element) return;

    if (this.element.innerHTML.length > 0) {
      this.element.innerHTML = this.element.innerHTML.slice(0, -1);
      this.timeoutId = setTimeout(() => this.erase(), this.config.eraseSpeed);
    } else {
      this.textIndex = (this.textIndex + 1) % this.texts.length;
      this.characterIndex = 0;
      this.timeoutId = setTimeout(() => this.type(), this.config.delayBetweenTexts);
    }
  }

  updateTexts(newTexts) {
    if (!Array.isArray(newTexts) || !newTexts.length) return;
    clearTimeout(this.timeoutId);
    this.texts = newTexts;
    this.textIndex = 0;
    this.characterIndex = 0;
    if (this.element) {
      this.element.innerHTML = "";
    }
    this.type();
  }

  start() {
    clearTimeout(this.timeoutId);
    this.characterIndex = 0;
    if (this.element) {
      this.element.innerHTML = "";
    }
    this.type();
  }
}

// =================================================================
// LANGUAGE MANAGER (INTERNACIONALIZAÇÃO)
// =================================================================

class LanguageManager {
  constructor(typewriterInstance) {
    this.typewriter = typewriterInstance;
    this.currentLang = SafeStorage.get("portfolio_lang", "en");
    this.translations = window.portfolioTranslations || {};

    this.langSelector = document.getElementById("langSelector");
    this.langBtn = document.getElementById("langBtn");
    this.langCurrent = document.querySelector(".lang-current");
    this.langDropdown = document.getElementById("langDropdown");
    this.langOptions = document.querySelectorAll(".lang-option");
    this.dropdownLangBtns = document.querySelectorAll(".dropdown-lang-btn");

    this.init();
  }

  init() {
    // Aplicar idioma inicial
    this.setLanguage(this.currentLang, false);

    // Configurar ouvintes de eventos
    this.setupDropdownListeners();
    this.setupOptionListeners();
  }

  setupDropdownListeners() {
    if (!this.langBtn || !this.langSelector) return;

    this.langBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.langSelector.classList.toggle("open");
    });

    document.addEventListener("click", (e) => {
      if (this.langSelector && !this.langSelector.contains(e.target)) {
        this.langSelector.classList.remove("open");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.langSelector) {
        this.langSelector.classList.remove("open");
      }
    });
  }

  setupOptionListeners() {
    // Opções no dropdown desktop
    this.langOptions.forEach((option) => {
      option.addEventListener("click", (e) => {
        e.stopPropagation();
        const selectedLang = option.getAttribute("data-lang");
        if (selectedLang && selectedLang !== this.currentLang) {
          this.setLanguage(selectedLang, true);
        }
        if (this.langSelector) {
          this.langSelector.classList.remove("open");
        }
      });
    });

    // Opções no menu mobile
    this.dropdownLangBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const selectedLang = btn.getAttribute("data-lang");
        if (selectedLang && selectedLang !== this.currentLang) {
          this.setLanguage(selectedLang, true);
        }
      });
    });
  }

  setLanguage(lang, notifyTypewriter = true) {
    if (!this.translations[lang]) return;

    this.currentLang = lang;
    SafeStorage.set("portfolio_lang", lang);

    // Atualizar tag HTML lang e atributo data-lang para controle de CSS
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
    document.documentElement.setAttribute("data-lang", lang);
    if (document.body) {
      document.body.setAttribute("data-lang", lang);
    }

    // Atualizar indicador de texto no botão
    if (this.langCurrent) {
      this.langCurrent.textContent = lang.toUpperCase();
    }

    // Atualizar estado ativo nas opções do desktop
    this.langOptions.forEach((opt) => {
      if (opt.getAttribute("data-lang") === lang) {
        opt.classList.add("active");
      } else {
        opt.classList.remove("active");
      }
    });

    // Atualizar estado ativo nas opções do mobile
    this.dropdownLangBtns.forEach((btn) => {
      if (btn.getAttribute("data-lang") === lang) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // Traduzir textos da página
    this.translateElements(lang);

    // Atualizar efeito de digitação caso tenha sido disparado por ação do usuário
    if (this.typewriter && this.translations[lang]?.hero?.typewriter) {
      if (notifyTypewriter) {
        this.typewriter.updateTexts(this.translations[lang].hero.typewriter);
      }
    }
  }

  getNestedTranslation(obj, path) {
    return path.split(".").reduce((prev, curr) => (prev ? prev[curr] : null), obj);
  }

  translateElements(lang) {
    const dict = this.translations[lang];
    if (!dict) return;

    // Título da página
    if (dict.meta && dict.meta.title) {
      document.title = dict.meta.title;
    }

    // Textos simples
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const translation = this.getNestedTranslation(dict, key);
      if (translation !== undefined && translation !== null) {
        el.textContent = translation;
      }
    });

    // Elementos com HTML formatado
    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      const translation = this.getNestedTranslation(dict, key);
      if (translation !== undefined && translation !== null) {
        el.innerHTML = translation;
      }
    });

    // Atributos de elementos
    document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      const attrPair = el.getAttribute("data-i18n-attr");
      const [attrName, key] = attrPair.split(":");
      const translation = this.getNestedTranslation(dict, key);
      if (translation !== undefined && translation !== null) {
        el.setAttribute(attrName, translation);
      }
    });
  }
}

// =================================================================
// SCROLL TO TOP BUTTON
// =================================================================

class ScrollToTop {
  constructor() {
    this.button = document.querySelector(".scroll-button a");
    this.init();
  }

  init() {
    if (!this.button) return;

    window.addEventListener("scroll", () => this.toggleButton());

    this.button.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  toggleButton() {
    if (window.scrollY > 300) {
      this.button.classList.add("show");
    } else {
      this.button.classList.remove("show");
    }
  }
}

// =================================================================
// SCROLL REVEAL ANIMATION
// =================================================================

class ScrollReveal {
  constructor() {
    this.elements = document.querySelectorAll(".reveal");
    this.init();
  }

  init() {
    if (!this.elements || this.elements.length === 0) return;

    this.reveal();
    window.addEventListener("scroll", () => this.reveal());
  }

  reveal() {
    this.elements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (elementTop < windowHeight - 100) {
        element.classList.add("active");
      }
    });
  }
}

// =================================================================
// LOADING SCREEN
// =================================================================

class LoadingScreen {
  constructor() {
    this.loader = document.querySelector(".loader");
    this.init();
  }

  init() {
    if (!this.loader) return;

    window.addEventListener("load", () => {
      setTimeout(() => {
        this.loader.classList.add("hidden");
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
    this.links.forEach((link) => {
      link.addEventListener("click", (e) => {
        const targetId = link.getAttribute("href");
        if (targetId === "#") return;

        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          e.preventDefault();
          const offsetTop = targetElement.offsetTop - 80;

          window.scrollTo({
            top: offsetTop,
            behavior: "smooth",
          });

          // Fechar menu mobile se estiver aberto
          const dropdown = document.querySelector(".dropdown");
          const hamburger = document.querySelector(".hamburg");
          if (dropdown && dropdown.classList.contains("active")) {
            dropdown.classList.remove("active");
            if (hamburger) hamburger.classList.remove("hide");
            document.body.style.overflow = "";
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
    this.nav = document.querySelector("nav");
    this.init();
  }

  init() {
    if (!this.nav) return;

    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        this.nav.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.8)";
      } else {
        this.nav.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.5)";
      }
    });
  }
}

// =================================================================
// MOBILE MENU - HAMBURGER
// =================================================================

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

    this.hamburger.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggle();
    });

    this.links.forEach((link) => {
      link.addEventListener("click", () => {
        this.close();
      });
    });

    document.addEventListener("click", (e) => {
      if (
        this.dropdown.classList.contains("active") &&
        !this.dropdown.contains(e.target) &&
        !this.hamburger.contains(e.target)
      ) {
        this.close();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.dropdown.classList.contains("active")) {
        this.close();
      }
    });

    window.addEventListener("resize", () => {
      if (
        window.innerWidth > 968 &&
        this.dropdown.classList.contains("active")
      ) {
        this.close();
      }
    });
  }

  toggle() {
    if (this.dropdown.classList.contains("active")) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.dropdown.classList.add("active");
    this.hamburger.classList.add("hide");
    this.body.style.overflow = "hidden";
  }

  close() {
    this.dropdown.classList.remove("active");
    this.hamburger.classList.remove("hide");
    this.body.style.overflow = "";
  }
}

// =================================================================
// INICIALIZAÇÃO GERAL
// =================================================================

document.addEventListener("DOMContentLoaded", () => {
  // 1. Obter idioma salvo de forma segura
  const savedLang = SafeStorage.get("portfolio_lang", "en");

  // 2. Inicializar Typewriter com o idioma selecionado
  const typewriterElement = document.querySelector(".typewriter-text");
  let typewriter = null;

  const translations = window.portfolioTranslations || {};
  const currentTexts = (translations[savedLang]?.hero?.typewriter) || defaultTexts;

  if (typewriterElement) {
    typewriter = new Typewriter(typewriterElement, currentTexts, CONFIG);
    typewriter.start();
  }

  // 3. Inicializar Gerenciador de Idiomas
  try {
    new LanguageManager(typewriter);
  } catch (err) {
    console.error("LanguageManager error:", err);
  }

  // 4. Inicializar componentes auxiliares de forma segura
  try { new ScrollToTop(); } catch (e) {}
  try { new ScrollReveal(); } catch (e) {}
  try { new LoadingScreen(); } catch (e) {}
  try { new SmoothScroll(); } catch (e) {}
  try { new NavbarScroll(); } catch (e) {}
  try { new MobileMenu(); } catch (e) {}

  console.log("✅ Portfolio JavaScript inicializado com sucesso!");
});
