// Contact page: JavaScript form validation with per-field error messages.

const form = document.getElementById("contact-form");
const successMessage = document.getElementById("success-message");

// Turn off the browser's own error bubbles so our messages are shown instead.
// The HTML attributes (required, minlength, type="email") stay in the markup,
// so the form is still validated if JavaScript fails to load.
form.noValidate = true;

// Simple email pattern: something@something.something (no spaces)
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Each rule returns an error message, or "" when the field is valid.
const rules = {
  name: (value) =>
    value.trim().length >= 3 ? "" : "Please enter your name (at least 3 characters).",
  email: (value) =>
    EMAIL_PATTERN.test(value.trim()) ? "" : "Please enter a valid email address, e.g. name@example.com.",
  subject: (value) => (value ? "" : "Please choose a subject."),
  message: (value) =>
    value.trim().length >= 20
      ? ""
      : `Your message must be at least 20 characters (currently ${value.trim().length}).`
};

// Show or clear the error for one field and mark it invalid for screen readers.
function setError(field, message) {
  const errorElement = document.getElementById(`${field.id}-error`);
  errorElement.textContent = message;
  if (message) {
    field.setAttribute("aria-invalid", "true");
  } else {
    field.removeAttribute("aria-invalid");
  }
}

// Validates one text/select field; returns true when valid.
function validateField(field) {
  const message = rules[field.name](field.value);
  setError(field, message);
  return message === "";
}

// Radio group: at least one option must be checked.
function validateSource() {
  const checked = form.querySelector('input[name="source"]:checked');
  const errorElement = document.getElementById("source-error");
  const radios = form.querySelectorAll('input[name="source"]');

  errorElement.textContent = checked ? "" : "Please tell me how you heard about me.";
  radios.forEach((radio) => {
    if (checked) {
      radio.removeAttribute("aria-invalid");
    } else {
      radio.setAttribute("aria-invalid", "true");
    }
  });
  return Boolean(checked);
}

// Consent checkbox must be ticked.
function validateConsent() {
  const consent = form.elements.consent;
  setError(consent, consent.checked ? "" : "Please give your consent so I can reply.");
  return consent.checked;
}

form.addEventListener("submit", (event) => {
  event.preventDefault(); // stop the page from reloading
  successMessage.textContent = "";

  const fields = ["name", "email", "subject", "message"].map((name) => form.elements[name]);

  // Run every check (not stopping at the first error) so all messages appear at once.
  const results = fields.map(validateField);
  results.push(validateSource());
  results.push(validateConsent());

  const isValid = results.every(Boolean);

  if (!isValid) {
    // Move keyboard focus to the first field that has a problem.
    const firstInvalid = form.querySelector('[aria-invalid="true"]');
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  const name = form.elements.name.value.trim();
  successMessage.textContent = `Thank you, ${name}! Your message has been sent. I will get back to you soon.`;
  form.reset();
});

// Re-check a field as soon as the user fixes it (only after an error was shown).
form.addEventListener("input", (event) => {
  const field = event.target;
  if (rules[field.name] && field.getAttribute("aria-invalid") === "true") {
    validateField(field);
  }
});

form.addEventListener("change", (event) => {
  const field = event.target;
  if (field.name === "source" && document.getElementById("source-error").textContent) {
    validateSource();
  }
  if (field.name === "consent" && field.getAttribute("aria-invalid") === "true") {
    validateConsent();
  }
});
