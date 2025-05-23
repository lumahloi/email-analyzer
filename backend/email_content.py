import re

def content_txt(file):
    text_content = file.read().decode('utf-8')
    emails = []

    pattern_descricao = re.compile(
        r'(Assunto:\s*(.+?)\s*\nDescrição:\s*(.+?))(?=\nAssunto:|\Z)',
        re.DOTALL | re.IGNORECASE
    )

    pattern_corpo = re.compile(
        r'(Assunto:\s*(.+?)\s*\nCorpo:\s*(.+?))(?=\nAssunto:|\Z)',
        re.DOTALL | re.IGNORECASE
    )

    pattern_structured = re.compile(
        r'(E-mail\s+\d+:\s*Assunto:\s*(.+?)\s*Conteúdo:\s*(.+?)\s*---)',
        re.DOTALL | re.IGNORECASE
    )

    pattern_email_subject = re.compile(
        r'^\d+\.\s*(\S+@\S+)\s*-\s*(.+?)\s*$',
        re.MULTILINE
    )

    pattern_direct = re.compile(
        r'Email:\s*(.+)',
        re.IGNORECASE
    )

    for pattern in [pattern_descricao, pattern_corpo, pattern_structured]:
        matches = pattern.findall(text_content)
        for full_block, subject, body in matches:
            formatted_email = f"From: cliente\nSubject: {subject.strip()}\n\n{body.strip()}"
            emails.append(formatted_email)
            text_content = text_content.replace(full_block, '')

    matches_email_subject = pattern_email_subject.findall(text_content)
    for email_addr, subject in matches_email_subject:
        formatted_email = f"From: {email_addr.strip()}\nSubject: {subject.strip()}\n\n{subject.strip()}"
        emails.append(formatted_email)
    text_content = pattern_email_subject.sub('', text_content)

    matches_direct = pattern_direct.findall(text_content)
    for body in matches_direct:
        formatted_email = f"From: cliente\nSubject: (sem assunto)\n\n{body.strip()}"
        emails.append(formatted_email)
    text_content = pattern_direct.sub('', text_content)

    return emails
