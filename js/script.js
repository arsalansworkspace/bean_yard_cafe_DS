
document.addEventListener("DOMContentLoaded", () => {

    
// =====================================
// BACK TO TOP BUTTON
// =====================================

const backToTopButton = document.getElementById("back-to-top");

if (backToTopButton) {

    function toggleBackToTop() {
        if (window.scrollY > 350) {
            backToTopButton.classList.add("is-visible");
        } else {
            backToTopButton.classList.remove("is-visible");
        }
    }

    window.addEventListener("scroll", toggleBackToTop, {
        passive: true
    });

    backToTopButton.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    toggleBackToTop();
}


    // =====================================
    // ELEMENTS
    // =====================================

    const menuButton = document.getElementById("mobile-menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");
    const header = document.getElementById("site-header");

    // =====================================
    // MOBILE NAVIGATION
    // =====================================

    if (menuButton && mobileMenu) {

        function openMenu() {

            mobileMenu.classList.add("is-open");
            menuButton.classList.add("is-open");

            menuButton.setAttribute("aria-expanded", "true");
            menuButton.setAttribute("aria-label", "Close navigation menu");

            mobileMenu.setAttribute("aria-hidden", "false");
            mobileMenu.inert = false;

        }

        function closeMenu() {

            mobileMenu.classList.remove("is-open");
            menuButton.classList.remove("is-open");

            menuButton.setAttribute("aria-expanded", "false");
            menuButton.setAttribute("aria-label", "Open navigation menu");

            mobileMenu.setAttribute("aria-hidden", "true");
            mobileMenu.inert = true;

        }

        // Hamburger button click

        menuButton.addEventListener("click", () => {

            const isOpen =
                menuButton.getAttribute("aria-expanded") === "true";

            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }

        });

        // Close after clicking a link

        mobileMenu.querySelectorAll(".mobile-nav-link").forEach(link => {

            link.addEventListener("click", closeMenu);

        });

        // Close using Escape

        document.addEventListener("keydown", event => {

            if (event.key === "Escape") {
                closeMenu();
            }

        });

        // Close when returning to desktop

        window.addEventListener("resize", () => {

            if (window.innerWidth > 850) {
                closeMenu();
            }

        });

        console.log("BEAN YARD mobile navigation ready.");

    } else {

        console.error("Mobile navigation elements are missing.");

    }


    // =====================================
    // NAVBAR SCROLL EFFECT
    // =====================================

    if (header) {

        function updateHeader() {

            if (window.scrollY > 30) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }

        }

        window.addEventListener("scroll", updateHeader, {
            passive: true
        });

        updateHeader();

    }


// =====================================
// BEAN YARD CAFÉ — MYSQL REVIEWS SYSTEM
// STATIC SLIDER — NO MARQUEE
// =====================================

const reviewsSlider = document.getElementById("reviews-slider");
const reviewsTrack = document.getElementById("reviews-track");

const previousReviewButton = document.querySelector(".review-prev");
const nextReviewButton = document.querySelector(".review-next");

const reviewForm = document.getElementById("customer-review-form");
const reviewMessage = document.getElementById("review-form-message");

const API_URL = "./api/";

