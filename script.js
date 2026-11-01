
// ==========================================
// MEERA'S ROMANTIC WEBSITE
// Page navigation, particles, and interactions
// ==========================================

const pages = Array.from(document.querySelectorAll(".page"));
const pageDots = Array.from(document.querySelectorAll(".page-dot"));

let currentPage = 1;
let celebrationInterval = null;

// ==========================================
// PAGE TRANSITIONS
// ==========================================

function goToPage(pageNumber) {
    if (pageNumber < 1 || pageNumber > pages.length) return;

    pages.forEach((page, index) => {
        page.classList.remove("active", "exit-left");

        if (index + 1 === pageNumber) {
            page.classList.add("active");
        }
    });

    pageDots.forEach((dot, index) => {
        dot.classList.toggle("active-dot", index + 1 === pageNumber);
    });

    currentPage = pageNumber;

    // Position the NO button when opening the apology page.
    if (pageNumber === 4) {
        requestAnimationFrame(positionNoButtonInitially);
    }
}

// ==========================================
// FLOATING BACKGROUND PARTICLES
// ==========================================

const particleContainer = document.getElementById("particles");

function createBackgroundParticles() {
    const symbols = ["♡", "♥", "✦", "✧", "·"];
    const particleCount = window.innerWidth < 600 ? 18 : 32;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("span");

        particle.className = "particle";
        particle.textContent =
            symbols[Math.floor(Math.random() * symbols.length)];

        particle.style.left = Math.random() * 100 + "%";
        particle.style.fontSize = (10 + Math.random() * 18) + "px";
        particle.style.animationDuration = (9 + Math.random() * 15) + "s";
        particle.style.animationDelay = (-Math.random() * 20) + "s";

        particleContainer.appendChild(particle);
    }
}

createBackgroundParticles();

// ==========================================
// NO BUTTON - PLAYFUL RUNAWAY BEHAVIOR
// ==========================================

const noButton = document.getElementById("noButton");
const buttonArea = document.getElementById("buttonArea");
const playfulNote = document.getElementById("playfulNote");

const playfulMessages = [
    "Hehe, too slow! 🙈",
    "Not so fast! 💨",
    "Oops, missed me! 😂",
    "Catch me if you can! 💗",
    "Are you sure about that? 🥺",
    "I'm a little shy! 🌷",
    "Almost... but not quite! 💕"
];

let noButtonHasMoved = false;
let lastMoveTime = 0;

function positionNoButtonInitially() {
    if (currentPage !== 4) return;

    const yesButton = document.getElementById("yesButton");
    const yesRect = yesButton.getBoundingClientRect();
    const noRect = noButton.getBoundingClientRect();

    // Put the NO button beside YES initially.
    let initialX = yesRect.right + 18;
    let initialY = yesRect.top + (yesRect.height - noRect.height) / 2;

    if (initialX + noRect.width > window.innerWidth - 12) {
        initialX = yesRect.left;
        initialY = yesRect.bottom + 12;
    }

    const maxX = Math.max(12, window.innerWidth - noRect.width - 12);
    const maxY = Math.max(12, window.innerHeight - noRect.height - 12);

    initialX = Math.max(12, Math.min(initialX, maxX));
    initialY = Math.max(12, Math.min(initialY, maxY));

    noButton.style.left = initialX + "px";
    noButton.style.top = initialY + "px";
}

function moveNoButton() {
    if (currentPage !== 4) return;

    const now = Date.now();

    // Prevent multiple rapid events from causing jitter.
    if (now - lastMoveTime < 180) return;

    lastMoveTime = now;

    const buttonRect = noButton.getBoundingClientRect();
    const yesRect = document.getElementById("yesButton").getBoundingClientRect();

    const margin = 14;

    const maxX = Math.max(margin, window.innerWidth - buttonRect.width - margin);
    const maxY = Math.max(margin, window.innerHeight - buttonRect.height - margin);

    let newX;
    let newY;
    let attempts = 0;

    do {
        newX = margin + Math.random() * Math.max(0, maxX - margin);
        newY = margin + Math.random() * Math.max(0, maxY - margin);

        attempts++;
    } while (
        attempts < 35 &&
        rectanglesOverlap(
            {
                left: newX,
                top: newY,
                right: newX + buttonRect.width,
                bottom: newY + buttonRect.height
            },
            {
                left: yesRect.left - 25,
                top: yesRect.top - 25,
                right: yesRect.right + 25,
                bottom: yesRect.bottom + 25
            }
        )
    );

    noButton.style.left = newX + "px";
    noButton.style.top = newY + "px";

    noButtonHasMoved = true;

    playfulNote.textContent =
        playfulMessages[Math.floor(Math.random() * playfulMessages.length)];
}

