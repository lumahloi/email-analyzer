from dotenv import load_dotenv
from openai import OpenAI
import os

load_dotenv()

def query_openai(prompt):
    query = f"Gere respostas automáticas para emails de uma empresa do setor financeiro, no setor de suporte lidando diretamente com emails dos clientes. Responda de forma objetiva, formal e direta. Se necessário, analise arquivos anexados. Responda apenas perguntas que são relevantes, caso contrário responda nada. Não insira coisas como 'Seu Nome' ou 'Seu Setor' nem nada parecido que possa identificar quem escreveu o e-mail ou a empresa. email: {prompt}"
    
    try:
        client = OpenAI(api_key=os.environ['OPENAI_KEY'])

        response = client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[{"role": "user", "content": query}],
            temperature=0.3,
            max_tokens=200,
        )

        return response.choices[0].message.content.strip()

    except Exception as e:
        print(f"Erro OpenAI: {e}")
        return "Erro ao processar. Tente reformular sua pergunta."