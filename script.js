const form = document.getElementById("lead-form");
const statusText = document.getElementById("form-status");
const teacherPhotos = document.querySelectorAll(".teacher-photo");

if (form && statusText) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const nome = (formData.get("nome") || "").toString().trim();
    const email = (formData.get("email") || "").toString().trim();

    if (!nome || !email) {
      statusText.textContent = "Preencha nome e e-mail para entrar na lista.";
      return;
    }

    statusText.textContent = `Obrigada, ${nome.split(" ")[0]}! Seu interesse foi registrado.`;
    form.reset();
  });
}

teacherPhotos.forEach((photo) => {
  const card = photo.closest(".teacher-card");

  if (!card) {
    return;
  }

  const fallbackText = photo.dataset.fallback || card.dataset.fallback || "Foto da professora";
  card.dataset.fallback = fallbackText;

  const handleMissingPhoto = () => {
    photo.style.display = "none";
    card.classList.add("photo-missing");
  };

  photo.addEventListener("error", handleMissingPhoto);

  if (photo.complete && photo.naturalWidth === 0) {
    handleMissingPhoto();
  }
});
