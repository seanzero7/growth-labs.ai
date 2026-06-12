/* Growth Labs AI — interactions */
(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Footer year ---- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Nav scroll state ---- */
  var nav = document.getElementById('nav');
  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 24);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- Mobile menu ---- */
  var toggle = document.querySelector('.nav__toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.querySelectorAll('.nav__links a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- Scroll reveals ---- */
  var revealEls = document.querySelectorAll('.reveal');
  if (prefersReduced || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  } else {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          revealIO.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { revealIO.observe(el); });
  }

  /* ---- Animated counters ---- */
  var counters = document.querySelectorAll('[data-count]');
  function formatCount(value, decimals) {
    return decimals
      ? value.toFixed(decimals)
      : Math.round(value).toLocaleString('en-US');
  }
  function runCounter(el) {
    var target = parseFloat(el.dataset.count);
    var decimals = parseInt(el.dataset.decimals || '0', 10);
    var duration = 1500;
    var startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      var p = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = formatCount(target * eased, decimals);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (prefersReduced || !('IntersectionObserver' in window)) {
    counters.forEach(function (el) {
      el.textContent = formatCount(parseFloat(el.dataset.count), parseInt(el.dataset.decimals || '0', 10));
    });
  } else {
    var countIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          runCounter(e.target);
          countIO.unobserve(e.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { countIO.observe(el); });
  }

  /* ---- Console sparkline draw ---- */
  var consoleEl = document.querySelector('.console');
  if (consoleEl && 'IntersectionObserver' in window) {
    var sparkIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          consoleEl.classList.add('drawn');
          sparkIO.disconnect();
        }
      });
    }, { threshold: 0.4 });
    sparkIO.observe(consoleEl);
  } else if (consoleEl) {
    consoleEl.classList.add('drawn');
  }

  /* ---- Terminal replay loop ---- */
  var term = document.querySelector('[data-terminal]');
  if (term) {
    var lines = term.querySelectorAll('.tline');
    if (prefersReduced || !('IntersectionObserver' in window)) {
      lines.forEach(function (l) { l.classList.add('on'); });
    } else {
      var started = false;
      var timer = null;
      var play = function () {
        lines.forEach(function (l) { l.classList.remove('on'); });
        var i = 0;
        var next = function () {
          if (i >= lines.length) {
            timer = setTimeout(play, 3400);
            return;
          }
          lines[i++].classList.add('on');
          timer = setTimeout(next, 430);
        };
        timer = setTimeout(next, 350);
      };
      var termIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && !started) {
            started = true;
            play();
          }
        });
      }, { threshold: 0.35 });
      termIO.observe(term);
    }
  }

  /* ---- Active nav link ---- */
  if ('IntersectionObserver' in window) {
    var linkMap = {};
    document.querySelectorAll('.nav__links a[href^="#"]:not(.btn)').forEach(function (a) {
      linkMap[a.getAttribute('href').slice(1)] = a;
    });
    var clearCurrent = function () {
      Object.keys(linkMap).forEach(function (k) {
        linkMap[k].removeAttribute('aria-current');
      });
    };
    var activeIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var link = linkMap[e.target.id];
        if (link && e.isIntersecting) {
          clearCurrent();
          link.setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (s) {
      activeIO.observe(s);
    });
  }

  /* ---- Hero network canvas ---- */
  var canvas = document.getElementById('network');
  if (canvas && !prefersReduced && canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var hero = canvas.parentElement;
    var width = 0;
    var height = 0;
    var nodes = [];
    var rafId = null;
    var running = false;
    var heroVisible = true;
    var LINK_DIST = 150;
    var COLORS = ['rgba(96,165,250,', 'rgba(167,139,250,', 'rgba(56,189,248,'];

    function build() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = hero.clientWidth;
      height = hero.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.min(75, Math.floor((width * height) / 24000));
      nodes = [];
      for (var i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 1.6 + 0.8,
          c: COLORS[Math.floor(Math.random() * COLORS.length)]
        });
      }
    }

    function tick() {
      ctx.clearRect(0, 0, width, height);
      var i, j, a, b, dx, dy, d2, alpha;
      for (i = 0; i < nodes.length; i++) {
        a = nodes[i];
        a.x += a.vx;
        a.y += a.vy;
        if (a.x < -20) a.x = width + 20;
        else if (a.x > width + 20) a.x = -20;
        if (a.y < -20) a.y = height + 20;
        else if (a.y > height + 20) a.y = -20;
      }
      ctx.lineWidth = 1;
      for (i = 0; i < nodes.length; i++) {
        for (j = i + 1; j < nodes.length; j++) {
          a = nodes[i];
          b = nodes[j];
          dx = a.x - b.x;
          dy = a.y - b.y;
          d2 = dx * dx + dy * dy;
          if (d2 < LINK_DIST * LINK_DIST) {
            alpha = (1 - Math.sqrt(d2) / LINK_DIST) * 0.28;
            ctx.strokeStyle = 'rgba(122,150,255,' + alpha.toFixed(3) + ')';
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (i = 0; i < nodes.length; i++) {
        a = nodes[i];
        ctx.fillStyle = a.c + '0.8)';
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fill();
      }
      rafId = requestAnimationFrame(tick);
    }

    function start() {
      if (!running) {
        running = true;
        rafId = requestAnimationFrame(tick);
      }
    }
    function stop() {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
    }

    build();
    start();

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(build, 150);
    }, { passive: true });

    if ('IntersectionObserver' in window) {
      var heroIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          heroVisible = e.isIntersecting;
          if (heroVisible && !document.hidden) start();
          else stop();
        });
      }, { threshold: 0.02 });
      heroIO.observe(hero);
    }

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop();
      else if (heroVisible) start();
    });
  }
})();
