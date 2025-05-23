# Estrutura do projeto
```bash
    email-analyzer/
    ├── backend/                      → código Flask
    │   ├── data/
    │   │   └── example_emails.json   → lista de e-mails usados para treinar o modelo
    │   │
    │   ├── ml_scripts/
    │   │   ├── pre_processing.py     → responsável pela preparação do e-mail para enviar à análise do modelo
    │   │   └── training.py           → dada mudança em example_emails.json, executar treinamento
    │   │
    │   ├── models/
    │   │   ├── ml_model.pkl          → modelo treinado
    │   │   └── vocabulary.pkl        → vocabulário vetorizado
    │   │
    │   ├── nltk_data/ ...            → módulo necessário para o ML
    │   │
    │   ├── uploads/ ...              → onde os arquivos são armazenados
    │   │
    │   ├── app.py                    → endpoints
    │   │
    │   ├── email_content.py          → extrai o conteúdo dos emails
    │   │
    │   ├── generate_response.py      → conecta ao Google Gemini API e recebe resposta
    │   │
    │   ├── predict_category.py       → submete o conteúdo do email à análise do modelo
    │   │
    │   └── requirements.txt
    │   
    ├── docs/ ...                     → documentação
    │  
    ├── emails_test_files/ ...        → arquivos .txt exemplo que podem ser usados no site
    │  
    ├── frontend/ 
    │   ├── scripts/
    │   │   ├── analysis.js           → recupera análise do arquivo
    │   │   ├── analyzer.js           → submete o arquivo à análise
    │   │   ├── components.js         → componentes dinâmicos e outras configurações visuais
    │   │   ├── deleteFiles.js        → deleção de arquivos enviados
    │   │   └── listFiles.txt         → listagem de arquivos enviados
    │   │
    │   ├── styles/ ...
    │   ├── analysis.html             → página da análise
    │   └── index.html
    │  
    ├── .env.example                  → exemplo de .env
    ├── .gitignore
    └──  README.MD
```