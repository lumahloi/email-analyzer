import re

def content_txt(file):
    text_content = file.read().decode('utf-8')
    
    raw_emails = re.split(r'=== E-mail \d+ \(.*?\) ===', text_content)
    
    emails = []
    
    for email in raw_emails:
        email = email.strip()
        if not email:
            continue
        
        email = re.sub(
            r'^(From:|De:|To:|Para:|Date:|Data:|Sent:|Assunto:|Subject:).*$',
            '',
            email,
            flags=re.MULTILINE
        )
        
        email = '\n'.join([line.strip() for line in email.splitlines() if line.strip()])
        
        if email:
            emails.append(email)
    
    return emails