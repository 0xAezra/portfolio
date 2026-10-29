const year = document.querySelector("#current-year");
if (year) {
    year.textContent = new Date().getFullYear();
}

const backToTop = document.querySelector(".back-to-top");
if (backToTop instanceof HTMLAnchorElement) {
    const updateBackToTopVisibility = () => {
        backToTop.classList.toggle("is-visible", window.scrollY > 300);
    };

    updateBackToTopVisibility();
    window.addEventListener("scroll", updateBackToTopVisibility, { passive: true });
}

const contactDialog = document.querySelector("#contact-dialog");
if (contactDialog instanceof HTMLDialogElement) {
    document.querySelectorAll(".contact-trigger").forEach((trigger) => {
        trigger.addEventListener("click", () => contactDialog.showModal());
    });

    contactDialog.querySelector("[data-close-dialog]")?.addEventListener("click", () => {
        contactDialog.close();
    });

    contactDialog.addEventListener("click", (event) => {
        if (event.target === contactDialog) {
            contactDialog.close();
        }
    });
}

document.querySelectorAll(".image-slideshow").forEach((slideshow) => {
    const track = slideshow.querySelector(".slideshow-track");
    const status = slideshow.parentElement?.querySelector(".slideshow-status");
    const previousButton = slideshow.querySelector(".slideshow-button.previous");
    const nextButton = slideshow.querySelector(".slideshow-button.next");

    if (!track || !status || !previousButton || !nextButton) {
        return;
    }

    const slides = Array.from(track.querySelectorAll("img"));
    let activeSlide = 0;
    let autoplayTimer;
    let isHovered = false;
    let isFocused = false;
    let isInView = true;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (slides.length < 2) {
        previousButton.hidden = true;
        nextButton.hidden = true;
        status.hidden = true;
        return;
    }

    function showSlide(index) {
        activeSlide = (index + slides.length) % slides.length;
        track.style.transform = `translateX(-${activeSlide * 100}%)`;
        status.textContent = `${String(activeSlide + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
    }

    function stopAutoplay() {
        window.clearInterval(autoplayTimer);
        autoplayTimer = undefined;
    }

    function startAutoplay() {
        stopAutoplay();
        if (document.hidden || !isInView || isHovered || isFocused || reducedMotion.matches) {
            return;
        }

        autoplayTimer = window.setInterval(() => showSlide(activeSlide + 1), 5000);
    }

    function changeSlide(index) {
        showSlide(index);
        startAutoplay();
    }

    previousButton.addEventListener("click", () => changeSlide(activeSlide - 1));
    nextButton.addEventListener("click", () => changeSlide(activeSlide + 1));
    slideshow.addEventListener("pointerenter", () => {
        isHovered = true;
        stopAutoplay();
    });
    slideshow.addEventListener("pointerleave", () => {
        isHovered = false;
        startAutoplay();
    });
    slideshow.addEventListener("focusin", () => {
        isFocused = true;
        stopAutoplay();
    });
    slideshow.addEventListener("focusout", (event) => {
        if (!slideshow.contains(event.relatedTarget)) {
            isFocused = false;
            startAutoplay();
        }
    });
    document.addEventListener("visibilitychange", startAutoplay);
    reducedMotion.addEventListener("change", startAutoplay);

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(([entry]) => {
            isInView = entry.isIntersecting;
            startAutoplay();
        }, { threshold: 0.2 });
        observer.observe(slideshow);
    }

    showSlide(activeSlide);
    startAutoplay();
});