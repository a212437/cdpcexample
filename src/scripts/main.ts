let currentHeader: HTMLElement | null = null;
let revealObserver: IntersectionObserver | null = null;
let ticking = false;
let previousMenuTrigger: HTMLElement | null = null;

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const updateOnScroll = () => {
  ticking = false;

  if (currentHeader) {
    currentHeader.classList.toggle('is-scrolled', window.scrollY > 24);
  }

  const heroImage = document.querySelector<HTMLElement>('.hero__media img');
  if (heroImage) {
    if (prefersReducedMotion() || window.innerWidth < 768) {
      heroImage.style.transform = '';
    } else {
      const shift = Math.min(window.scrollY * 0.055, 38);
      heroImage.style.transform = `translate3d(0, ${shift}px, 0) scale(1.035)`;
    }
  }
};

const onScroll = () => {
  if (ticking) return;
  ticking = true;
  window.requestAnimationFrame(updateOnScroll);
};

const initReveals = () => {
  revealObserver?.disconnect();

  const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));

  if (!('IntersectionObserver' in window) || prefersReducedMotion()) {
    elements.forEach((element) => element.classList.add('is-visible'));
    return;
  }

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver?.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );

  elements.forEach((element) => revealObserver?.observe(element));
};

const getFocusable = (container: HTMLElement) =>
  Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), summary, [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => element.offsetParent !== null);

const initMobileMenu = () => {
  const menu = document.querySelector<HTMLElement>('[data-mobile-menu]');
  const openButton = document.querySelector<HTMLElement>('[data-menu-open]');
  if (!menu || !openButton || menu.dataset.menuReady === 'true') return;
  menu.dataset.menuReady = 'true';

  const closeButton = menu.querySelector<HTMLElement>('[data-menu-close]');
  let isOpen = false;

  const openMenu = () => {
    if (isOpen) return;
    isOpen = true;
    previousMenuTrigger = document.activeElement as HTMLElement;
    menu.removeAttribute('inert');
    menu.setAttribute('aria-hidden', 'false');
    menu.classList.add('is-open');
    openButton.setAttribute('aria-expanded', 'true');
    document.documentElement.classList.add('menu-open');
    document.body.style.overflow = 'hidden';
    window.setTimeout(() => closeButton?.focus(), 40);
  };

  const closeMenu = (returnFocus = true) => {
    if (!isOpen) return;
    isOpen = false;
    menu.setAttribute('aria-hidden', 'true');
    menu.classList.remove('is-open');
    openButton.setAttribute('aria-expanded', 'false');
    document.documentElement.classList.remove('menu-open');
    document.body.style.overflow = '';
    window.setTimeout(() => {
      if (!isOpen) menu.setAttribute('inert', '');
    }, 300);
    if (returnFocus) {
      (previousMenuTrigger ?? openButton).focus();
    }
  };

  openButton.addEventListener('click', openMenu);
  closeButton?.addEventListener('click', () => closeMenu());

  menu.querySelectorAll<HTMLElement>('[data-menu-link]').forEach((link) => {
    link.addEventListener('click', () => closeMenu(false));
  });

  menu.addEventListener('keydown', (event) => {
    if (!isOpen) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu();
      return;
    }

    if (event.key !== 'Tab') return;

    const focusable = getFocusable(menu);
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
};

const initSkipLink = () => {
  const link = document.querySelector<HTMLAnchorElement>('.skip-link');
  const main = document.querySelector<HTMLElement>('#main-content');
  if (!link || !main || link.dataset.skipReady === 'true') return;
  link.dataset.skipReady = 'true';

  link.addEventListener('click', () => {
    window.setTimeout(() => main.focus({ preventScroll: true }), 0);
  });
};

const init = () => {
  currentHeader = document.querySelector<HTMLElement>('[data-site-header]');
  document.body.style.overflow = '';
  updateOnScroll();
  initReveals();
  initMobileMenu();
  initSkipLink();
};

document.addEventListener('astro:page-load', init);

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll, { passive: true });

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  // Astro's page-load event still fires for view transitions; this is the initial safety net.
  window.setTimeout(init, 0);
} else {
  document.addEventListener('DOMContentLoaded', init, { once: true });
}
