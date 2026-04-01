(function ()
{
  'use strict';

  function ready(fn)
  {
    if (document.readyState !== 'loading') { fn(); }
    else { document.addEventListener('DOMContentLoaded', fn); }
  }

  /* 1. STICKY NAV */
  function initStickyNav()
  {
    var nav = document.querySelector('.pm-nav');
    if (!nav) return;
    function onScroll()
    {
      nav.classList.toggle('is-scrolled', window.scrollY > 80);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* 2. MEGA MENU */
  function initMegaMenu()
  {
    var navItems = document.querySelectorAll('.pm-nav-item.has-mega');
    if (!navItems.length) return;
    var openItem = null;
    var closeTimer = null;

    function openMenu(item)
    {
      if (closeTimer) clearTimeout(closeTimer);
      if (openItem && openItem !== item) openItem.classList.remove('is-open');
      item.classList.add('is-open');
      openItem = item;
      var trigger = item.querySelector('.pm-nav-trigger');
      if (trigger) trigger.setAttribute('aria-expanded', 'true');
    }

    function closeMenu(item, delay)
    {
      closeTimer = setTimeout(function ()
      {
        item.classList.remove('is-open');
        if (openItem === item) openItem = null;
        var trigger = item.querySelector('.pm-nav-trigger');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      }, delay || 0);
    }

    navItems.forEach(function (item)
    {
      var trigger = item.querySelector('.pm-nav-trigger');
      item.addEventListener('mouseenter', function () { openMenu(item); });
      item.addEventListener('mouseleave', function () { closeMenu(item, 200); });
      if (trigger)
      {
        trigger.setAttribute('aria-expanded', 'false');
        trigger.setAttribute('aria-haspopup', 'true');
        trigger.addEventListener('click', function (e)
        {
          e.preventDefault();
          item.classList.contains('is-open') ? closeMenu(item, 0) : openMenu(item);
        });
      }
    });

    document.addEventListener('keydown', function (e)
    {
      if (e.key === 'Escape' && openItem)
      {
        var trigger = openItem.querySelector('.pm-nav-trigger');
        closeMenu(openItem, 0);
        if (trigger) trigger.focus();
      }
    });
    document.addEventListener('click', function (e)
    {
      if (openItem && !openItem.contains(e.target)) closeMenu(openItem, 0);
    });
  }

  /* 3. MOBILNÍ MENU */
  function initMobileMenu()
  {
    var burger  = document.querySelector('.pm-nav-burger');
    var panel   = document.querySelector('.pm-nav-mobile');
    var overlay = document.querySelector('.pm-nav-overlay');
    var close   = document.querySelector('.pm-mobile-close');
    if (!burger || !panel) return;

    function openPanel()
    {
      panel.classList.add('is-open');
      if (overlay) overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Zavřít menu');
    }
    function closePanel()
    {
      panel.classList.remove('is-open');
      if (overlay) overlay.classList.remove('is-open');
      document.body.style.overflow = '';
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Otevřít menu');
    }

    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Otevřít menu');
    burger.addEventListener('click', function ()
    {
      panel.classList.contains('is-open') ? closePanel() : openPanel();
    });
    if (close)   close.addEventListener('click', closePanel);
    if (overlay) overlay.addEventListener('click', closePanel);
    document.addEventListener('keydown', function (e)
    {
      if (e.key === 'Escape' && panel.classList.contains('is-open'))
      {
        closePanel();
        burger.focus();
      }
    });
  }

  /* 4. MOBILNÍ ACCORDION */
  function initMobileAccordion()
  {
    var accordions = document.querySelectorAll('.pm-mobile-accordion');
    if (!accordions.length) return;
    accordions.forEach(function (acc)
    {
      var trigger = acc.querySelector('.pm-mobile-accordion-trigger');
      var content = acc.querySelector('.pm-mobile-sub');
      if (!trigger || !content) return;
      trigger.setAttribute('aria-expanded', 'false');
      trigger.addEventListener('click', function ()
      {
        var isOpen = acc.classList.contains('is-open');
        accordions.forEach(function (other)
        {
          other.classList.remove('is-open');
          var ot = other.querySelector('.pm-mobile-accordion-trigger');
          var oc = other.querySelector('.pm-mobile-sub');
          if (ot) ot.setAttribute('aria-expanded', 'false');
          if (oc) oc.style.maxHeight = null;
        });
        if (!isOpen)
        {
          acc.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    });
  }

  /* 5. ACCORDION (FAQ) */
  function initAccordion()
  {
    var items = document.querySelectorAll('.pm-accordion-item');
    if (!items.length) return;
    items.forEach(function (item)
    {
      var header  = item.querySelector('.pm-accordion-header');
      var content = item.querySelector('.pm-accordion-content');
      if (!header || !content) return;
      header.setAttribute('aria-expanded', 'false');
      header.setAttribute('role', 'button');
      header.setAttribute('tabindex', '0');

      function toggle()
      {
        var isOpen = item.classList.contains('is-open');
        var list = item.closest('.pm-accordion-list');
        if (list)
        {
          list.querySelectorAll('.pm-accordion-item.is-open').forEach(function (o)
          {
            if (o !== item)
            {
              o.classList.remove('is-open');
              var oh = o.querySelector('.pm-accordion-header');
              if (oh) oh.setAttribute('aria-expanded', 'false');
            }
          });
        }
        item.classList.toggle('is-open', !isOpen);
        header.setAttribute('aria-expanded', String(!isOpen));
      }

      header.addEventListener('click', toggle);
      header.addEventListener('keydown', function (e)
      {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
      });
    });

    document.querySelectorAll('.pm-accordion-nav-item').forEach(function (navItem)
    {
      navItem.addEventListener('click', function ()
      {
        document.querySelectorAll('.pm-accordion-nav-item').forEach(function (ni) { ni.classList.remove('is-active'); });
        navItem.classList.add('is-active');
      });
    });
  }

  /* 6. SLIDER */
  function initSlider()
  {
    var sliders = document.querySelectorAll('.pm-slider-viewport');
    if (!sliders.length) return;
    sliders.forEach(function (viewport)
    {
      var track   = viewport.querySelector('.pm-slider-track');
      var section = viewport.closest('.pm-slider-section') || viewport.parentElement;
      var prevBtn = section.querySelector('.pm-slider-arrow.is-prev');
      var nextBtn = section.querySelector('.pm-slider-arrow.is-next');
      var dots    = section.querySelectorAll('.pm-slider-dot');
      if (!track) return;

      var currentIndex = 0;
      var cards = track.querySelectorAll('.pm-card-testimonial');
      var total = cards.length;

      function getVisible() { return window.innerWidth <= 767 ? 1 : window.innerWidth <= 991 ? 2 : 3; }
      function getMax()     { return Math.max(, total - getVisible()); }

      function goTo(index)
      {
        currentIndex = Math.max(0, Math.min(index, getMax()));
        var w = cards[0] ? cards[0].offsetWidth : 0;
        track.style.transform = 'translateX(-' + (currentIndex * (w + 24)) + 'px)';
        if (prevBtn) prevBtn.disabled = currentIndex === 0;
        if (nextBtn) nextBtn.disabled = currentIndex >= getMax();
        dots.forEach(function (d, i) { d.classList.toggle('is-active', i === currentIndex); });
      }

      if (prevBtn) prevBtn.addEventListener('click', function () { goTo(currentIndex - 1); });
      if (nextBtn) nextBtn.addEventListener('click', function () { goTo(currentIndex + 1); });
      dots.forEach(function (d, i) { d.addEventListener('click', function () { goTo(i); }); });

      var startX = 0;
      track.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
      track.addEventListener('touchend', function (e)
      {
        var diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) goTo(diff > 0 ? currentIndex + 1 : currentIndex - 1);
      }, { passive: true });
      window.addEventListener('resize', function () { goTo(0); }, { passive: true });
      goTo(0);
    });
  }

  /* 7. PROGRESS BAR */
  function initProgressBar()
  {
    var wrapper = document.querySelector('.pm-progress-wrapper');
    if (!wrapper) return;
    var steps      = wrapper.querySelectorAll('.pm-progress-step');
    var lines      = wrapper.querySelectorAll('.pm-progress-line');
    var nextBtns   = document.querySelectorAll('[data-pm-next]');
    var prevBtns   = document.querySelectorAll('[data-pm-prev]');
    var panels     = document.querySelectorAll('[data-pm-panel]');
    var counter    = wrapper.querySelector('.pm-progress-mobile-counter');
    var total      = steps.length;
    var current    = 0;

    function updateStep(n)
    {
      current = Math.max(0, Math.min(n, total - 1));
      steps.forEach(function (s, i)
      {
        s.classList.remove('is-active', 'is-done');
        if (i < current)   s.classList.add('is-done');
        if (i === current) s.classList.add('is-active');
      });
      lines.forEach(function (l, i) { l.classList.toggle('is-filled', i < current); });
      panels.forEach(function (p, i) { p.style.display = i === current ? '' : 'none'; });
      if (counter)
      {
        var lbl = steps[current] ? (steps[current].querySelector('.pm-progress-label') || {}).textContent || '' : '';
        counter.textContent = 'Krok ' + (current + 1) + ' ze ' + total + (lbl ? ' — ' + lbl : '');
      }
      prevBtns.forEach(function (b) { b.disabled = current === 0; });
      nextBtns.forEach(function (b) { b.disabled = current === total - 1; });
    }

    nextBtns.forEach(function (b) { b.addEventListener('click', function () { updateStep(current + 1); }); });
    prevBtns.forEach(function (b) { b.addEventListener('click', function () { updateStep(current - 1); }); });
    updateStep(0);
  }

  /* 8. GALERIE */
  function initGallery()
  {
    var galleries = document.querySelectorAll('.pm-gallery-main');
    if (!galleries.length) return;
    galleries.forEach(function (main)
    {
      var section = main.closest('.pm-detail-layout') || main.parentElement;
      var thumbs  = section.querySelectorAll('.pm-gallery-thumb');
      var mainImg = main.querySelector('img');
      if (!thumbs.length || !mainImg) return;
      thumbs.forEach(function (thumb)
      {
        thumb.addEventListener('click', function ()
        {
          var img = thumb.querySelector('img');
          if (img) { mainImg.src = img.src; mainImg.alt = img.alt; }
          thumbs.forEach(function (t) { t.classList.remove('is-active'); });
          thumb.classList.add('is-active');
        });
      });
      if (thumbs[0]) thumbs[0].classList.add('is-active');
    });
  }

  /* 9. PILL FILTRY */
  function initPillFilters()
  {
    var filterGroups = document.querySelectorAll('.pm-filter-group');
    if (!filterGroups.length) return;
    filterGroups.forEach(function (group)
    {
      var filters = group.querySelectorAll('.pm-pill-filter');
      var cards   = document.querySelectorAll('.pm-card-product');
      filters.forEach(function (filter)
      {
        filter.addEventListener('click', function ()
        {
          filters.forEach(function (f) { f.classList.remove('is-active'); });
          filter.classList.add('is-active');
          var cat = filter.getAttribute('data-filter');
          cards.forEach(function (card)
          {
            card.style.display = (!cat || cat === 'all' || card.getAttribute('data-category') === cat) ? '' : 'none';
          });
        });
      });
    });
  }

  /* 10. STICKY CTA BAR */
  function initStickyCTABar()
  {
    var bar = document.querySelector('.pm-sticky-bar');
    if (!bar) return;
    var visible = false;
    function onScroll()
    {
      var show = window.scrollY > 200 && window.innerWidth <= 991;
      if (show && !visible)  { bar.style.display = 'flex'; visible = true; }
      if (!show && visible)  { bar.style.display = 'none'; visible = false; }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
  }

  /* 11. SCROLL ANIMACE */
  function initScrollAnimations()
  {
    var style = document.createElement('style');
    style.textContent =
      '.pm-fade-up{opacity:0;transform:translateY(24px);transition:opacity 500ms ease,transform 500ms ease}' +
      '.pm-fade-up.is-visible{opacity:1;transform:translateY(0)}' +
      '.pm-stagger>*{opacity:0;transform:translateY(20px);transition:opacity 400ms ease,transform 400ms ease}' +
      '.pm-stagger.is-visible>*{opacity:1;transform:translateY(0)}';
    document.head.appendChild(style);

    document.querySelectorAll('.pm-stagger').forEach(function (el)
    {
      Array.from(el.children).forEach(function (child, i)
      {
        child.style.transitionDelay = (i * 80) + 'ms';
      });
    });

    if (!('IntersectionObserver' in window)) return;
    var observer = new IntersectionObserver(function (entries)
    {
      entries.forEach(function (entry)
      {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.pm-fade-up, .pm-stagger').forEach(function (el) { observer.observe(el); });
  }

  /* 12. TABS */
  function initTabs()
  {
    var tabNavs = document.querySelectorAll('.pm-tab-nav');
    if (!tabNavs.length) return;
    tabNavs.forEach(function (nav)
    {
      var tabs   = nav.querySelectorAll('.pm-tab-item');
      var section = nav.closest('section') || nav.parentElement;
      var panels = section.querySelectorAll('.pm-tab-panel');

      tabs.forEach(function (tab, i)
      {
        tab.setAttribute('role', 'tab');
        tab.setAttribute('tabindex', i === 0 ? '0' : '-1');
        tab.addEventListener('click', function ()
        {
          tabs.forEach(function (t) { t.classList.remove('is-active'); t.setAttribute('tabindex', '-1'); });
          tab.classList.add('is-active');
          tab.setAttribute('tabindex', '0');
          panels.forEach(function (p, j) { p.style.display = j === i ? '' : 'none'; });
        });
        tab.addEventListener('keydown', function (e)
        {
          var idx = Array.from(tabs).indexOf(tab);
          if (e.key === 'ArrowRight' && idx < tabs.length - 1) { tabs[idx + 1].click(); tabs[idx + 1].focus(); }
          if (e.key === 'ArrowLeft'  && idx > 0)               { tabs[idx - 1].click(); tabs[idx - 1].focus(); }
        });
      });

      panels.forEach(function (p, i) { p.style.display = i === 0 ? '' : 'none'; });
      if (tabs[0]) tabs[0].classList.add('is-active');
    });
  }

  /* 13. VALIDACE FORMULÁŘE */
  function initFormValidation()
  {
    var forms = document.querySelectorAll('.pm-form');
    if (!forms.length) return;

    function clearError(input)
    {
      input.classList.remove('is-error', 'is-success');
      var msg = input.parentElement.querySelector('.pm-form-message--error');
      if (msg) msg.remove();
    }

    function showError(input, message)
    {
      input.classList.add('is-error');
      input.classList.remove('is-success');
      if (!input.parentElement.querySelector('.pm-form-message--error'))
      {
        var msg = document.createElement('div');
        msg.className = 'pm-form-message pm-form-message--error';
        msg.textContent = message;
        input.parentElement.appendChild(msg);
      }
    }

    function validateField(input)
    {
      var value    = input.value.trim();
      var required = input.hasAttribute('required');
      var type     = input.getAttribute('type') || 'text';
      clearError(input);
      if (required && !value)                                              { showError(input, 'Toto pole je povinné.'); return false; }
      if (type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) { showError(input, 'Zadejte platnou e-mailovou adresu.'); return false; }
      if (type === 'tel'   && value && !/^[+\d\s\-()]{9,}$/.test(value))  { showError(input, 'Zadejte platné telefonní číslo.'); return false; }
      if (value) input.classList.add('is-success');
      return true;
    }

    forms.forEach(function (form)
    {
      var inputs = form.querySelectorAll('.pm-form-input, .pm-form-textarea, .pm-form-select');
      inputs.forEach(function (input)
      {
        input.addEventListener('blur',  function () { validateField(input); });
        input.addEventListener('input', function () { if (input.classList.contains('is-error')) clearError(input); });
      });
      form.addEventListener('submit', function (e)
      {
        var valid = true;
        inputs.forEach(function (input) { if (!validateField(input)) valid = false; });
        if (!valid)
        {
          e.preventDefault();
          var first = form.querySelector('.is-error');
          if (first) { first.scrollIntoView({ behavior: 'smooth', block: 'center' }); first.focus(); }
        }
      });
    });
  }

  /* INICIALIZACE */
  ready(function ()
  {
    initStickyNav();
    initMegaMenu();
    initMobileMenu();
    initMobileAccordion();
    initAccordion();
    initSlider();
    initProgressBar();
    initGallery();
    initPillFilters();
    initStickyCTABar();
    initScrollAnimations();
    initTabs();
    initFormValidation();
  });

})();
