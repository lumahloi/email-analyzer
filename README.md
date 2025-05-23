# Email Analyzer
Você tem uma empresa no setor financeiro e já se sentiu sobrecarregada(o) com uma caixa de entrada cheia de e-mails? Pensando nisso, desenvolvi o **Email Analyzer**, uma aplicação inteligente que automatiza a triagem e resposta de e-mails, oferecendo uma solução prática para aumentar a produtividade. 

## Screenshots
![Home](./docs/screenshots/home.png)
![Tela de análise do arquivo](./docs/screenshots/File.png)

## Funcionalidades
A aplicação recebe um arquivo .txt contendo diversos e-mails. A partir desse conteúdo, ela realiza três tarefas principais:
- Leitura e análise de cada e-mail;
- Classificação automática dos e-mails em duas categorias:
  - **Produtivo**: requer atenção ou ação
  - **Improdutivo**: irrelevante ou sem valor prático
- Geração de resposta automática para e-mails considerados produtivos, economizando tempo e facilitando a comunicação. 

## Como rodar localmente
Passo a passo de como rodar o projeto localmente na sua máquina.

### Pré-requisitos
- **Git**: instale a versão mais recente oficial clicando [aqui](https://git-scm.com/downloads);
- **Python**: instale a versão mais recente oficial clicando [aqui](https://www.python.org/downloads/);

### Instalação
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

### Variáveis de ambiente
No arquivo ```.env.example``` é possível visualizar as variáveis de ambiente.
- Crie o arquivo ```.env``` na pasta ```backend``` e atribue valor à variável ```GEMINI_KEY```.

### Rodando localmente
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


## APIs
A documentação dos endpoints está disponível [aqui](./docs/apis.md);

## Possíveis melhorias
- [] Adicionar modais de carregamento;
- [] Permitir criação de contas;
- [] Melhorar a categorização dos emails;
- [] Melhorar as respostas geradas;
- [] Adicionar mais padrões para o algoritmo de extração dos conteúdos dos emails.

## Autora
<img src="https://github.com/lumahloi.png" width="80" align="left"/>

***Lumah Pereira***


[![LinkedIn](https://custom-icon-badges.demolab.com/badge/LinkedIn-0A66C2?logo=linkedin-white&logoColor=fff)](https://www.linkedin.com/in/lumah-pereira) [![GitHub](https://img.shields.io/badge/GitHub-%23121011.svg?logo=github&logoColor=white)](https://www.github.com/lumahloi) [![Portfolio](https://img.shields.io/badge/Portfolio-D47CBC.svg?logo=vercel&logoColor=white)](https://www.lumah-pereira.vercel.app)
