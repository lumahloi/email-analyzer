$(document).ready(function () {
  loadFileList();

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

        const allAnalyses = JSON.parse(localStorage.getItem('all_analyses')) || {};

        allAnalyses[response.filename] = {
          data: response.data,
          timestamp: new Date().toISOString()
        };

        localStorage.setItem('all_analyses', JSON.stringify(allAnalyses));
        
        window.location.href = `pages/analysis.html?file=${encodeURIComponent(response.filename)}`;
      },

      error: (jqXHR) => {
        hideLoadingModal(loadingInstance);
        renderError(jqXHR);
      },
    });
  });
});
