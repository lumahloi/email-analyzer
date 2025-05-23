function deleteFile(filename, userId) {
  if (!confirm(`Tem certeza que deseja excluir o arquivo ${filename}?`)) return;

  const apiUrl = (location.hostname === 'localhost') 
    ? `http://localhost:5000/api/files/${encodeURIComponent(filename)}`
    : `https://email-analyzer-9x4h.onrender.com/api/files/${encodeURIComponent(filename)}`;

  $.ajax({
    url: apiUrl,
    type: "DELETE",
    headers: {
      'X-User-ID': userId
    },
    success: function() {
      const allAnalyses = JSON.parse(localStorage.getItem('all_analyses')) || {};
      delete allAnalyses[filename];
      localStorage.setItem('all_analyses', JSON.stringify(allAnalyses));
      
      loadFileList(userId);
      showToast('success', 'Arquivo excluído com sucesso');
    },
    error: function(jqXHR) {
      showToast('error', 'Erro ao excluir arquivo');
      console.error('Erro ao deletar:', jqXHR);
    }
  });
}