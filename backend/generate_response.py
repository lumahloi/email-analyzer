from dotenv import load_dotenv
from google.genai import types
from google import genai
import os

load_dotenv()

client = genai.Client(api_key=os.getenv('GEMINI_KEY'))

def generate_response(email):
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        config=types.GenerateContentConfig(
            system_instruction = "Atue como um assistente que gera respostas automáticas para emails de uma empresa do setor financeiro, no setor de suporte lidando diretamente com emails dos clientes. Responda de forma objetiva, formal e direta. Se necessário, analise arquivos anexados. Responda apenas perguntas que são relevantes, caso contrário responda ''",
            max_output_tokens = 500,
            temperature = 0.6,
        ),
        contents=email,
    )
    
    return response.text