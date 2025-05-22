from generate_response import generate_response
from predict_category import predict_category
from email_content import content_txt
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
            return jsonify({'error': 'Arquivo TXT não fornecido, tente novamente.'}), 400

        file = request.files['file']

        if file.filename == '':
            return jsonify({'error': 'Nome do arquivo vazio, tente novamente.'}), 400

        contents = content_txt(file)

        response_data = []
        
        for content in contents:
            category = predict_category(content)
            item = {
                'category': category,
            }
            if category == "Produtivo":
                # item['response'] = generate_response(content)
                item['response'] = 'a'
            response_data.append(item)

        response = jsonify(response_data)
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200

    except Exception as e:
        return jsonify({'error': 'Erro interno do servidor.'}), 500