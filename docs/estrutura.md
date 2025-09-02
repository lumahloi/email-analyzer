# Project Structure
```bash
email-analyzer/
├── backend/ → Flask code
│ ├── data/
│ │ └── example_emails.json → list of emails used to train the model
│ │
│ ├── ml_scripts/
│ │ ├── pre_processing.py → responsible for preparing the email to send for model analysis
│ │ └── training.py → given a change in example_emails.json, run training
│ │
│ ├── models/
│ │ ├── ml_model.pkl → trained model
│ │ └── vocabulary.pkl → vectorized vocabulary
│ │
│ ├── nltk_data/ ... → module required for ML
│ │
│ ├── uploads/ ... → where files are stored
│ │
│ ├── app.py → endpoints
│ │
│ ├── email_content.py → extracts email content
│ │
│ ├── generate_response.py → connects to the Google Gemini API and receives response
│ │
│ ├── predict_category.py → submits the email content for model analysis
│ │
│ └── requirements.txt
│
├── docs/ ... → documentation
│
├── emails_test_files/ ... → example .txt files that can be used on the website
│
├── frontend/
│ ├── scripts/
│ │ ├── analysis.js → retrieves the file's analysis
│ │ ├── analyzer.js → submits the file for analysis Analysis
│ │ ├── components.js → dynamic components and other visual settings
│ │ ├── deleteFiles.js → deleting uploaded files
│ │ └── listFiles.txt → listing uploaded files
│ │
│ ├── styles/ ...
│ ├── analysis.html → analysis page
│ └── index.html
│
├── .env.example → .env example
├── .gitignore
└── README.MD
```
