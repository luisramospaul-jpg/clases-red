/* =========================================================
   Script principal - Clases de Red IPv4
   Paleta: marrón carbón + dorado + beige
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* =====================================================
     1. ANIMACIÓN DE APARICIÓN AL HACER SCROLL
     ===================================================== */
  const elementosAnimados = document.querySelectorAll(
    '.portada-card, .info-card, .galeria-item, .cidr-card, .intro-card'
  );

  elementosAnimados.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
  );

  elementosAnimados.forEach((el) => observer.observe(el));


  /* =====================================================
     2. NAVBAR: CAMBIO DE ESTILO AL HACER SCROLL
     ===================================================== */
  const navbar = document.querySelector('.navbar-custom');

  if (navbar) {
    const manejarScrollNavbar = () => {
      if (window.scrollY > 40) {
        navbar.classList.add('navbar-scrolled');
      } else {
        navbar.classList.remove('navbar-scrolled');
      }
    };

    window.addEventListener('scroll', manejarScrollNavbar, { passive: true });
    manejarScrollNavbar();
  }


  /* =====================================================
     3. SMOOTH SCROLL PARA ENLACES INTERNOS (#)
     ===================================================== */
  document.querySelectorAll('a[href^="#"]').forEach((enlace) => {
    enlace.addEventListener('click', (e) => {
      const href = enlace.getAttribute('href');
      if (href === '#' || href.length < 2) return;

      const destino = document.querySelector(href);
      if (destino) {
        e.preventDefault();

        const navCollapse = document.querySelector('.navbar-collapse.show');
        if (navCollapse && window.bootstrap) {
          const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
          if (bsCollapse) bsCollapse.hide();
        }

        destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  /* =====================================================
     4. DETECCIÓN AUTOMÁTICA DE CONTRASTE EN TÍTULOS
     Aplica beige a títulos sobre fondo oscuro.
     ===================================================== */
  const COLOR_BEIGE = '#f2e8d5';
  const titulos = document.querySelectorAll('h1, h2, h3, h4');

  function luminosidad(r, g, b) {
    const [rl, gl, bl] = [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
  }

  function fondoEfectivo(el) {
    let actual = el;
    while (actual && actual !== document.documentElement) {
      const bg = getComputedStyle(actual).backgroundColor;
      if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
        const match = bg.match(/\d+/g);
        if (match && match.length >= 3) {
          return {
            r: parseInt(match[0], 10),
            g: parseInt(match[1], 10),
            b: parseInt(match[2], 10),
          };
        }
      }
      actual = actual.parentElement;
    }
    return { r: 245, g: 241, b: 236 };
  }

  titulos.forEach((titulo) => {
    const fondo = fondoEfectivo(titulo);
    const lum = luminosidad(fondo.r, fondo.g, fondo.b);

    if (lum < 0.5) {
      titulo.style.color = COLOR_BEIGE;
      titulo.style.textShadow = '0 2px 10px rgba(0, 0, 0, 0.35)';
    }
  });


  /* =====================================================
     5. PARALLAX SUAVE EN PORTADAS (solo desktop)
     ===================================================== */
  const esDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (esDesktop) {
    document.querySelectorAll('.portada-card').forEach((card) => {
      const img = card.querySelector('.portada-img img');
      if (!img) return;

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        img.style.transform = `scale(1.1) translate(${x * 8}px, ${y * 8}px)`;
      });

      card.addEventListener('mouseleave', () => {
        img.style.transform = '';
      });
    });
  }


  /* =====================================================
     6. TILT SUAVE EN GALERÍAS (solo desktop)
     ===================================================== */
  if (esDesktop) {
    document.querySelectorAll('.galeria-item').forEach((item) => {
      const img = item.querySelector('img');
      if (!img) return;

      item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        img.style.transform = `scale(1.08) translate(${x * 6}px, ${y * 6}px)`;
      });

      item.addEventListener('mouseleave', () => {
        img.style.transform = '';
      });
    });
  }


  /* =====================================================
     7. FEEDBACK VISUAL EN BOTONES
     ===================================================== */
  document.querySelectorAll('.btn-nav-clase, .btn-portada, .btn-gold, .btn-nav-outline').forEach((btn) => {
    btn.addEventListener('click', function () {
      this.style.transform = 'scale(0.96)';
      setTimeout(() => {
        this.style.transform = '';
      }, 150);
    });
  });


  /* =====================================================
     8. AÑO DINÁMICO EN FOOTER
     ===================================================== */
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }


  /* =====================================================
     9. FALLBACK DE IMÁGENES
     ===================================================== */
  document.querySelectorAll('img').forEach((img) => {
    img.addEventListener('error', function () {
      this.style.background = 'linear-gradient(135deg, #2e2521, #4a3b32)';
      this.style.objectFit = 'contain';
      this.alt = this.alt || 'Imagen no disponible';
    });
  });


  /* =====================================================
     10. RE-CALCULAR CONTRASTE AL REDIMENSIONAR
     ===================================================== */
  let timeoutResize;
  window.addEventListener('resize', () => {
    clearTimeout(timeoutResize);
    timeoutResize = setTimeout(() => {
      titulos.forEach((titulo) => {
        const fondo = fondoEfectivo(titulo);
        const lum = luminosidad(fondo.r, fondo.g, fondo.b);
        if (lum < 0.5) {
          titulo.style.color = COLOR_BEIGE;
          titulo.style.textShadow = '0 2px 10px rgba(0, 0, 0, 0.35)';
        } else {
          titulo.style.color = '';
          titulo.style.textShadow = '';
        }
      });
    }, 200);
  });

});