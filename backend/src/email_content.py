from pypdf import PdfReader
import re

def email_content_pdf(file):
    reader = PdfReader(file)
    
    all_bodies = []

    for page in reader.pages:
        text = page.extract_text()
        
        if not text:
            continue

        text = re.sub(
            r".*?<.*?>\s+\w{3},\s+\w+\s+\d{1,2},\s+\d{4}\s+at\s+\d{1,2}:\d{2}\s+[AP]M\s+To:.*?<.*?>\s*",
            "",
            text,
            flags=re.DOTALL
        )

        parts = text.split("\n\n")
        
        if len(parts) > 1:
            body = "\n\n".join(parts[1:]).strip()
            
        else:
            body = text.strip()

        body_lines = body.splitlines()

        final_lines = []
        
        for line in body_lines:
            if re.search(r"(Gmail -|https?://|1 of 1\s+\d{2}/\d{2}/\d{4})", line):
                break
            
            final_lines.append(line)

        page_body = "\n".join(final_lines).strip()
        if page_body:
            all_bodies.append(page_body)

    full_body = "\n\n".join(all_bodies).strip()
    return full_body
