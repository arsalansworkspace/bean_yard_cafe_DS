
document.addEventListener("DOMContentLoaded", () => {

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
    // COPYRIGHT YEAR
    // =====================================

    const currentYear = document.getElementById("current-year");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

});
