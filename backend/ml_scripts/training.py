from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split
from pre_processing import bow_vectors, emails, vocabulary
from sklearn.naive_bayes import GaussianNB
import joblib

labels = [email['Categoria'] for email in emails]
    
X_train, X_test, y_train, y_test = train_test_split(
    bow_vectors, labels, test_size=0.2, random_state=42
)
    
model = GaussianNB()
    
model.fit(X_train, y_train)
    
predictions = model.predict(X_test)
    
accuracy = accuracy_score(y_test, predictions)

# print("Acurácia:", accuracy)
# print("\nRelatório de Classificação:")
# print(classification_report(y_test, predictions))

joblib.dump(model, 'backend/src/models/ml_model.pkl')
joblib.dump(vocabulary, 'backend/src/models/vocabulary.pkl')