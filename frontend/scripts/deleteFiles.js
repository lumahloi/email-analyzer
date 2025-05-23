function deleteFile(filename) {
  if (!confirm(`Tem certeza que deseja remover ${filename}?`)) return;
  
  $.ajax({
    url: `http://127.0.0.1:5000/api/files/${filename}`,
    type: 'DELETE',
    success: function() {
      try {
        const allAnalyses = JSON.parse(localStorage.getItem('all_analyses')) || {};
        delete allAnalyses[filename];
        localStorage.setItem('all_analyses', JSON.stringify(allAnalyses));
        
        showToast('success', `Arquivo ${filename} removido com sucesso`);
      } catch (e) {
        console.error("Erro ao atualizar localStorage:", e);
        showToast('warning', 'Arquivo removido do servidor mas ocorreu um erro ao atualizar o histórico local');
      }
      
      loadFileList();
    },
    error: function(jqXHR) {
      console.error("Erro ao deletar:", jqXHR);
      if (jqXHR.status === 404) {
        const allAnalyses = JSON.parse(localStorage.getItem('all_analyses')) || {};
        if (allAnalyses[filename]) {
          delete allAnalyses[filename];
          localStorage.setItem('all_analyses', JSON.stringify(allAnalyses));
          loadFileList();
          showToast('info', 'Arquivo não encontrado no servidor, mas foi removido do histórico local');
        } else {
          renderError(jqXHR);
        }
      } else {
        renderError(jqXHR);
      }
    }
  });
}

function showToast(type, message) {
  const toast = $(`
    <div class="toast align-items-center text-white bg-${type} border-0" role="alert">
      <div class="d-flex">
        <div class="toast-body">
          ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    </div>
  `);
  
  $('#toast-container').append(toast);
  new bootstrap.Toast(toast[0]).show();
  
  setTimeout(() => toast.remove(), 5000);
}