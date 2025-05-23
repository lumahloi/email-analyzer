const targets = [
  document.querySelector("nav.navbar"),
  document.querySelector(".container-fluid.bg-light.p-5.shadow-sm"),
  ...document.querySelectorAll(".container-fluid.bg-light.p-5.shadow-sm.mt-5"),
  document.querySelectorAll("nav.navbar")[1],
];

const animationClass = "animate__animated animate__fadeInUp";

const observer = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add(...animationClass.split(" "));
        obs.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.1,
  }
);

targets.forEach((el) => {
  if (el) observer.observe(el);
});

function showLoadingModal() {
  const modal = new bootstrap.Modal(document.getElementById("loadingModal"));
  modal.show();
  return modal;
}

function hideLoadingModal(modalInstance) {
  modalInstance.hide();
}

function showModal(message, title) {
  var modal_placeholder = $("#placeholder");
  var modal_title = $("#modal-title");
  modal_placeholder.html(title);
  modal_title.html(message);

  var modal = new bootstrap.Modal(document.getElementById("errorModal"));
  modal.show();
}

function renderError(jqXHR) {
  $("#result").css({ display: "none" });

  let errorMessage =
    "Ocorreu um problema interno. Por favor, tente novamente mais tarde.";

  if (jqXHR.responseJSON && jqXHR.responseJSON.error) {
    errorMessage = jqXHR.responseJSON.error;
  }

  showModal("Ocorreu um erro", errorMessage);
}
