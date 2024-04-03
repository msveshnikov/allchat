// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute("href")).scrollIntoView({
            behavior: "smooth",
        });
    });
});

// Image generation
const generateImageButton = document.querySelector(".generate-image");
const imageContainer = document.querySelector(".generated-image");

generateImageButton.addEventListener("click", async () => {
    try {
        const response = await fetch("/generate-image", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt: "A beautiful landscape" }),
        });

        const imageUrl = await response.json();
        const img = document.createElement("img");
        img.src = imageUrl;
        img.alt = "Generated image";
        imageContainer.innerHTML = "";
        imageContainer.appendChild(img);
    } catch (error) {
        console.error("Error generating image:", error);
    }
});

// Form validation
const form = document.querySelector("form");
const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const messageInput = document.querySelector("#message");

form.addEventListener("submit", (event) => {
    event.preventDefault();

    let isValid = true;

    if (!nameInput.value.trim()) {
        isValid = false;
        nameInput.classList.add("is-invalid");
    } else {
        nameInput.classList.remove("is-invalid");
    }

    if (!emailInput.value.trim() || !isValidEmail(emailInput.value.trim())) {
        isValid = false;
        emailInput.classList.add("is-invalid");
    } else {
        emailInput.classList.remove("is-invalid");
    }

    if (!messageInput.value.trim()) {
        isValid = false;
        messageInput.classList.add("is-invalid");
    } else {
        messageInput.classList.remove("is-invalid");
    }

    if (isValid) {
        // Submit the form or perform any other actions
        console.log("Form submitted successfully!");
    }
});

function isValidEmail(email) {
    // Simple email validation regex
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}
