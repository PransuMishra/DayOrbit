
const themeToggle = document.getElementById("themeToggle");
const currentYear = document.getElementById("currentYear");

function applyTheme(theme) {
    const isDark = theme === "dark";

    document.documentElement.classList.toggle("dark-page", isDark);
    document.documentElement.classList.toggle("light-page", !isDark);

    document.body.classList.toggle("dark-mode", isDark);
    document.body.classList.toggle("light-mode", !isDark);

    if (themeToggle) {
        themeToggle.textContent = isDark
            ? "☀️ Light Mode"
            : "🌙 Dark Mode";
    }

    try {
        localStorage.setItem("theme", theme);
    } catch (error) {
        console.warn("Theme preference could not be saved.");
    }
}

/* Load the saved theme */
let savedTheme = "dark";

try {
    const storedTheme = localStorage.getItem("theme");

    if (storedTheme === "light" || storedTheme === "dark") {
        savedTheme = storedTheme;
    }
} catch (error) {
    console.warn("Saved theme could not be read.");
}

applyTheme(savedTheme);

/* Toggle between dark and light mode */
if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const isCurrentlyDark =
            document.documentElement.classList.contains("dark-page");

        applyTheme(isCurrentlyDark ? "light" : "dark");
    });
}

/* Current year in the footer */
if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}