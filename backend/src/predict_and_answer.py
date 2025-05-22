from ml_scripts.pre_processing import preprocess, create_bow_vector
from generate_response import generate_response
import joblib

model = joblib.load('backend/src/models/ml_model.pkl')
vocabulary = joblib.load('backend/src/models/vocabulary.pkl')

def predict_category(text_email):
    tokens = preprocess(text_email)
    
    vector = create_bow_vector(tokens, vocabulary)
    
    return model.predict([vector])[0]


    
email = "quero abrir uma conta no banco"

if predict_category(email) == "Produtivo":
    print(generate_response(email))