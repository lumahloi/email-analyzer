from ml_scripts.pre_processing import nltk_data_path
from flask import Flask, jsonify, request, make_response, session
# from generate_response import generate_response
from predict_category import predict_category
from werkzeug.utils import secure_filename
from email_content import content_txt
from query_openai import query_openai
import os, xlsxwriter, io, uuid
from flask_cors import CORS

app = Flask(__name__)
app.secret_key = os.urandom(24).hex()

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'txt'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True,
     methods=["GET", "POST", "DELETE", "OPTIONS"],
     allow_headers=["Content-Type", "X-User-ID"])




def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS



@app.route("/api/export/<filename>", methods=["POST"])
def export_analysis(filename):
    try:
        data = request.get_json() 
        base_filename = os.path.splitext(filename)[0]
        
        if not data:
            return jsonify({'status': 'error', 'message': 'Nenhum dado disponível para exportação'}), 404
        
        output = io.BytesIO()
        workbook = xlsxwriter.Workbook(output)
        worksheet = workbook.add_worksheet()
        
        headers = ['Ordem', 'Conteúdo', 'Categoria', 'Resposta sugerida']
        
        for col, header in enumerate(headers):
            worksheet.write(0, col, header)
            
        for row, item in enumerate(data, start=1):
            worksheet.write(row, 0, row)
            worksheet.write(row, 1, item.get('content', ''))
            worksheet.write(row, 2, item.get('category', ''))
            worksheet.write(row, 3, item.get('response', 'N/A'))
        
        workbook.close()
        output.seek(0)
        
        response = make_response(output.getvalue())
        response.headers['Content-Type'] = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        response.headers['Content-Disposition'] = f'attachment; filename={base_filename}.xlsx'
        
        return response

    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': 'Erro ao gerar arquivo Excel',
            'details': str(e)
        }), 500



@app.route("/api/files", methods=["GET"])
def list_files():
    try:
        user_id = request.headers.get("X-User-ID")
        if not user_id:
            return jsonify({
                'status': 'error',
                'message': 'user_id não fornecido no cabeçalho',
                'files': []
            }), 400
            
        user_upload_dir = os.path.join(app.config['UPLOAD_FOLDER'], user_id)

        if not os.path.exists(user_upload_dir):
            os.makedirs(user_upload_dir)
            return jsonify({
                'status': 'success',
                'message': 'Nenhum arquivo encontrado',
                'files': [],
                'user_id': user_id
            })

        files = []
        for filename in os.listdir(user_upload_dir):
            if allowed_file(filename):
                files.append({
                    'name': filename,
                    'url': f"/api/files/{filename}"
                })

        return jsonify({
            'status': 'success',
            'files': files,
            'user_id': user_id
        })

    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': 'Erro ao listar arquivos',
            'details': str(e)
        }), 500



@app.route("/api/files/<filename>", methods=["GET"])
def get_file(filename):
    try:
        if 'user_id' not in session:
            return jsonify({'status': 'error', 'message': 'Usuário não autenticado'}), 401
            
        user_id = session['user_id']
        user_upload_dir = os.path.join(app.config['UPLOAD_FOLDER'], user_id)
        filepath = os.path.join(user_upload_dir, filename)
        
        if not os.path.exists(filepath):
            return jsonify({'status': 'error', 'message': 'Arquivo não encontrado'}), 404
            
        with open(filepath, 'r') as f:
            contents = f.read()
            
        return jsonify({
            'status': 'success',
            'filename': filename,
            'contents': contents
        }), 200
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': 'Erro ao ler arquivo',
            'details': str(e)
        }), 500   
    


@app.route("/api/files/<filename>", methods=["GET", "DELETE"])
def handle_file(filename):
    if 'user_id' not in session:
        return jsonify({'error': 'Usuário não identificado'}), 401
        
    if not allowed_file(filename):
        return jsonify({'error': 'Tipo de arquivo não permitido'}), 400
    
    user_id = session['user_id']
    user_upload_dir = os.path.join(app.config['UPLOAD_FOLDER'], user_id)
    filepath = os.path.join(user_upload_dir, secure_filename(filename))
    
    if not os.path.exists(filepath):
        return jsonify({'error': 'Arquivo não encontrado'}), 404
    
    if request.method == 'GET':
        with open(filepath, 'r') as f:
            content = f.read()
        return jsonify({
            'status': 'success',
            'name': filename,
            'content': content,
            'message': 'Arquivo encontrado'
        })
    elif request.method == 'DELETE':
        os.remove(filepath)
        return jsonify({'success': True})


    
