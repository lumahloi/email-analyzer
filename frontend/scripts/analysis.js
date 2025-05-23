$(document).ready(function () {
  loadFileList();
  const urlParams = new URLSearchParams(window.location.search);
  const filename = urlParams.get("file");

  if (filename) {
    checkLocalStorageFirst(filename);
  } else {
    handleNoFileSelected();
  }
});

function renderExportBtn() {
  $("#show-export-button").html(`
    <button class="btn btn-success btn-md" id="btn-export">
      <i class="bi bi-table text-light"></i>
      Exportar
    </button>
  `);
}

function checkLocalStorageFirst(filename) {
  const allAnalyses = JSON.parse(localStorage.getItem("all_analyses")) || {};

  if (allAnalyses[filename]) {
    renderAnalysis(allAnalyses[filename].data);
  } else {
    showLoadingMessage(filename);
    loadAnalysisFromAPI(filename);
  }
}

function showLoadingMessage(filename) {
  $("#result").html(`
    <tr>
      <td colspan='4' class="text-center py-4">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Carregando...</span>
        </div>
        <p class="mt-2">Buscando análise para ${filename}</p>
      </td>
    </tr>
  `);
}

function handleNoFileSelected() {
  const raw = localStorage.getItem("analysis_result");
  const response = raw ? JSON.parse(raw) : null;

  if (response) {
    renderAnalysis(response);
  } else {
    $("#result").html(`
      <tr>
        <td colspan='4' class="text-center py-4">
          Nenhum resultado disponível. Por favor, envie um arquivo primeiro.
        </td>
      </tr>
    `);
  }
}

function loadAnalysisFromAPI(filename) {
  $.ajax({
    url: `/api/files/${filename}`,
    type: "GET",
    success: function (apiResponse) {
      if (apiResponse.status === "success") {
        const allAnalyses =
          JSON.parse(localStorage.getItem("all_analyses")) || {};
        const analysis = allAnalyses[filename];

        if (analysis) {
          renderAnalysis(analysis.data);
        } else {
          showNotFoundMessage(
            filename,
            "Dados de análise não encontrados localmente"
          );
        }
      } else {
        showNotFoundMessage(
          filename,
          apiResponse.message || "Erro ao carregar análise"
        );
      }
    },
    error: function (jqXHR) {
      if (jqXHR.status === 404) {
        showNotFoundMessage(filename, "Arquivo não encontrado no servidor");
      } else {
        showErrorMessage(`Erro ${jqXHR.status} ao carregar análise`);
      }
    },
  });
}

function showNotFoundMessage(filename, message) {
  $("#result").html(`
    <div class="col-md-3 mx-auto text-center">
      ${message}: <span class="fw-bold">${filename}</span>
      <a class="mt-2 mb-0 btn btn-secondary" href="index.html" role="button">
        <i class="bi bi-arrow-left text-light"></i> 
        Voltar
      </a>
    </div>
  `);
}

function showErrorMessage(message) {
  $("#result").html(`
    <tr>
      <td colspan='4' class="text-center py-4">
        <div class="alert alert-danger">
          <i class="bi bi-exclamation-octagon-fill"></i>
          ${message}
        </div>
      </td>
    </tr>
  `);
}

function renderAnalysis(response) {
  if (!response || !Array.isArray(response) || response.length === 0) {
    $("#result").html(
      "<tr><td colspan='4'>Nenhum resultado retornado.</td></tr>"
    );
    return;
  }

  renderExportBtn();

  let resultHtml = `
    <thead>
      <tr>
        <th scope="col">Ordem</th>
        <th scope="col">Conteúdo</th>
        <th scope="col">Categoria</th>
        <th scope="col">Resposta sugerida</th>
      </tr>
    </thead>
    <tbody class="table-group-divider">
  `;

  response.forEach((item, index) => {
    const hasResponse =
      item.response && item.response !== `<i class="bi bi-x-circle"></i>`;
    const hasContent = item.content && item.content !== "";

    resultHtml += `
      <tr>
        <td>${index + 1}</td>
        <td>
          ${
            hasContent
              ? `<button type="button" class="btn btn-sm btn-outline-secondary hide-content-btn">Ocultar</button>`
              : ""
          }
          <span class="content-text">${item.content}</span>
        </td>
        <td>
          <span style="color: ${
            item.category === "Produtivo" ? "green" : "#757575"
          };" class="${item.category === "Produtivo" ? "fw-bold" : ""}">${
      item.category
    }</span>
        </td>
        <td>
          ${
            hasResponse
              ? `<button type="button" class="btn btn-sm btn-outline-secondary hide-response-btn">Ocultar</button>`
              : ""
          }
          <span class="response-text">${
            hasResponse ? item.response : `<i class="bi bi-x-circle"></i>`
          }</span>
        </td>
      </tr>
    `;
  });

  resultHtml += `</tbody>`;
  $("#result").html(resultHtml);

  $(".hide-content-btn").click(function () {
    const span = $(this).siblings(".content-text");
    span.toggle();
    $(this).text(span.is(":visible") ? "Ocultar" : "Mostrar");
  });

  $(".hide-response-btn").click(function () {
    const span = $(this).siblings(".response-text");
    span.toggle();
    $(this).text(span.is(":visible") ? "Ocultar" : "Mostrar");
  });
}

$("#btn-export").click(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const filenameWithExtension = urlParams.get("file");
  
  if (!filenameWithExtension) {
    showModal('Erro', 'Nenhum arquivo selecionado para exportação');
    return;
  }

  const filenameWithoutExtension = filenameWithExtension.replace(/\.txt$/i, '');
  
  const allAnalyses = JSON.parse(localStorage.getItem('all_analyses')) || {};
  const analysisData = allAnalyses[filenameWithExtension]?.data;
  
  if (!analysisData) {
    showModal('Erro', 'Dados não encontrados para exportação');
    return;
  }

  $.ajax({
    url: `http://127.0.0.1:5000/api/export/${filenameWithExtension}`,
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(analysisData),
    xhrFields: {
      responseType: 'blob'
    },
    success: function(data, textStatus, jqXHR) {
      const contentType = jqXHR.getResponseHeader('Content-Type');
      const contentDisposition = jqXHR.getResponseHeader('Content-Disposition');
      
      let downloadFilename = `${filenameWithoutExtension}.xlsx`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+)"?/);
        if (match) downloadFilename = match[1];
      }
      
      const blob = new Blob([data], {type: contentType});
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = downloadFilename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    },
    error: function(jqXHR) {
      renderError(jqXHR);
    }
  });
});