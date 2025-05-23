function loadFileList() {
  $.ajax({
    url: "http://127.0.0.1:5000/api/files",
    type: "GET",
    success: function (response) {
      const fileList = $("#file-list");
      fileList.empty();

      if (response.status === "success") {
        if (response.files && response.files.length > 0) {
          const listGroup = $('<div class="list-group"></div>');

          response.files.forEach((file) => {
            listGroup.append(`
              <div class="list-group-item d-flex justify-content-between align-items-center">
                <a href="analysis.html?file=${encodeURIComponent(
                  file.name
                )}" class="text-decoration-none">
                  <i class="bi bi-file-text me-2"></i>
                  ${file.name}
                </a>
                <button class="btn btn-sm btn-outline-danger delete-file" data-filename="${
                  file.name
                }">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            `);
          });

          fileList.append(listGroup);

          $(".delete-file").click(function () {
            const filename = $(this).data("filename");
            deleteFile(filename);
          });
        } else {
          fileList.html(`Nenhum arquivo enviado ainda`);
        }
      }
    },
    error: function (jqXHR) {
      console.error("Erro na requisição:", jqXHR);
      if (jqXHR.status !== 404) {
        renderError(jqXHR);
      }
    },
  });
}
