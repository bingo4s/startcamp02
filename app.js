document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.className = 'particle-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.prepend(canvas);

    let particles = [];
    const resizeParticles = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * pixelRatio;
      canvas.height = window.innerHeight * pixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      const count = window.innerWidth < 768 ? 28 : 55;
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 1.4 + 0.6,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18
      }));
    };

    const animateParticles = () => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      context.fillStyle = document.documentElement.classList.contains('dark')
        ? 'rgba(148, 163, 184, 0.24)'
        : 'rgba(37, 99, 235, 0.13)';
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.x < -4) particle.x = window.innerWidth + 4;
        if (particle.x > window.innerWidth + 4) particle.x = -4;
        if (particle.y < -4) particle.y = window.innerHeight + 4;
        if (particle.y > window.innerHeight + 4) particle.y = -4;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();
      });
      window.requestAnimationFrame(animateParticles);
    };

    resizeParticles();
    window.addEventListener('resize', resizeParticles);
    animateParticles();
  }

  const menuButton = document.querySelector('[data-menu-button]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  const brandLink = document.querySelector('nav a[href="index.html"]');
  if (brandLink) brandLink.innerHTML = '<span class="text-primary">I AM</span>.';
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const desktopMenu = document.querySelector('nav .hidden.md\\:flex');
  const mobileMenuLinks = mobileMenu?.firstElementChild;

  if (desktopMenu && !desktopMenu.querySelector('[href="guestbook.html"]')) {
    const guestbookLink = document.createElement('a');
    guestbookLink.href = 'guestbook.html';
    guestbookLink.textContent = '방명록';
    guestbookLink.className = currentPage === 'guestbook.html'
      ? 'border-b-2 border-primary py-2 text-sm font-bold text-primary'
      : 'py-2 text-sm font-bold text-slate-600 transition hover:text-primary';
    if (currentPage === 'guestbook.html') guestbookLink.setAttribute('aria-current', 'page');
    desktopMenu.append(guestbookLink);
  }

  if (mobileMenuLinks && !mobileMenuLinks.querySelector('[href="guestbook.html"]')) {
    const guestbookLink = document.createElement('a');
    guestbookLink.href = 'guestbook.html';
    guestbookLink.textContent = '방명록';
    guestbookLink.className = currentPage === 'guestbook.html' ? 'font-bold text-primary' : 'font-semibold';
    if (currentPage === 'guestbook.html') guestbookLink.setAttribute('aria-current', 'page');
    mobileMenuLinks.append(guestbookLink);
  }

  menuButton?.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    mobileMenu.classList.toggle('hidden', isOpen);
  });

  const themeButton = document.querySelector('[data-theme-toggle]');
  const themeLabel = document.querySelector('[data-theme-label]');
  const root = document.documentElement;

  const setTheme = (theme) => {
    const isDark = theme === 'dark';
    root.classList.toggle('dark', isDark);
    themeButton?.setAttribute('aria-pressed', String(isDark));
    if (themeLabel) themeLabel.textContent = isDark ? '라이트 모드' : '다크 모드';
  };

  const savedTheme = localStorage.getItem('portfolio-theme');
  const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  setTheme(savedTheme || preferredTheme);

  themeButton?.addEventListener('click', () => {
    const nextTheme = root.classList.contains('dark') ? 'light' : 'dark';
    localStorage.setItem('portfolio-theme', nextTheme);
    setTheme(nextTheme);
  });

  const guestbookForm = document.querySelector('[data-guestbook-form]');
  const guestbookList = document.querySelector('[data-guestbook-list]');
  const guestbookStatus = document.querySelector('[data-guestbook-status]');
  const guestbookKey = 'portfolio-guestbook';

  if (guestbookForm && guestbookList) {
    const loadEntries = () => {
      try {
        const saved = JSON.parse(localStorage.getItem(guestbookKey) || '[]');
        return Array.isArray(saved) ? saved : [];
      } catch {
        return [];
      }
    };

    const saveEntries = (entries) => {
      try {
        localStorage.setItem(guestbookKey, JSON.stringify(entries));
        return true;
      } catch {
        guestbookStatus.textContent = '브라우저 저장 공간을 사용할 수 없습니다.';
        return false;
      }
    };

    const renderEntries = () => {
      const entries = loadEntries();
      guestbookList.replaceChildren();
      if (!entries.length) {
        const empty = document.createElement('p');
        empty.className = 'rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500 dark:bg-slate-900';
        empty.textContent = '첫 번째 메시지를 남겨보세요!';
        guestbookList.append(empty);
        return;
      }

      entries.slice().reverse().forEach((entry) => {
        const item = document.createElement('article');
        item.className = 'rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:bg-slate-900';
        const header = document.createElement('div');
        header.className = 'mb-2 flex items-center justify-between gap-4';
        const author = document.createElement('strong');
        author.className = 'text-primary';
        author.textContent = entry.name;
        const removeButton = document.createElement('button');
        removeButton.type = 'button';
        removeButton.dataset.removeEntry = entry.id;
        removeButton.className = 'text-xs font-bold text-slate-500 hover:text-red-500';
        removeButton.textContent = '삭제';
        removeButton.setAttribute('aria-label', `${entry.name}님의 메시지 삭제`);
        const message = document.createElement('p');
        message.className = 'whitespace-pre-wrap break-words leading-7 text-slate-600';
        message.textContent = entry.message;
        const date = document.createElement('time');
        date.className = 'mt-3 block text-xs text-slate-500';
        date.dateTime = entry.createdAt;
        date.textContent = new Date(entry.createdAt).toLocaleString('ko-KR', { dateStyle: 'medium', timeStyle: 'short' });
        header.append(author, removeButton);
        item.append(header, message, date);
        guestbookList.append(item);
      });
    };

    guestbookForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(guestbookForm);
      const name = String(formData.get('name') || '').trim();
      const message = String(formData.get('message') || '').trim();
      if (!name || !message) return;
      const entries = loadEntries();
      entries.push({
        id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`,
        name,
        message,
        createdAt: new Date().toISOString()
      });
      if (saveEntries(entries.slice(-30))) {
        guestbookForm.reset();
        guestbookStatus.textContent = '메시지가 저장되었습니다.';
        renderEntries();
      }
    });

    guestbookList.addEventListener('click', (event) => {
      const button = event.target.closest('[data-remove-entry]');
      if (!button) return;
      const entries = loadEntries().filter((entry) => entry.id !== button.dataset.removeEntry);
      if (saveEntries(entries)) {
        guestbookStatus.textContent = '메시지가 삭제되었습니다.';
        renderEntries();
      }
    });

    renderEntries();
  }

  const supportsCustomCursor = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (supportsCustomCursor) {
    const dot = document.createElement('div');
    const ring = document.createElement('div');
    dot.className = 'cursor-dot';
    ring.className = 'cursor-ring';
    dot.setAttribute('aria-hidden', 'true');
    ring.setAttribute('aria-hidden', 'true');
    document.body.append(dot, ring);

    window.addEventListener('mousemove', ({ clientX, clientY }) => {
      dot.style.left = `${clientX}px`;
      dot.style.top = `${clientY}px`;
      ring.animate(
        { left: `${clientX}px`, top: `${clientY}px` },
        { duration: 140, fill: 'forwards' }
      );
      dot.classList.add('cursor-visible');
      ring.classList.add('cursor-visible');
    });

    document.addEventListener('mouseover', (event) => {
      ring.classList.toggle('cursor-active', Boolean(event.target.closest('a, button')));
    });

    document.documentElement.addEventListener('mouseleave', () => {
      dot.classList.remove('cursor-visible');
      ring.classList.remove('cursor-visible');
    });
  }
});
