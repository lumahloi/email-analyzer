$(document).ready(function () {
  let userId = localStorage.getItem("user_id");
  if (!userId) {
    userId = "user_" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("user_id", userId);
  }

  $("#submit-btn").click(function () {
    const inputFile = $("#input-file").prop("files");
    if (!inputFile || inputFile.length === 0) {
      showModal("Aviso", "Selecione um arquivo antes de enviar.");
      return;
    }

    showLoading();

    const file = inputFile[0];
    if (!file.name.toLowerCase().endsWith(".txt")) {
      showModal("Aviso", "Apenas arquivos .txt são permitidos.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", userId);

    const apiUrl =
      location.hostname === "localhost"
        ? "http://localhost:5000/api/submit"
        : "https://email-analyzer-9x4h.onrender.com/api/submit";

    $.ajax({
      type: "POST",
      url: apiUrl,
      data: formData,
      processData: false,
      contentType: false,
      success: (response) => {
        hideLoading();
        if (response.user_id && response.user_id !== userId) {
          userId = response.user_id;
          localStorage.setItem("user_id", userId);
        }

        const allAnalyses =
          JSON.parse(localStorage.getItem("all_analyses")) || {};
        allAnalyses[response.filename] = {
          data: response.data,
          timestamp: new Date().toISOString(),
          user_id: userId,
        };
        localStorage.setItem("all_analyses", JSON.stringify(allAnalyses));
        setTimeout(() => {
          window.location.href = `analysis.html?file=${encodeURIComponent(
            response.filename
          )}`;
        }, 300);
      },
      error: (jqXHR) => {
        hideLoading();
        const error = jqXHR.responseJSON || { message: "Erro desconhecido" };
        showModal("Erro", error.message);
      },
    });
  });
});