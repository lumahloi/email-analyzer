$(document).ready(function () {
  const raw = localStorage.getItem("analysis_result");
  const response = JSON.parse(raw);

  if (!Array.isArray(response) || response.length === 0) {
    $("#result").html("<tr><td colspan='4'>Nenhum resultado retornado.</td></tr>");
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
    const hasResponse = item.response && item.response !== `<i class="bi bi-x-circle"></i>`;
    const hasContent = item.content && item.content !== "";

    resultHtml += `
      <tr>
        <td>${index + 1}</td>
        <td>
          ${hasContent ? `<button type="button" class="btn btn-sm btn-outline-secondary hide-content-btn">Ocultar</button>` : ""}
          <span class="content-text">${item.content}</span>
        </td>
        <td>
          <span style="color: ${item.category === "Produtivo" ? "green" : "#757575"};" class="${item.category === "Produtivo" ? "fw-bold" : ""}">${item.category}</span>
        </td>
        <td>
          ${hasResponse ? `<button type="button" class="btn btn-sm btn-outline-secondary hide-response-btn">Ocultar</button>` : ""}
          <span class="response-text">${hasResponse ? item.response : `<i class="bi bi-x-circle"></i>`}</span>
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
});