function rectanglesOverlap(a, b) {
    return (
        a.left < b.right &&
        a.right > b.left &&
        a.top < b.bottom &&
        a.bottom > b.top
    );
}

// Run away when the pointer approaches the button.
noButton.addEventListener("pointerenter", moveNoButton);

// Also respond when the user tries to press it.
noButton.addEventListener("pointerdown", function (event) {
    event.preventDefault();
    moveNoButton();
});

// Prevent clicking the NO button.
noButton.addEventListener("click", function (event) {
    event.preventDefault();
    event.stopPropagation();
    moveNoButton();
});

// Mobile touch interaction.
noButton.addEventListener("touchstart", function (event) {
    event.preventDefault();
    moveNoButton();
}, { passive: false });

// Keep the button in the viewport when resizing.
window.addEventListener("resize", function () {
    if (currentPage === 4 && !noButtonHasMoved) {
        positionNoButtonInitially();
    } else if (currentPage === 4) {
        const rect = noButton.getBoundingClientRect();

        const x = Math.max(
            12,
            Math.min(rect.left, window.innerWidth - rect.width - 12)
        );

        const y = Math.max(
            12,
            Math.min(rect.top, window.innerHeight - rect.height - 12)
        );

        noButton.style.left = x + "px";
        noButton.style.top = y + "px";
    }
});

// ==========================================
// YES BUTTON - HEART CELEBRATION
// ==========================================

function sayYes() {
    const overlay = document.getElementById("successOverlay");

    overlay.classList.add("show");

    // Create the first wave of hearts.
    createCelebrationHearts(45);

    // Add another small wave of hearts.
    clearInterval(celebrationInterval);

    celebrationInterval = setInterval(() => {
        createCelebrationHearts(10);
    }, 1200);

    // Stop generating new hearts after a short celebration.
    setTimeout(() => {
        clearInterval(celebrationInterval);
        celebrationInterval = null;
    }, 6000);
}

function createCelebrationHearts(count) {
    const celebration = document.getElementById("celebration");
    const symbols = ["💗", "💖", "💕", "❤️", "💘", "✨", "🌸"];

    for (let i = 0; i < count; i++) {
        const heart = document.createElement("span");

        heart.className = "celebration-heart";
        heart.textContent =
            symbols[Math.floor(Math.random() * symbols.length)];

        heart.style.left = Math.random() * 100 + "vw";
        heart.style.fontSize = (14 + Math.random() * 24) + "px";
        heart.style.animationDuration = (3 + Math.random() * 4) + "s";
        heart.style.animationDelay = (Math.random() * 1.5) + "s";

        celebration.appendChild(heart);

        // Remove old elements to keep the page lightweight.
        setTimeout(() => {
            heart.remove();
        }, 9000);
    }
}

// ==========================================
// RESTART THE WEBSITE
// ==========================================

function restartWebsite() {
    const overlay = document.getElementById("successOverlay");

    overlay.classList.remove("show");

    clearInterval(celebrationInterval);
    celebrationInterval = null;

    document.getElementById("celebration").innerHTML = "";

    playfulNote.textContent =
        "Psst... that little NO button is feeling shy 🙈";

    noButtonHasMoved = false;

    goToPage(1);
}

// ==========================================
// KEYBOARD NAVIGATION
// ==========================================

document.addEventListener("keydown", function (event) {
    if (document.getElementById("successOverlay").classList.contains("show")) {
        if (event.key === "Escape") {
            restartWebsite();
        }

        return;
    }

    if (event.key === "ArrowRight" && currentPage < 4) {
        goToPage(currentPage + 1);
    }

    if (event.key === "ArrowLeft" && currentPage > 1) {
        goToPage(currentPage - 1);
    }
});

// ==========================================
// INITIALIZE WEBSITE
// ==========================================

window.addEventListener("load", function () {
    goToPage(1);
});