const form = document.getElementById("lead-form");
const statusText = document.getElementById("form-status");
const teacherPhotos = document.querySelectorAll(".teacher-photo");
const teacherOpenButtons = Array.from(document.querySelectorAll("[data-teacher-open]"));
const teacherModal = document.getElementById("teacher-modal");
const teacherModalClose = document.getElementById("teacher-modal-close");
const teacherPrev = document.getElementById("teacher-prev");
const teacherNext = document.getElementById("teacher-next");
const teacherPosition = document.getElementById("teacher-position");
const teacherModalName = document.getElementById("teacher-modal-name");
const teacherModalRole = document.getElementById("teacher-modal-role");
const teacherModalBio = document.getElementById("teacher-modal-bio");
const teacherModalContact = document.getElementById("teacher-modal-contact");
const teacherModalImage = document.getElementById("teacher-modal-image");

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

if (
  teacherModal &&
  teacherModalClose &&
  teacherPrev &&
  teacherNext &&
  teacherPosition &&
  teacherModalName &&
  teacherModalRole &&
  teacherModalBio &&
  teacherModalContact &&
  teacherModalImage &&
  teacherOpenButtons.length > 0
) {
  const teachers = teacherOpenButtons.map((button) => ({
    name: button.dataset.name || "",
    role: button.dataset.role || "",
    bio: button.dataset.bio || "",
    image: button.dataset.image || "",
    alt: button.dataset.alt || "Foto da professora",
    contactLabel: button.dataset.contactLabel || "",
    contactUrl: button.dataset.contactUrl || "",
  }));

  let currentTeacherIndex = 0;

  const renderTeacher = (index) => {
    const teacher = teachers[index];

    teacherModalName.textContent = teacher.name;
    teacherModalRole.textContent = teacher.role;
    teacherModalBio.textContent = teacher.bio;
    teacherModalImage.src = teacher.image;
    teacherModalImage.alt = teacher.alt;
    teacherPosition.textContent = `${index + 1} de ${teachers.length}`;

    if (teacher.contactLabel && teacher.contactUrl) {
      const contactLink = document.createElement("a");
      contactLink.href = teacher.contactUrl;
      contactLink.target = "_blank";
      contactLink.rel = "noopener noreferrer";
      contactLink.textContent = teacher.contactLabel;
      teacherModalContact.replaceChildren(contactLink);
      teacherModalContact.style.display = "block";
    } else {
      teacherModalContact.replaceChildren();
      teacherModalContact.style.display = "none";
    }
  };

  const openTeacherModal = (index) => {
    currentTeacherIndex = index;
    renderTeacher(currentTeacherIndex);
    teacherModal.hidden = false;
    document.body.classList.add("modal-open");
    teacherModalClose.focus();
  };

  const closeTeacherModal = () => {
    teacherModal.hidden = true;
    document.body.classList.remove("modal-open");
  };

  const showPreviousTeacher = () => {
    currentTeacherIndex = (currentTeacherIndex - 1 + teachers.length) % teachers.length;
    renderTeacher(currentTeacherIndex);
  };

  const showNextTeacher = () => {
    currentTeacherIndex = (currentTeacherIndex + 1) % teachers.length;
    renderTeacher(currentTeacherIndex);
  };

  teacherOpenButtons.forEach((button, index) => {
    button.addEventListener("click", () => openTeacherModal(index));
  });

  teacherModalClose.addEventListener("click", closeTeacherModal);
  teacherPrev.addEventListener("click", showPreviousTeacher);
  teacherNext.addEventListener("click", showNextTeacher);

  teacherModal.addEventListener("click", (event) => {
    if (event.target === teacherModal) {
      closeTeacherModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (teacherModal.hidden) {
      return;
    }

    if (event.key === "Escape") {
      closeTeacherModal();
      return;
    }

    if (event.key === "ArrowLeft") {
      showPreviousTeacher();
    }

    if (event.key === "ArrowRight") {
      showNextTeacher();
    }
  });
}
