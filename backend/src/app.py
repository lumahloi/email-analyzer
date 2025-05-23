from generate_response import generate_response
from predict_category import predict_category
from werkzeug.utils import secure_filename
from flask import Flask, jsonify, request
from email_content import content_txt
from flask_cors import CORS
import os

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'txt'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

CORS(app, resources={
    r"/api/*": {
        "allow_headers": "*",
        "allow_methods": ["GET", "POST", "DELETE", "OPTIONS", "PUT"],
        "allow_origins": "*"
    }
})



def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS



@app.route("/api/files", methods=["GET"])
def list_files():
    try:
        if not os.path.exists(UPLOAD_FOLDER):
            os.makedirs(UPLOAD_FOLDER)
            return jsonify({
                'status': 'success',
                'message': 'Nenhum arquivo encontrado',
                'files': []
            })

        files = []
        for filename in os.listdir(UPLOAD_FOLDER):
            if allowed_file(filename):
                files.append({
                    'name': filename,
                    'url': f"/api/files/{filename}"
                })

        return jsonify({
            'status': 'success',
            'files': files
        })

    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': 'Erro ao listar arquivos',
            'details': str(e)
        }), 500



@app.route("/api/files/<filename>", methods=["GET"])
def get_file(filename):
    if not allowed_file(filename):
        return jsonify({'error': 'Tipo de arquivo não permitido'}), 400
    
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(filename))
    
    if not os.path.exists(filepath):
        return jsonify({'error': 'Arquivo não encontrado'}), 404
    
    with open(filepath, 'r') as f:
        content = f.read()
    
    return jsonify({
        'status': 'success',
        'name': filename,
        'content': open(filepath, 'r').read(),
        'message': 'Arquivo encontrado'
    })
    
    
    
@app.route("/api/files/<filename>", methods=["DELETE"])
def delete_file(filename):
    if not allowed_file(filename):
        return jsonify({'error': 'Tipo de arquivo não permitido'}), 400
    
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(filename))
    
    if not os.path.exists(filepath):
        return jsonify({'error': 'Arquivo não encontrado'}), 404
    
    os.remove(filepath)
    return jsonify({'success': True})




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
                'content': content,
            }
            if category == "Produtivo":
                # item['response'] = generate_response(content)
                item['response'] = 'a'
            response_data.append(item)

        response = jsonify(response_data)
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Origin', '*')
        
        filename = secure_filename(file.filename)
        
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        file.save(filepath)

        return jsonify({
            'status': 'success',
            'file_url': f"/api/files/{filename}",
            'data': response_data,
            'filename': filename,
            'message': 'Análise concluída com sucesso'
        }), 200

    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': 'Erro interno do servidor',
            'details': str(e)
        }), 500