@app.route("/api/files/<user_id>/<filename>", methods=["DELETE"])
def delete_file(user_id, filename):
    if not user_id:
        return jsonify({'error': 'user_id não fornecido'}), 400

    if not allowed_file(filename):
        return jsonify({'error': 'Tipo de arquivo não permitido'}), 400

    user_upload_dir = os.path.join(app.config['UPLOAD_FOLDER'], user_id)
    filepath = os.path.join(user_upload_dir, secure_filename(filename))
    print("Verificando caminho:", filepath)

    if not os.path.exists(filepath):
        return jsonify({'error': 'Arquivo não encontrado'}), 404

    try:
        os.remove(filepath)
        
        if os.path.exists(user_upload_dir) and not os.listdir(user_upload_dir):
            try:
                os.rmdir(user_upload_dir)
                return jsonify({'success': True, 'message': 'Arquivo excluído e pasta removida por estar vazia'})
            except Exception as e:
                return jsonify({'success': True, 'message': 'Arquivo excluído, mas não foi possível remover a pasta vazia', 'details': str(e)})
        
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': 'Erro ao excluir o arquivo', 'details': str(e)}), 500




@app.route("/api/submit", methods=["POST", "OPTIONS"])
def handle_query():
    try:
        if 'file' not in request.files:
            return jsonify({'status': 'error', 'message': 'Arquivo TXT não fornecido'}), 400

        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'status': 'error', 'message': 'Nome do arquivo vazio, tente novamente.'}), 400
            
        filename = secure_filename(file.filename)
        
        if not filename.lower().endswith('.txt'):
            return jsonify({'status': 'error', 'message': 'Apenas arquivos com extensão .txt são permitidos.'}), 400

        contents = content_txt(file)
        if not contents:
            return jsonify({'status': 'error', 'message': 'O arquivo está vazio ou não contém dados válidos.'}), 400

        if 'user_id' not in session:
            frontend_user_id = request.form.get('user_id')
            session['user_id'] = frontend_user_id if frontend_user_id else str(uuid.uuid4())
            
        user_id = session['user_id']
        user_upload_dir = os.path.join(app.config['UPLOAD_FOLDER'], user_id)
        os.makedirs(user_upload_dir, exist_ok=True)

        filepath = os.path.join(user_upload_dir, filename)
        
        if os.path.exists(filepath):
            return jsonify({'status': 'error', 'message': 'Arquivo já existe'}), 400

        response_data = []
        for content in contents:
            category = predict_category(content)
            item = {
                'category': category,
                'content': content,
            }
            if category == "Produtivo":
                # item['response'] = generate_response(content)
                item['response'] = query_openai(content)
                # item['response'] = 'a'
            response_data.append(item)

        file.seek(0)
        file.save(filepath)

        return jsonify({
            'status': 'success',
            'file_url': f"/api/files/{filename}",
            'data': response_data,
            'filename': filename,
            'user_id': user_id, 
            'message': 'Análise concluída'
        }), 200

    except Exception as e:
        app.logger.error(f"Erro ao processar arquivo: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'Erro interno do servidor',
            'details': str(e)
        }), 500
        
        

@app.route("/api/check-session", methods=["GET"])
def check_session():
    return jsonify({
        'status': 'success',
        'user_id': session.get('user_id'),
        'authenticated': 'user_id' in session
    }), 200
    
    

@app.route("/api/sync-session", methods=["POST"])
def sync_session():
    try:
        data = request.get_json()
        if not data or 'user_id' not in data:
            return jsonify({'status': 'error', 'message': 'user_id não fornecido'}), 400
            
        session['user_id'] = data['user_id']
        return jsonify({'status': 'success', 'user_id': session['user_id']}), 200
        
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500