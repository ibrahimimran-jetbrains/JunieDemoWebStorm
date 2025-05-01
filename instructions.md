# GitHub Push Instructions

Since GitHub no longer supports password authentication for Git operations, here are the recommended ways to push your repository to GitHub:

## Option 1: Use a Personal Access Token (PAT)

1. Go to GitHub Settings > Developer settings > Personal access tokens > Generate new token
2. Give your token a name, set an expiration, and select the necessary scopes (at minimum, select "repo")
3. Click "Generate token" and copy the token (you won't be able to see it again)
4. Use the token as your password when pushing:
   ```
   git push origin main
   ```
   When prompted for a password, use the personal access token instead.

## Option 2: Set up SSH Authentication

1. Check if you already have SSH keys:
   ```
   ls -la ~/.ssh
   ```

2. If you don't have SSH keys, generate them:
   ```
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

3. Add the SSH key to the ssh-agent:
   ```
   eval "$(ssh-agent -s)"
   ssh-add ~/.ssh/id_ed25519
   ```

4. Add the SSH key to your GitHub account:
   - Copy the SSH public key to your clipboard:
     ```
     cat ~/.ssh/id_ed25519.pub
     ```
   - Go to GitHub Settings > SSH and GPG keys > New SSH key
   - Paste your key and save

5. Change your remote URL from HTTPS to SSH:
   ```
   git remote set-url origin git@github.com:ibrahimimran-jetbrains/JunieDemoWebStorm.git
   ```

6. Push to GitHub:
   ```
   git push origin main
   ```

## Option 3: Use GitHub CLI

1. Install GitHub CLI: https://cli.github.com/
2. Authenticate with GitHub:
   ```
   gh auth login
   ```
3. Push your repository:
   ```
   gh repo sync
   ```

## Option 4: Use a Git Credential Manager

If you're using a Git client like GitHub Desktop, VS Code, or JetBrains IDEs, they often have built-in credential managers that can handle authentication for you.

For JetBrains IDEs specifically:
1. Go to Settings/Preferences > Version Control > GitHub
2. Add your GitHub account and authenticate
3. Use the IDE's Git integration to push your changes