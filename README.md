# dust-nodejsWebservice

Local web service for DUST (nodejs)

## IIS setup

1.	Add IIS to a Windows 2012/2016/2019 server
1.	Install [nodejs](https://nodejs.org/en/download/)
1.	Install [URL Rewrite](https://www.microsoft.com/web/handlers/webpi.ashx?command=getinstallerredirect&appid=urlrewrite2) to IIS
1.	Install [Application Request Routing](https://www.microsoft.com/web/handlers/webpi.ashx?command=getinstallerredirect&appid=ARRv3_0) to IIS
1.	Configure [Reverse Proxy in IIS](https://tecadmin.net/set-up-reverse-proxy-using-iis/)

## Setup repo

```bash
git clone https://github.com/vtfk/dust-nodejswebservice.git
cd dust-nodejswebservice
npm i
```

## Setup environment variables

Create a `.env` file:

```bash
EXPRESS_PORT=3000
MAX_BUFFER=10240000
DUST_PATH=<local-full-path-to-folder-containing-the-scripts>
```

`MAX_BUFFER` is total bytes to accept in stdout

## Usage

**`args` in JSON body is optional, but must be of type `object` if given**

### `/:service/invoke`

This dynamic endpoint accepts for now only `dust`

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

### `/invoke/psfile`

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
