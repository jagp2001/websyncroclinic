const supportedLangs = ['es','en','pt'];
const defaultLang = 'es';

function loadLanguage(lang) {
  lang = supportedLangs.includes(lang) ? lang : defaultLang;
  localStorage.setItem('lang', lang);
  fetch(`assets/i18n/${lang}.json`)
    .then(res => res.json())
    .then(data => {
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const keys = el.getAttribute('data-i18n').split('.');
        let value = data;
        keys.forEach(k => { value = value ? value[k] : null; });
        if (value !== null && value !== undefined) {
          el.innerHTML = value;
        }
      });
    });
}

function initLanguage() {
  const stored = localStorage.getItem('lang');
  const lang = stored || navigator.language.slice(0,2);
  loadLanguage(lang);
}

document.addEventListener('DOMContentLoaded', () => {
  initLanguage();
  document.querySelectorAll('.lang-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const lang = link.getAttribute('data-lang');
      loadLanguage(lang);
    });
  });
});
