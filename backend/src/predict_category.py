from ml_scripts.pre_processing import preprocess, create_bow_vector
import joblib, os

base_dir = os.path.dirname(os.path.abspath(__file__))
json_path = os.path.join(base_dir, 'models')

model = joblib.load(json_path + '/ml_model.pkl')
vocabulary = joblib.load(json_path + '/vocabulary.pkl')

def predict_category(text_email):
    tokens = preprocess(text_email)
    
    vector = create_bow_vector(tokens, vocabulary)
    
    return model.predict([vector])[0]