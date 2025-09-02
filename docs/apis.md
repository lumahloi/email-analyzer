# APIs

## 1. POST /api/export/<filename>
Exports the generated analysis to an .xlsx file.

### URL Parameters
- Filename: Name of the file whose analysis you want to export.

### Body (JSON)
bash
[
{
"content": "Email text",
"category": "Expected category",
"response": "Suggested response"
}
]

### Response
- Returns an .xlsx file with the structured data.
- 500: Internal error, with a descriptive message.

## 2. GET /api/files
Lists the .txt files uploaded by a user identified in the header.

### Headers
- ```X-User-ID```: User identifier.

### Response
```bash
{
"status": "success",
"files": [{"name": "file.txt", "url": "/api/files/file.txt"}],
"user_id": "id"
}
```
- ```400```: If the ```X-User-ID``` is not provided.
- ```500```: Internal error.

## 3. GET /api/files/<filename>
Reads the contents of a ```.txt``` file of the logged-in user.

### Session
Requires ```user_id``` in the session.

### Response
```bash
{
"status": "success",
"filename": "file.txt",
"contents": "file contents"
}
```
- ```401```: User not authenticated.
- ```404```: File not found.
- ```500```: Internal error.

# 4. GET and DELETE /api/files/<filename>
- ```GET```: Returns the contents of a file.
- ```DELETE```: Deletes the file.

### Session
Requires ```user_id``` in the session.

### Response
Response:
- ```GET```: ```JSON``` with the file contents.
- ```DELETE```: ```{ "success": true }```
- ```400```: Invalid file type.
- ```404```: File not found.
- ```401```: No session.
- ```500```: Internal error.

# 5. DELETE /api/files/<user_id>/<filename>
Deletes the user's file and removes the folder if it is empty.

### URL Parameters
- ```user_id```: User ID.
- ```filename```: File name.

### Response
```bash
{ "success": true }
```
- If folder is removed: Include additional message.
- ```400```: Invalid ID or type.
- ```404```: file not found.
- ```500```: error deleting.

# 6. POST /api/submit
Receives a ```.txt``` file, processes its content in chunks, identifies the category and response, saves it locally, and returns the results.

### Form-Data
- ```file```: ```.txt``` file.
- ```user_id``` (optional): defines the user; if absent, it is generated.

### Response
```bash
{
"status": "success",
"file_url": "/api/files/arquivo.txt",
"data": [
{
"category": "Productive",
"content": "text",
"response": "generated response"
}
],
"filename": "arquivo.txt",
"user_id": "abc123",
"message": "Analysis complete"
}
```
- ```400```: errors such as missing file, invalid extension, invalid or existing content.
- ```500```: internal error.

# 7. GET /api/check-session
Checks for an active session and returns the ```user_id```.

### Response
```bash
{
"status": "success",
"user_id": "abc123",
"authenticated": true
}
```

# 8. POST /api/sync-session
Updates or sets the ```user_id``` in the session.

### Body (JSON)
```bash
{
"user_id": "abc123"
}
```

### Response
```bash
{
"status": "success",
"user_id": "abc123"
}
```
- ```400```: ```user_id``` not provided.
- ```500```: Internal error.
