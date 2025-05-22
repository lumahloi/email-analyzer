from ml_scripts.pre_processing import preprocess, create_bow_vector
import joblib

def predict_category(text_email):
    tokens = preprocess(text_email)
    
    vector = create_bow_vector(tokens, vocabulary)
    
    return model.predict([vector])[0]



model = joblib.load('backend/src/models/ml_model.pkl')

vocabulary = joblib.load('backend/src/models/vocabulary.pkl')
    
email = "odeio vcs pior banco de todos"

category = predict_category(email)

print(f"Categoria prevista: {category}")
