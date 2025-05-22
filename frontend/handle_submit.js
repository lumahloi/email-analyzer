$(function() {
  $("#submit-btn").click(function(){
    var email = $("#input-query").val();

    $("#result").html("Carregando...");

    $.ajax({
      type: "POST",
      url: "http://127.0.0.1:5000/api/submit",
      data: JSON.stringify({ email: email }),
      contentType: "application/json",
      success: (response) => {
        var result = "Categoria: " + response.category + " Resposta: " + (response.response || "");
        $("#result").html(result);

        console.log(response.category);
        console.log(response.response);
        console.log(result);
      },
      error: (xhr, status, error) => {
        console.log(xhr.responseText);
        $("#result").html("Erro ao enviar requisição.");
      }
    });
  });
});