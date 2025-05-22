$(document).ready(function () {
  $("#submit-btn").click(function () {
    var inputFile = $("#input-file").prop("files");

    if (!inputFile || inputFile.length === 0) {
      showModal("Aviso", "Por favor, selecione um arquivo antes de enviar.");
      return;
    }

    if (!inputFile) {
      showModal("Aviso", "Nenhum dado encontrado, envie um arquivo com dados válidos.");
      return;
    }

    var file = inputFile[0];
    var fileName = file.name.toLowerCase();

    if (!fileName.endsWith(".txt")) {
      showModal("Aviso", "Apenas arquivos com extensão .txt são permitidos.");
      return;
    }

    const loadingInstance = showLoadingModal();

    var formData = new FormData();
    formData.append("file", file);

    $.ajax({
      type: "POST",
      url: "http://127.0.0.1:5000/api/submit",
      data: formData,
      processData: false,
      contentType: false,
      success: (response) => {
        hideLoadingModal(loadingInstance);
        localStorage.setItem("analysis_result", JSON.stringify(response));
        window.location.href = "analysis.html";
      },

      error: (jqXHR) => {
        hideLoadingModal(loadingInstance);
        renderError(jqXHR);
      },
    });
  });
});
