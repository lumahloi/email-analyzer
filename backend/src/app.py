from generate_response import generate_response
from predict_category import predict_category
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)

CORS(app, resources={r"/api/*": {
    "allow_headers": ["Content-Type", "Access-Control-Allow-Headers", "Access-Control-Allow-Origin"],
    "allow_methods": ["POST", "OPTIONS"]
}})

@app.route("/api/submit", methods=["POST", "OPTIONS"])
def handle_query():
    try:
        #TODO: handle file uploads
        data = request.get_json()
        if not data or 'email' not in data:
            return jsonify({'error': 'Email não fornecido.'}), 400
        
        email = data['email']
        
        category = predict_category(email)

        if category != "Produtivo":
            return jsonify({'category': category}), 200
        
        response = jsonify({'response': generate_response(email), 'category': category})
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Origin', '*')
        
        print(email)
        print(category)
        print(response)
        
        return response, 200
    
    except Exception:
        return jsonify({'error': 'Erro interno do servidor.'}), 500