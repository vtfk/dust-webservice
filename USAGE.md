# dust-nodejswebservice

Local web service for calling scripts for DUST.

<br/>

## Usage

🗝 &nbsp; Authenticate using [jwt bearer token](https://en.wikipedia.org/wiki/JSON_Web_Token). Ask *@NoenAndré* if you need access.<br/>
⚠️ &nbsp; **`args`** in JSON body is optional, but must be of type **`object`** if provided.

<br/>

## API endpoints

### ``GET /:service/invoke``

```json
{
  "fileName": "ScriptFileName.ps1",
  "args": {
    "SamAccountName": "sak8976",
    "Properties": [
      "title",
      "mail"
    ],
  }
}
```

### ``GET /invoke/psfile``

```json
{
  "filePath": "C:\\FullPath\\To\\ScriptFileName.ps1",
  "args": {
    "SamAccountName": "sak8976",
    "Properties": [
      "title",
      "mail"
    ],
  }
}
```
