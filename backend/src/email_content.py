from pypdf import PdfReader
import re

def email_content(file):
    reader = PdfReader(file)
    page = reader.pages[0]
    text = page.extract_text()

    if not text:
        return ""

    # Remove o cabeçalho com remetente, data e destinatário
    text = re.sub(
        r".*?<.*?>\s+\w{3},\s+\w+\s+\d{1,2},\s+\d{4}\s+at\s+\d{1,2}:\d{2}\s+[AP]M\s+To:.*?<.*?>\s*",
        "",
        text,
        flags=re.DOTALL
    )

    # Divide o texto por quebras de linha duplas
    parts = text.split("\n\n")

    if len(parts) > 1:
        # Assume que o corpo do e-mail começa após os cabeçalhos
        body = "\n\n".join(parts[1:]).strip()
    else:
        # Caso não haja separação clara, retorna tudo
        body = text.strip()

    # Divide o corpo em linhas
    body_lines = body.splitlines()

    # Remove tudo após rodapé/URL
    final_lines = []
    for line in body_lines:
        if re.search(r"(Gmail -|https?://|1 of 1\s+\d{2}/\d{2}/\d{4})", line):
            break
        final_lines.append(line)

    # Junta novamente em uma string
    body_clean = "\n".join(final_lines).strip()

    print(body_clean)
    return body_clean
