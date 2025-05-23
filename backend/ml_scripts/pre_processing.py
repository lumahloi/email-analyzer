import os
import nltk
import json
import re

nltk_data_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'nltk_data'))
nltk.data.path.append(nltk_data_path)

print(f"🛠️ NLTK data path: {nltk_data_path}")
print(f"📁 Conteúdo: {os.listdir(nltk_data_path)}")

try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    print("⚠️ Punkt não encontrado, tentando download...")
    try:
        nltk.download('punkt', download_dir=nltk_data_path)
    except Exception as e:
        print(f"❌ Falha no download: {e}")
    raise

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



with open(json_path, encoding='utf-8') as file:
    emails = json.load(file)

processed_emails = [preprocess(email['Assunto'] + " " + email['Corpo']) for email in emails]

file.close()

vocabulary = create_vocabulary(processed_emails)

bow_vectors = [create_bow_vector(sentence, vocabulary) for sentence in processed_emails]