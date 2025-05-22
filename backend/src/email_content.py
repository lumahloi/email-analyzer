import re

def content_txt(file):
    # Lê o conteúdo do arquivo TXT
    text_content = file.read().decode('utf-8')
    
    # Divide o texto em e-mails individuais usando os delimitadores ===
    raw_emails = re.split(r'=== E-mail \d+ \(.*?\) ===', text_content)
    
    emails = []
    
    for email in raw_emails:
        email = email.strip()
        if not email:
            continue
            
        # Remove metadados do cabeçalho (From, To, Date, etc.)
        # Padrão para remover linhas que começam com campos de metadados comuns
        email = re.sub(
            r'^(From:|De:|To:|Para:|Date:|Data:|Sent:|Assunto:|Subject:).*$',
            '',
            email,
            flags=re.MULTILINE
        )
        
        # Remove linhas vazias e espaços extras
        email = '\n'.join([line.strip() for line in email.splitlines() if line.strip()])
        
        if email:
            emails.append(email)
    
    return emails