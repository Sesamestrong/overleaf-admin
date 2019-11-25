# overleaf-admin
A program that allows a premium account on Overleaf to securely create premium projects for all members of a group
## Use
1. Create a ```.env``` file in the following format:
```
EMAIL=<email of the premium overleaf account>
PASSWORD=<password of the premium overleaf account>
ALLOWED_EMAILS=<a javascript regex matching accepted email addresses>
```

2. The project starts with ```npm start```.
3. Users can create premium overleaf projects with a call to ```<hosted url>/create/:projectName/:email?template=```, where template can be any of the following:
  - ```none``` - No template. This is default.
  - ```example``` - The example project.
  - A GitHub repository URL.
