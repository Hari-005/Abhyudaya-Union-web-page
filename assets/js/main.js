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
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const status = contactForm.querySelector("[data-form-status]");
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const formData = new FormData(contactForm);

    if (status) {
      status.textContent = "Sending request...";
    }

    if (submitButton) {
      submitButton.disabled = true;
    }

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Formspree request failed");
      }

      if (status) {
        status.textContent = "Request sent. The union desk will follow up soon.";
      }

      contactForm.reset();
    } catch (error) {
      if (status) {
        status.textContent = "Could not send the request. Please try again or contact the union desk directly.";
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  });
}


const sanityProjectId = "k3nhbunt";
const sanityDataset = "production";
const sanityApiVersion = "2025-02-19";

const sanityQueryUrl = (query) =>
  `https://${sanityProjectId}.api.sanity.io/v${sanityApiVersion}/data/query/${sanityDataset}?query=${encodeURIComponent(query)}`;

const getDateParts = (dateString) => {
  const [year, month, day] = String(dateString || "").split("-").map(Number);

  if (!year || !month || !day) {
    return null;
  }

  return { year, month, day };
};

const formatEventDate = (dateString) => {
  const parts = getDateParts(dateString);

  if (!parts) {
    return "Date to be announced";
  }

  const month = new Intl.DateTimeFormat("en", { month: "long" }).format(
    new Date(parts.year, parts.month - 1, parts.day)
  );
  const day = String(parts.day).padStart(2, "0");

  return `${day} ${month} ${parts.year}`;
};

const getDateCardParts = (dateString) => {
  const parts = getDateParts(dateString);

  if (!parts) {
    return { month: "TBA", day: "--" };
  }

  return {
    month: new Intl.DateTimeFormat("en", { month: "short" }).format(
      new Date(parts.year, parts.month - 1, parts.day)
    ),
    day: String(parts.day).padStart(2, "0"),
  };
};

const getEventTagClass = (category = "") => {
  const normalizedCategory = category.toLowerCase();

  if (normalizedCategory.includes("sport")) {
    return "tag-indigo";
  }

  if (normalizedCategory.includes("academic") || normalizedCategory.includes("welfare")) {
    return "tag-emerald";
  }

  return "tag-saffron";
};

const createEventRow = (eventItem) => {
  const row = document.createElement("div");
  const dateParts = getDateCardParts(eventItem.date);
  const displayDate = formatEventDate(eventItem.date);
  const category = eventItem.category || "General";

  row.className = "event-row";

  const dateCard = document.createElement("div");
  dateCard.className = "date-card";
  dateCard.setAttribute("aria-label", displayDate);

  const month = document.createElement("span");
  month.textContent = dateParts.month;

  const day = document.createElement("strong");
  day.textContent = dateParts.day;

  const summary = document.createElement("small");
  summary.textContent = eventItem.summary || eventItem.title || "Union event";

  dateCard.append(month, day, summary);

  const eventCard = document.createElement("article");
  eventCard.className = "event-card";

  const eventCopy = document.createElement("div");
  const tag = document.createElement("span");
  tag.className = `tag ${getEventTagClass(category)}`;
  tag.textContent = category;

  const title = document.createElement("h2");
  title.textContent = eventItem.title || "Union Event";

  const description = document.createElement("p");
  description.textContent = eventItem.description || "Details will be updated soon.";

  eventCopy.append(tag, title, description);

  const details = document.createElement("dl");
  const appendDetail = (label, value) => {
    const wrapper = document.createElement("div");
    const term = document.createElement("dt");
    const detail = document.createElement("dd");

    term.textContent = label;
    detail.textContent = value;
    wrapper.append(term, detail);
    details.append(wrapper);
  };

  appendDetail("Date", displayDate);
  appendDetail("Venue", eventItem.venue || "Venue to be announced");
  appendDetail("Desk", eventItem.desk || "Union Desk");

  eventCard.append(eventCopy, details);
  row.append(dateCard, eventCard);

  return row;
};
const sanityEventsList = document.querySelector("[data-sanity-events]");

if (sanityEventsList) {
  const eventQuery = '*[_type == "event"] | order(coalesce(order, 999) asc, date asc){title, category, date, summary, description, venue, desk, order}';

  sanityEventsList.setAttribute("aria-busy", "true");

  fetch(sanityQueryUrl(eventQuery))
    .then((response) => {
      if (!response.ok) {
        throw new Error("Could not load Sanity events");
      }

      return response.json();
    })
    .then((data) => {
      const events = Array.isArray(data.result) ? data.result : [];

      if (!events.length) {
        return;
      }

      sanityEventsList.replaceChildren(...events.map(createEventRow));
    })
    .catch(() => {
      sanityEventsList.removeAttribute("aria-busy");
    })
    .finally(() => {
      sanityEventsList.removeAttribute("aria-busy");
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
