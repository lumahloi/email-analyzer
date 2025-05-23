# APIs


## POST /api/export/<filename>

### Descrição
Exporta a análise gerada para um arquivo ```.xlsx```.

### Parâmetros da URL
- ```filename```: nome do arquivo cuja análise deseja-se exportar.

### Corpo (JSON)
```bash
[
  {
    "content": "Texto do email",
    "category": "Categoria prevista",
    "response": "Resposta sugerida"
  }
]
```

### Resposta
- Retorna um arquivo .xlsx com os dados estruturados.
- ```500```: erro interno, com mensagem descritiva.



## GET /api/files

### Descrição
Lista os arquivos ```.txt``` enviados por um usuário identificado no cabeçalho.

### Cabeçalhos
- ```X-User-ID```: identificador do usuário.

### Resposta
```bash
{
  "status": "success",
  "files": [{"name": "arquivo.txt", "url": "/api/files/arquivo.txt"}],
  "user_id": "id"
}
```
- ```400```: se o ```X-User-ID``` não for fornecido.
- ```500```: erro interno.




## GET /api/files/<filename>

### Descrição
Lê o conteúdo de um arquivo ```.txt``` do usuário logado.

### Sessão
Requer ```user_id``` na sessão.

### Resposta
```bash
{
  "status": "success",
  "filename": "arquivo.txt",
  "contents": "conteúdo do arquivo"
}
```
- ```401```: usuário não autenticado.
- ```404```: arquivo não encontrado.
- ```500```: erro interno.




# GET e DELETE /api/files/<filename>

### Descrição
- ```GET```: retorna o conteúdo de um arquivo.
- ```DELETE```: deleta o arquivo.

### Sessão
Requer ```user_id``` na sessão.

### Resposta
Resposta:
- ```GET```: JSON com conteúdo do arquivo.
- ```DELETE```: { "success": true }
- ```400```: tipo de arquivo inválido.
- ```404```: arquivo não encontrado.
- ```401```: sem sessão.
- ```500```: erro interno.



# DELETE /api/files/<user_id>/<filename>

### Descrição
Deleta o arquivo do usuário e remove a pasta se estiver vazia.

### Parâmetros da URL
- ```user_id```ID do usuário.
- ```filename```: nome do arquivo.

### Resposta
```bash
{ "success": true }
```
- Se pasta for removida: inclui mensagem adicional.
- ```400```: ID ou tipo inválido.
- ```404```: arquivo não encontrado.
- ```500```: erro ao excluir.




# POST /api/submit

### Descrição
Recebe um arquivo ```.txt```, processa seu conteúdo em blocos, identifica categoria e resposta, salva localmente, e retorna os resultados.

### Form-Data
- ```file```: arquivo ```.txt```.
- ```user_id``` (opcional): define o usuário; se ausente, é gerado.

### Resposta
```bash
{
  "status": "success",
  "file_url": "/api/files/arquivo.txt",
  "data": [
    {
      "category": "Produtivo",
      "content": "texto",
      "response": "resposta gerada"
    }
  ],
  "filename": "arquivo.txt",
  "user_id": "abc123",
  "message": "Análise concluída"
}

```
- ```400```: erros como arquivo ausente, extensão inválida, conteúdo inválido ou já existente.
- ```500```: erro interno.

# GET /api/check-session

### Descrição
Verifica se há uma sessão ativa e retorna o ```user_id```.

### Resposta
```bash
{
  "status": "success",
  "user_id": "abc123",
  "authenticated": true
}
```


# POST /api/sync-session

### Descrição
Atualiza ou define  o ```user_id``` na sessão.

### Body (JSON)
```bash
{
  "user_id": "abc123"
}
```

### Resposta
```bash
{
  "status": "success",
  "user_id": "abc123"
}
```
- ```400```: ```user_id``` não fornecido.
- ```500```: erro interno.