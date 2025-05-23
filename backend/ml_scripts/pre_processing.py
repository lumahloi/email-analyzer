import os
import nltk
import json
import re

# Configuração explícita do caminho NLTK
nltk_data_path = os.path.join(os.path.dirname(__file__), '..', 'nltk_data')
nltk.data.path.append(nltk_data_path)

# Verificação dos recursos
try:
    nltk.data.find('tokenizers/punkt')
    nltk.data.find('corpora/stopwords')
    nltk.data.find('corpora/wordnet')
except LookupError as e:
    print("❌ Erro ao carregar recursos NLTK:")
    print(f"Caminho configurado: {nltk_data_path}")
    print(f"Conteúdo da pasta: {os.listdir(nltk_data_path)}")
    print(f"Paths procurados: {nltk.data.path}")
    raise

# Restante do seu código...

from nltk.stem import WordNetLemmatizer
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords

base_dir = os.path.dirname(os.path.abspath(__file__))
json_path = os.path.join(base_dir, '..', 'data', 'example_emails.json')

def preprocess(email):
    words_in_email = word_tokenize(email.lower())
    
    removed_pontuation = [re.sub(r'[^\w\s]', '', word) for word in words_in_email if re.sub(r'[^\w\s]', '', word)]
    
    stop_words = set(stopwords.words("portuguese"))
    
    removed_stopwords = [word for word in removed_pontuation if word.casefold() not in stop_words]

    lemmatizer = WordNetLemmatizer()
    
    lemmatized_words = [lemmatizer.lemmatize(word) for word in removed_stopwords]
        
    return lemmatized_words

def create_bow_vector(sentence, vocab):
    vector = [0] * len(vocab)
    
    for word in sentence:
        if word in vocab:
            idx = vocab.index(word) 
            vector[idx] += 1
            
    return vector

def create_vocabulary(processed_emails):
    vocabulary = set()
    
    for sentence in processed_emails: vocabulary.update(sentence)
    return sorted(list(vocabulary))

def process_emails(emails):
    return [preprocess(email['Assunto'] + " " + email['Corpo']) for email in emails]

with open(json_path, encoding='utf-8') as file:
    emails_data = json.load(file)
    processed_emails = process_emails(emails_data)
    vocabulary = create_vocabulary(processed_emails)
    bow_vectors = [create_bow_vector(sentence, vocabulary) for sentence in processed_emails]

emails = emails_data
vocabulary = vocabulary
bow_vectors = bow_vectors