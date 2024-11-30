### Steps to Deploy Your App to Firebase Hosting

1. Install the Firebase CLI: Run this command to install the Firebase CLI globally:
   `npm install -g firebase-tools` after `npm install firebase`

2. Login to Firebase: Log in to your Firebase account using the CLI:
   `firebase login` THIS WILL TAKE YOU TO BROWSER, AUTHENTICATE YOU AND COME BACK.

3. Initialize your Firebase project: Inside the root folder of your project, initialize Firebase Hosting by running:
   `firebase init` use `firebase projects:list` to see the project list

4. Opt-in for automatic GitHub deploys if you want to set that up.
   Build your app (if necessary):
   If you're using a build system like Webpack or a front-end framework that requires bundling, run your build command (e.g., npm run build).
5. Make sure your index.html and other static assets are in the directory you specified (e.g., public/).
   Deploy your app to Firebase Hosting:

6. Once everything is ready, deploy your site with: `firebase target:apply hosting w3gc-db-box w3gc-db-box` then
   `firebase deploy --only hosting`

7. After deploying, you’ll receive a public URL like https://your-app-name.web.app where your app will be accessible.

### What Happens After Deployment?

    Hosting: Your web app will be hosted on Firebase's secure servers.
    Access URLs: Firebase provides both https://your-app-name.web.app and https://your-app-name.firebaseapp.com as domains.
    Custom Domain: You can also add a custom domain if you have one.
    Automatic HTTPS: Firebase Hosting automatically handles SSL certificates, so your app will be served over HTTPS by default.

    Done

---

8. Use github action to deploy osting after first or many deploy through CLI - `firebase init hosting:github`
