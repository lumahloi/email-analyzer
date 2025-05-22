from nltk.stem import WordNetLemmatizer
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
import json, re

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



file = open('backend/src/data/example_emails.json')

emails = json.load(file)

processed_emails = [preprocess(email['Assunto'] + " " + email['Corpo']) for email in emails]

file.close()

vocabulary = create_vocabulary(processed_emails)

bow_vectors = [create_bow_vector(sentence, vocabulary) for sentence in processed_emails]