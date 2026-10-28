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
    const status = slideshow.querySelector(".slideshow-status");
    const previousButton = slideshow.querySelector(".slideshow-button.previous");
    const nextButton = slideshow.querySelector(".slideshow-button.next");

    if (!track || !status || !previousButton || !nextButton) {
        return;
    }

    const slides = Array.from(track.querySelectorAll("img"));
    let activeSlide = 0;

    if (slides.length < 2) {
        previousButton.hidden = true;
        nextButton.hidden = true;
        return;
    }

    function showSlide(index) {
        activeSlide = (index + slides.length) % slides.length;
        track.style.transform = `translateX(-${activeSlide * 100}%)`;
        status.textContent = `${activeSlide + 1} / ${slides.length}`;
    }

    previousButton.addEventListener("click", () => showSlide(activeSlide - 1));
    nextButton.addEventListener("click", () => showSlide(activeSlide + 1));
});