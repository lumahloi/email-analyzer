function deleteFile(filename, userId) {
  if (!confirm(`Tem certeza que deseja excluir o arquivo ${filename}?`)) return;

  const apiUrl = (location.hostname === 'localhost') 
    ? `http://localhost:5000/api/files/${userId}/${encodeURIComponent(filename)}`
    : `https://email-analyzer-9x4h.onrender.com/api/files/${userId}/${encodeURIComponent(filename)}`;

  $.ajax({
    url: apiUrl,
    type: "DELETE",
    success: function() {
      const allAnalyses = JSON.parse(localStorage.getItem('all_analyses')) || {};
      delete allAnalyses[filename];
      localStorage.setItem('all_analyses', JSON.stringify(allAnalyses));
      window.location.href = 'index.html';
    },
    error: function(jqXHR) {
      console.error("Erro ao deletar:", jqXHR.status, jqXHR.responseText);
    }
  });
}