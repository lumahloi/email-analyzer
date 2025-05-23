$(document).ready(function () {
  const userId = localStorage.getItem("user_id");

  const apiUrl =
    location.hostname === "localhost"
      ? "http://localhost:5000/api/files"
      : "https://email-analyzer-9x4h.onrender.com/api/files";

  $.ajax({
    url: apiUrl,
    type: "GET",
    headers: {
      "X-User-ID": userId,
    },
    success: function (response) {
      const fileList = $("#file-list");
      fileList.empty();

      if (response.status === "success") {
        if (response.files && response.files.length > 0) {
          const listGroup = $('<div class="list-group"></div>');

          const allAnalyses =
            JSON.parse(localStorage.getItem("all_analyses")) || {};
          const userAnalyses = Object.entries(allAnalyses)
            .filter(([_, analysis]) => analysis.user_id === userId)
            .map(([filename, _]) => filename);

          response.files.forEach((file) => {
            if (userAnalyses.length === 0 || userAnalyses.includes(file.name)) {
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
            }
          });

          fileList.append(listGroup);

          $(".delete-file").click(function () {
            const filename = $(this).data("filename");
            const userId = localStorage.getItem("user_id");
            deleteFile(filename, userId);
          });

          if (listGroup.children().length === 0) {
            fileList.html(`Nenhum arquivo encontrado para seu usuário`);
          }
        } else {
          fileList.html(`Nenhum arquivo enviado ainda`);
        }
      } else {
        alert("Erro ao carregar arquivos: " + response.message);
      }
    },
    error: function (error) {
      console.error("Erro na requisição:", error);
      alert("Erro ao carregar arquivos.");
    },
  });
});
