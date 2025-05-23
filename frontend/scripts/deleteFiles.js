function deleteFile(filename, userId) {
  if (!confirm(`Tem certeza que deseja remover ${filename}?`)) return;
  
  $.ajax({
    url: `https://email-analyzer-9x4h.onrender.com/api/files/${filename}`,
    type: 'DELETE',
    headers: {
      'X-User-ID': userId
    },
    success: function() {
      try {
        const allAnalyses = JSON.parse(localStorage.getItem('all_analyses')) || {};
        delete allAnalyses[filename];
        localStorage.setItem('all_analyses', JSON.stringify(allAnalyses));
        
        showToast('success', `Arquivo ${filename} removido com sucesso`);

        const urlParams = new URLSearchParams(window.location.search);
        const filenameWithExtension = urlParams.get("file");
        if(filenameWithExtension == filename){
          window.location.href = `index.html`;
        }
      } catch (e) {
        console.error("Erro ao atualizar localStorage:", e);
        showToast('warning', 'Arquivo removido do servidor mas ocorreu um erro ao atualizar o histórico local');
      }
      
      loadFileList(userId);
    },
    error: function(jqXHR) {
      console.error("Erro ao deletar:", jqXHR);
      if (jqXHR.status === 404) {
        const allAnalyses = JSON.parse(localStorage.getItem('all_analyses')) || {};
        if (allAnalyses[filename]) {
          delete allAnalyses[filename];
          localStorage.setItem('all_analyses', JSON.stringify(allAnalyses));
          loadFileList(userId);
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