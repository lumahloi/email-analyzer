function loadFileList() {
  console.log('funciona caralho')
  // const userId = localStorage.getItem("user_id");
  // console.log("loadFileList chamado com userId:", userId);

  // if (!userId) {
  //   console.error("user_id não encontrado no localStorage.");
  //   $("#file-list").html('<div class="alert alert-warning">Usuário não identificado</div>');
  //   return;
  // }

  // const apiUrl = location.hostname === 'localhost'
  //   ? 'http://localhost:5000/api/files'
  //   : 'https://email-analyzer-9x4h.onrender.com/api/files';

  // $.ajax({
  //   url: apiUrl,
  //   type: "GET",
  //   headers: {
  //     'X-User-ID': userId
  //   },
  //   success: function (response) {
  //     const fileList = $("#file-list");
  //     fileList.empty();

  //     if (response.status !== "success") {
  //       fileList.html('<div class="alert alert-warning">Erro ao carregar arquivos</div>');
  //       return;
  //     }

  //     const userFiles = response.files || [];
  //     const allAnalyses = JSON.parse(localStorage.getItem("all_analyses")) || {};
  //     const listGroup = $('<div class="list-group"></div>');

  //     userFiles.forEach((file) => {
  //       if (allAnalyses[file.name]?.user_id === userId || (!allAnalyses[file.name] && userId === response.user_id)) {
  //         listGroup.append(`
  //           <div class="list-group-item d-flex justify-content-between align-items-center">
  //             <a href="analysis.html?file=${encodeURIComponent(file.name)}" class="text-decoration-none">
  //               <i class="bi bi-file-text me-2"></i>${file.name}
  //             </a>
  //             <button class="btn btn-sm btn-outline-danger delete-file" data-filename="${file.name}">
  //               <i class="bi bi-trash"></i>
  //             </button>
  //           </div>
  //         `);
  //       }
  //     });

  //     if (listGroup.children().length === 0) {
  //       fileList.html('<div class="alert alert-info">Nenhum arquivo encontrado para seu usuário</div>');
  //     } else {
  //       fileList.append(listGroup);
  //       $(".delete-file").click(function () {
  //         const filename = $(this).data("filename");
  //         deleteFile(filename, userId);
  //       });
  //     }
  //   },
  //   error: function (jqXHR) {
  //     console.error("Erro na requisição:", jqXHR);
  //     let errorMsg = "Erro ao carregar lista de arquivos";

  //     if (jqXHR.status === 404) {
  //       errorMsg = "Nenhum arquivo encontrado";
  //     } else if (jqXHR.status === 401) {
  //       errorMsg = "Sessão expirada - Faça upload de um novo arquivo";
  //     }

  //     $("#file-list").html(`<div class="alert alert-danger">${errorMsg}</div>`);
  //   }
  // });
}

window.loadFileList = loadFileList;