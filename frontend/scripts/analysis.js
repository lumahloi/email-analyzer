$(document).ready(function () {
  const userId = localStorage.getItem("user_id");

  if (!userId) {
    showModal("Sessão expirada", "Por favor, faça upload de um novo arquivo");
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const filename = urlParams.get("file");

  if (filename) {
    const allAnalyses = JSON.parse(localStorage.getItem("all_analyses")) || {};
    if (allAnalyses[filename] && allAnalyses[filename].user_id !== userId) {
      showNotFoundMessage(
        filename,
        "Você não tem permissão para acessar este arquivo"
      );
      return;
    }
    checkLocalStorageFirst(filename);
  } else {
    handleNoFileSelected();
  }
});

function verifySession(callback) {
  var apiUrl =
    location.hostname === "localhost"
      ? "http://localhost:5000/api/check-session"
      : "https://email-analyzer-9x4h.onrender.com/api/check-session";

  $.get(apiUrl, function (response) {
    if (
      response.authenticated &&
      response.user_id === localStorage.getItem("user_id")
    ) {
      callback();
    } else {
      showModal("Sessão expirada", "Por favor, faça upload de um novo arquivo");
    }
  });
}

function checkLocalStorageFirst(filename) {
  const allAnalyses = JSON.parse(localStorage.getItem("all_analyses")) || {};

  if (allAnalyses[filename]) {
    if (!localStorage.getItem("user_id") && allAnalyses[filename].user_id) {
      localStorage.setItem("user_id", allAnalyses[filename].user_id);
    }

    renderAnalysis(allAnalyses[filename].data);
  } else {
    showLoadingMessage(filename);
    verifySession(function () {
      loadAnalysisFromAPI(filename);
    });
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
  var apiUrl =
    location.hostname === "localhost"
      ? "http://localhost:5000/api/files/" + filename
      : "https://email-analyzer-9x4h.onrender.com/api/files/" + filename;

  $.ajax({
    type: "GET",
    url: apiUrl,
    success: function (apiResponse) {
      renderAnalysis(apiResponse);
    },
    error: function (jqXHR) {
      if (jqXHR.status === 404) {
        showNotFoundMessage(filename, "Arquivo não encontrado no servidor");
      } else if (jqXHR.status === 401) {
        showNotFoundMessage(filename, "Você precisa fazer login novamente");
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
    $("#show-export-button").html("");
    return;
  }

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

  const params = new URLSearchParams(window.location.search);
  var filename = params.get("file");
  filename = filename.replace(/\.txt$/i, "");
  filename += ".xlsx";
  $("#show-export-button").html(`
    <button id="export-button" class="btn btn-success" data-filename="${filename}">
      Exportar
    </button>
  `);

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

$(document).on("click", "#export-button", function () {
  const params = new URLSearchParams(window.location.search);
  var filename =  params.get("file");
  filename = filename.replace(/\.txt$/i, "");

  const tableData = [];
  $("#result tbody tr").each(function () {
    const content = $(this).find(".content-text").text().trim();
    const category = $(this).find("td:nth-child(3)").text().trim();
    const response = $(this).find(".response-text").text().trim();
    tableData.push({
      content: content,
      category: category,
      response: response,
    });
  });

  if (tableData.length === 0) {
    alert("Nenhum dado disponível para exportação.");
    return;
  }

  var apiUrl =
    location.hostname === "localhost"
      ? "http://localhost:5000/api/export/" + filename
      : "https://email-analyzer-9x4h.onrender.com/api/export/" + filename;

  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tableData),
  })
    .then((response) => {
      if (!response.ok) throw new Error("Erro na exportação");
      return response.blob();
    })
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    })
    .catch((error) => {
      console.error("Erro ao exportar:", error);
      alert("Falha na exportação. Tente novamente.");
    });
});
