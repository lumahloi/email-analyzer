function showDeleteConfirmation(filename) {
  const modalHTML = `
    <div class="modal fade" id="deleteConfirmationModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirmar exclusão</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
          </div>
          <div class="modal-body">
            <p>Tem certeza que deseja excluir o arquivo <strong>${filename}</strong>?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-danger" id="confirmDeleteBtn">Excluir</button>
          </div>
        </div>
      </div>
    </div>
  `;

  $('body').append(modalHTML);

  // Mostra o modal
  const modal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'));
  modal.show();

  return new Promise((resolve) => {
    $('#confirmDeleteBtn').on('click', function() {
      modal.hide();
      $('#deleteConfirmationModal').on('hidden.bs.modal', function() {
        $(this).remove();
      });
      resolve(true);
    });

    $('#deleteConfirmationModal').on('hidden.bs.modal', function() {
      $(this).remove();
      resolve(false);
    });
  });
}

async function deleteFile(filename, userId) {
  const userConfirmed = await showDeleteConfirmation(filename);
  if (!userConfirmed) return;

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