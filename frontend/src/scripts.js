$(function () {
  function showAlert(message, type) {
    var alert_placeholder = $("#alert-placeholder");
    var alertHtml = `
      <div class="alert alert-${type} alert-dismissible fade show" role="alert">
        <div>${message}</div>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;
    alert_placeholder.html(alertHtml);
  }

  $("#submit-btn").click(function () {
    var input_file = $("#input-file").prop("files");

    if (!input_file || input_file.length === 0) {
      showAlert("Por favor, selecione um arquivo antes de enviar.", "warning");
      return;
    }

    $("#result").html("Carregando...");
    var formData = new FormData();
    formData.append("file", $("#input-file")[0].files[0]);

    $.ajax({
      type: "POST",
      url: "http://127.0.0.1:5000/api/submit",
      data: formData,
      processData: false,
      contentType: false,
      success: (response) => {
        if (!Array.isArray(response) || response.length === 0) {
          $("#result").html("Nenhum resultado retornado.");
          return;
        }

        let resultHtml = "";

        response.forEach((item, index) => {
          resultHtml += `
            <div class="mb-3">
              <strong>Email ${index + 1}:</strong><br>
              Categoria: ${item.category}<br>
              Resposta: ${item.response || "---"}
            </div>
          `;
        });

        $("#result").html(resultHtml);
      },

      error: (jqXHR) => {
        $("#result").css({ display: "none" });

        let errorMessage =
          "Ocorreu um problema interno. Por favor, tente novamente mais tarde.";

        if (jqXHR.responseJSON && jqXHR.responseJSON.error) {
          errorMessage = jqXHR.responseJSON.error;
        }

        showAlert(errorMessage, "warning");
      },
    });
  });
});
