$.getJSON('config.json', function(config) {
  $(function() {
    $("#submit-btn").click(function(){
      $("#result").html("Carregando...");
      var formData = new FormData();
      formData.append('file', $('#input-file')[0].files[0]);
  
      $.ajax({
        type: "POST",
        url: config.BACKEND_URL,
        data: formData,
        processData: false,
        contentType: false,
        success: (response) => {
          var result = "Categoria: " + response.category + " Resposta: " + (response.response || "");
          $("#result").html(result);
        },
        error: (xhr, status, error) => {
          console.log(xhr.responseText);
          $("#result").html("Erro ao enviar requisição.");
        }
      });
    });
  });
})