if (reviewsSlider && reviewsTrack) {

    // =====================================
    // CREATE REVIEW CARD
    // =====================================

    function createReviewCard(review) {

        const card = document.createElement("article");
        card.className = "review-card";

        const top = document.createElement("div");
        top.className = "review-card-top";

        const stars = document.createElement("span");
        stars.className = "review-stars";

        const rating = Number(review.rating);

        stars.textContent =
            "★".repeat(rating) +
            "☆".repeat(5 - rating);

        stars.setAttribute(
            "aria-label",
            `${rating} out of 5 stars`
        );

        const quote = document.createElement("span");
        quote.className = "review-quote";
        quote.textContent = "“";

        top.append(stars, quote);

        const message = document.createElement("p");
        message.className = "review-text";
        message.textContent = review.message;

        const author = document.createElement("div");
        author.className = "review-author";

        const avatar = document.createElement("div");
        avatar.className = "review-avatar";
        avatar.textContent = review.name.charAt(0).toUpperCase();

        const authorInfo = document.createElement("div");
        authorInfo.className = "review-author-info";

        const name = document.createElement("strong");
        name.textContent = review.name;

        const status = document.createElement("span");
        status.textContent = "Customer review";

        authorInfo.append(name, status);
        author.append(avatar, authorInfo);

        card.append(top, message, author);

        return card;
    }


    // =====================================
    // LOAD REVIEWS FROM MYSQL
    // =====================================

    async function loadReviews() {

        try {

            const response = await fetch(
                API_URL + "get-reviews.php",
                { cache: "no-store" }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Unable to load reviews."
                );
            }

            // Remove old cards
            reviewsTrack.innerHTML = "";

            // Add original reviews only
            data.reviews.forEach(review => {

                reviewsTrack.appendChild(
                    createReviewCard(review)
                );

            });

            // Always start at the first review
            reviewsSlider.scrollLeft = 0;

            updateReviewButtons();

        } catch (error) {

            console.error("Review loading error:", error);

            reviewsTrack.innerHTML = "";

        }
    }


    // =====================================
    // PREVIOUS / NEXT BUTTON STATE
    // =====================================

    function updateReviewButtons() {

        if (!previousReviewButton || !nextReviewButton) {
            return;
        }

        const maxScroll =
            reviewsSlider.scrollWidth - reviewsSlider.clientWidth;

        previousReviewButton.disabled =
            reviewsSlider.scrollLeft <= 2;

        nextReviewButton.disabled =
            reviewsSlider.scrollLeft >= maxScroll - 2;
    }


    // =====================================
    // NAVIGATE REVIEWS
    // =====================================

    function moveReviews(direction) {

        const firstCard =
            reviewsTrack.querySelector(".review-card");

        if (!firstCard) return;

        const gap =
            parseFloat(getComputedStyle(reviewsTrack).gap) || 0;

        const moveAmount = firstCard.offsetWidth + gap;

        const maxScroll = Math.max(
            0,
            reviewsSlider.scrollWidth - reviewsSlider.clientWidth
        );

        const nextPosition = Math.max(
            0,
            Math.min(
                maxScroll,
                reviewsSlider.scrollLeft + direction * moveAmount
            )
        );

        reviewsSlider.scrollTo({
            left: nextPosition,
            behavior: "smooth"
        });
    }


    if (previousReviewButton && nextReviewButton) {

        previousReviewButton.addEventListener("click", () => {
            moveReviews(-1);
        });

        nextReviewButton.addEventListener("click", () => {
            moveReviews(1);
        });

    }


    // Update buttons when user swipes on mobile
    reviewsSlider.addEventListener(
        "scroll",
        updateReviewButtons,
        { passive: true }
    );

    window.addEventListener("resize", updateReviewButtons);


    // Load reviews when website opens
    loadReviews();


    // =====================================
    // CUSTOMER REVIEW SUBMISSION
    // =====================================

    if (reviewForm) {

        reviewForm.addEventListener("submit", async event => {

            event.preventDefault();

            const name = document
                .getElementById("review-name")
                .value.trim();

            const rating = Number(
                document.getElementById("review-rating").value
            );

            const message = document
                .getElementById("review-message")
                .value.trim();

            if (
                !name ||
                !message ||
                name.length > 40 ||
                message.length > 500 ||
                !Number.isInteger(rating) ||
                rating < 1 ||
                rating > 5
            ) {

                reviewMessage.textContent =
                    "Please enter valid review details.";

                return;
            }

            const submitButton =
                reviewForm.querySelector(".review-submit-btn");

            submitButton.disabled = true;

            submitButton.textContent = "SUBMITTING...";

            reviewMessage.textContent = "Saving your review...";

            try {

                const response = await fetch(
                    API_URL + "submit-review.php",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            name,
                            rating,
                            message
                        })
                    }
                );

                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(
                        data.message || "Review submission failed."
                    );
                }

                // Reload reviews from MySQL
                await loadReviews();

                reviewMessage.textContent = data.message;

                reviewForm.reset();

                // Show the newly updated review section
                reviewsSlider.scrollTo({
                    left: 0,
                    behavior: "smooth"
                });

            } catch (error) {

                console.error("Review submission error:", error);

                reviewMessage.textContent = error.message;

            } finally {

                submitButton.disabled = false;

                submitButton.innerHTML =
                    'SUBMIT YOUR REVIEW <span aria-hidden="true">↗</span>';

            }

        });

    }

}


    // =====================================
    // COPYRIGHT YEAR
    // =====================================

    const currentYear = document.getElementById("current-year");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

});


console.log(
    "%cCreated by Muhammad Arsalan\n🔗 Connect: https://www.linkedin.com/in/arsalansworkspace/",
    "color: #f1f5f2; font-size: 14px; font-weight: bold; padding: 8px 12px; border-radius: 4px;"
);