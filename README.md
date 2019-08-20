# Winter 19 Base Components and Interfaces Demo


<a href="https://githubsfdeploy.herokuapp.com?owner=mjyocca&repo=Winter19-Base-Components&ref=master">
  <img alt="Deploy to Salesforce"
       src="https://raw.githubusercontent.com/afawcett/githubsfdeploy/master/deploy.png">
</a>


## Setup (For non-scratch org)

[Blog post explaining non-scratch org development](https://github.com/forcedotcom/salesforcedx-vscode/wiki/Develop-Against-Any-Org-in-Visual-Studio-Code)

You can use the cli or the command pallete for the setup process 

1. Install [Visual Studio Code](https://code.visualstudio.com/download)

2. Install [sfdx cli](https://developer.salesforce.com/tools/sfdxcli) and Salesforce vscode extension suite

3. Create a Project w/ a Manifest

   
4. Authenticate your sandbox/dev org.

   via cli
   ```
   sfdx force:auth:web:login -d -a yourAlias
   ```
   or command pallete
   ```
   cmd+shift+p for mac & ctrl+shift+p for windows SFDX: Authorize an Org
   ```
5. Clone this repository

```
git clone https://github.com/mjyocca/Winter19-Base-Components.git
```
6. Push/Deploy Source to Org

right click on manifest directory folder or package.xml
and select
```
SFDX: Deploy Source in Manifest to Org
```
## Resources


## Description of Files and Directories


## Issues


