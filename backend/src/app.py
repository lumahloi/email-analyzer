from generate_response import generate_response
from predict_category import predict_category
from email_content import email_content
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
        if 'file' not in request.files:
            return jsonify({'error': 'Arquivo PDF não fornecido.'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'Nome do arquivo vazio.'}), 400
        
        content = email_content(file)
        
        category = predict_category(content)
        
        if category != "Produtivo":
            response = jsonify({'category': category, 'content': content})
            response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response, 200
        
        # response = jsonify({'response': generate_response(content), 'category': category})
        response = jsonify({'category': category})
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Origin', '*')
        
        return response, 200
    
    except Exception:
        return jsonify({'error': 'Erro interno do servidor.'}), 500