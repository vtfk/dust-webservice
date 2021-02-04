[![Build Status](https://dev.azure.com/vtfk/DUST/_apis/build/status/vtfk.dust-webservice?branchName=main)](https://dev.azure.com/vtfk/DUST/_build/latest?definitionId=3&branchName=main)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# dust-webservice

Local web service for calling scripts for DUST.

## IIS setup

1.	Add IIS to a Windows 2012/2016/2019 server
1.	Install [nodejs](https://nodejs.org/en/download/)
1.	Install [URL Rewrite](https://www.microsoft.com/web/handlers/webpi.ashx?command=getinstallerredirect&appid=urlrewrite2) to IIS
1.	Install [Application Request Routing](https://www.microsoft.com/web/handlers/webpi.ashx?command=getinstallerredirect&appid=ARRv3_0) to IIS
1.	Configure [Reverse Proxy in IIS](https://tecadmin.net/set-up-reverse-proxy-using-iis/)

## Setup repo

```bash
git clone https://github.com/vtfk/dust-webservice.git
cd dust-webservice
npm i
```

## Setup environment variables

Create a `.env` file in the cloned repo:

```bash
EXPRESS_PORT=3000
MAX_BUFFER=10240000
ACCEPTED_PATH_ROOT=<local-full-path-to-folder>
DUST_PATH=<local-full-path-to-folder-containing-the-scripts>
JWT_SECRET=<SuperDuperSecretSecretKey>
PAPERTRAIL_HOST=logs.example.com
PAPERTRAIL_PORT=port
PAPERTRAIL_HOSTNAME=<coolname>
NODE_ENV=production
```

`MAX_BUFFER` is total bytes to accept in stdout

Set `ACCEPTED_PATH_ROOT` to the root path of where all scripts are stored. All scripts to be invoked must be directly inside the root path or in any number of sub folders.

Set `JWT_SECRET` to a super duper secret 🗝 &nbsp; to enable JWT token auth. To disable, remove this configuration

Add `PAPERTRAIL_*` and `NODE_ENV` to enable papertrails logging

## Start webservice on Windows startup

The user that will be running the webservice needs to have local administrative privileges to setup the Windows Service.

After the service is setup, the user no longer needs administrative privileges

1. Install [PM2 (A Process Manager for node.js)](https://pm2.keymetrics.io/) **(Must be run with the user that will be running the webservice)**
    1. `npm install -g pm2`
1. Move `PM2 home` to `D:\PM2`
    1. Create a new folder `D:\PM2`
    1. Create a new **System level environment variable** `PM2_HOME` and set it to `D:\PM2`
    1. Open a new `cmd` and verify that `PM2_HOME` is set correctly by running `echo %PM2_HOME%`
1. Start the webservice in `pm2` and save the current process list
    1. Open a new `cmd`
    1. Navigate to the folder containing the webservice you cloned
    1. Start the webservice in `pm2` by running `pm2 start index.js`
    1. If all goes well, you should see a table containing your service and it should have it's `status` set to `online`
    1. To save the current process list, run `pm2 save`
    1. You should see `Successfully saved in D:\PM2\dump.pm2`
1. Install [pm2-windows-service](https://www.npmjs.com/package/pm2-windows-service) **(Must be run with the user that will be running the webservice)**
    1. `npm install -g pm2-windows-service`
    1. Open a new `cmd` **as administrator** (this must be with the same user that will be running the webservice!)
        1. `pm2-service-install -n DUST`
            1. `? Perform environment setup (recommended)`: Yes
            1. `? Set PM2_HOME`: Yes
            1. `? PM2_HOME value...`: D:\PM2
            1. `? Set PM2_SERVICE_SCRIPTS...`: No
            1. `? Set PM2_SERVICE_PM2_DIR...`: Yes
            1. `? Specify the directory containing the pm2 version to be used by the service`: C:\Users\%username-of-user-to-run-the-webservice%\AppData\Roaming\npm\node_modules\pm2\index.js
            1. **PM2 service installed and started**
1. Set Windows Service to log on as the correct user account
    1. Open `services.msc`
    1. Open `Properties` on the Windows Service
    1. Go to the `Log On` tab
    1. Select `This account`
    1. Click `browse` and choose the correct user
    1. Put in users password
    1. `Stop` and `Start` the Windows Service to switch to the new user 

If you remove administrative privileges from the user running the Windows Service, the user doesn't have access to start the service on Windows startup. To go around this, create a scheduled task that will start the service on Windows Startup

1. Open `Task Scheduler` as administrator
    1. Create a new task
    1. Set `SYSTEM` as the running user for the task
    1. Activate `Run with highest privileges`
    1. Add a trigger for `At startup` and set a delay for 1 minute to allow other required Windows services to launch first
    1. Add a action:
        1. **Program:** `powershell`
        1. **Add arguments:** `-nologo -noninteractive -command Start-Service -Name "DUST" -Confirm:$False`


## Usage

[👉🏼 Head over here to see usage](./USAGE.md)
