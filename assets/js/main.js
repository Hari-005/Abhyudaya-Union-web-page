const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = new Date().getFullYear();
});

const contactForm = document.querySelector("[data-contact-form]");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = contactForm.querySelector("[data-form-status]");
    if (status) {
      status.textContent = "Request noted. The union desk will follow up soon.";
    }
    contactForm.reset();
  });
}

const reportSlider = document.querySelector("[data-report-slider]");

if (reportSlider) {
  const track = reportSlider.querySelector("[data-report-track]");
  const slides = Array.from(reportSlider.querySelectorAll(".report-slide"));
  const previousButton = reportSlider.querySelector("[data-report-prev]");
  const nextButton = reportSlider.querySelector("[data-report-next]");
  const current = reportSlider.querySelector("[data-report-current]");
  const total = reportSlider.querySelector("[data-report-total]");
  const dots = Array.from(reportSlider.querySelectorAll("[data-report-dot]"));
  let activeIndex = 0;
  let scrollTimer;
  let programmaticScroll = false;
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartIndex = 0;
  const swipeThreshold = 44;
  const wheelThreshold = 18;

  const normalizeIndex = (index) => (index + slides.length) % slides.length;

  const updateIndicators = () => {
    if (current) {
      current.textContent = String(activeIndex + 1);
    }

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === activeIndex);
    });
  };

  const updateSlider = (index) => {
    if (!track || !slides.length) {
      return;
    }

    activeIndex = normalizeIndex(index);
    programmaticScroll = true;
    track.scrollLeft = activeIndex * track.clientWidth;
    updateIndicators();

    window.setTimeout(() => {
      programmaticScroll = false;
    }, 120);
  };

  if (total) {
    total.textContent = String(slides.length);
  }

  previousButton?.addEventListener("click", () => updateSlider(activeIndex - 1));
  nextButton?.addEventListener("click", () => updateSlider(activeIndex + 1));

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      updateSlider(Number(dot.dataset.reportDot || 0));
    });
  });

  track?.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      updateSlider(activeIndex + 1);
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      updateSlider(activeIndex - 1);
    }

    if (event.key === "Home") {
      event.preventDefault();
      updateSlider(0);
    }

    if (event.key === "End") {
      event.preventDefault();
      updateSlider(slides.length - 1);
    }
  });

  track?.addEventListener(
    "wheel",
    (event) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY) || Math.abs(event.deltaX) < wheelThreshold) {
        return;
      }

      if (activeIndex === slides.length - 1 && event.deltaX > 0) {
        event.preventDefault();
        updateSlider(0);
      }

      if (activeIndex === 0 && event.deltaX < 0) {
        event.preventDefault();
        updateSlider(slides.length - 1);
      }
    },
    { passive: false }
  );

  track?.addEventListener(
    "touchstart",
    (event) => {
      const touch = event.changedTouches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      touchStartIndex = activeIndex;
    },
    { passive: true }
  );

  track?.addEventListener(
    "touchend",
    (event) => {
      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - touchStartX;
      const deltaY = touch.clientY - touchStartY;
      const isHorizontalSwipe =
        Math.abs(deltaX) > swipeThreshold && Math.abs(deltaX) > Math.abs(deltaY) * 1.2;

      if (isHorizontalSwipe) {
        updateSlider(touchStartIndex + (deltaX < 0 ? 1 : -1));
      }
    },
    { passive: true }
  );

  track?.addEventListener("scroll", () => {
    if (programmaticScroll) {
      return;
    }

    window.clearTimeout(scrollTimer);
    scrollTimer = window.setTimeout(() => {
      const nextIndex = Math.round(track.scrollLeft / track.clientWidth);
      if (nextIndex !== activeIndex && nextIndex >= 0 && nextIndex < slides.length) {
        activeIndex = nextIndex;
        updateIndicators();
      }
    }, 80);
  });

  updateIndicators();
}
