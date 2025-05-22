from pypdf import PdfReader
import re

def email_content_pdf(file):
    #TODO: email across pages
    
    reader = PdfReader(file)
    
    full_text = ""

    for page in reader.pages:
        text = page.extract_text()
        
        if text:
            full_text += "\n" + text

    if not full_text:
        return []

    email_blocks = re.split(
        r"(?=^[^\n]+<[^>]+>\s+\w{3},\s+\w{3}\s+\d{1,2},\s+\d{4}\s+at\s+\d{1,2}:\d{2}\s+[AP]M\s*\nTo:\s+[^\n]+<[^>]+>)",
        full_text,
        flags=re.MULTILINE
    )

    results = []

    for block in email_blocks:
        
        block = block.strip()
        
        if not block:
            continue

        if not re.match(r"^[^\n]+<[^>]+>\s+\w{3},\s+\w{3}\s+\d{1,2},\s+\d{4}\s+at\s+\d{1,2}:\d{2}\s+[AP]M", block, re.MULTILINE):
            continue

        match = re.search(
            r"^.*To:\s+[^\n]+<[^>]+>\s*(.*?)(?=\s*Gmail\s*-|$)",
            block,
            flags=re.DOTALL
        )
        
        if match:
            content = match.group(1).strip()
            
            if content:
                results.append(content)

    return results