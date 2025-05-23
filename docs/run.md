# Como rodar localmente
Passo a passo de como rodar o projeto localmente na sua máquina.

## Pré-requisitos
- **Git**: instale a versão mais recente oficial clicando [aqui](https://git-scm.com/downloads);
- **Python**: instale a versão mais recente oficial clicando [aqui](https://www.python.org/downloads/);

## Instalação
Primeiro, clone o repositório.
```bash
git clone https://github.com/lumahloi/email-analyzer/
```

Navegue até o diretório ```backend```.
```bash
cd backend
```

Crie o ambiente virtual.
```bash
python -m venv venv
```

Instale as dependências do ``backend``.
```bash
pip install -r requirements.txt
```

## Variáveis de ambiente
No arquivo ```.env.example``` é possível visualizar as variáveis de ambiente.
- Crie o arquivo ```.env``` na pasta ```backend``` e atribue valor à variável ```GEMINI_KEY```.

## Rodando localmente
Abra um terminal e rode o servidor ```frontend``` no diretório ```frontend```.
```bash
cd frontend
python -m http.server 8000
```

Abra outro terminal e rode o servidor ```backend``` no diretório ```backend```.
```bash
cd ../backend
flask --app app run
```
