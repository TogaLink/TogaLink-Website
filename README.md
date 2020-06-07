[![Netlify Status](https://api.netlify.com/api/v1/badges/fc7c6907-428b-44df-ac1b-ee949ed708b2/deploy-status)](https://app.netlify.com/sites/covid19saratoga/deploys)

# [TogaLink](https://togalink.org/)

*The landing site for TogaLink, a web app that links users in need of help to local volunteers. A community-powered response to the COVID-19 pandemic. In use by the San Mateo, Santa Cruz, and Santa Clara Counties.*

Usage

To set up:

0. Download the latest git and LTS of Node.js from [here](https://git-scm.com/downloads) and [here](https://nodejs.org/en/download/), respectively.
1. `git clone https://github.com/TogaLink/TogaLink-Website`
2. `cd Toga-Hacks-Website`
3. `npm i`

To run the live server:

    npm run dev

To make the production build:

    npm run build

# Git Workflow

1. For a new bug fix or feature idea, add it to the To-Do column of the project board.
2. When you can work on it, move it to In Progress, convert it to an issue, and self assign it.
3. Create a new branch with `git checkout -b [branch-name]` and `git push -u` (branches are `kebab-cased`).
4. Create a new pull request draft pointing to your branch. Make sure to comment `Fixes #[issue number]` for each issue it resolves (e.g., the one your converted when you moved the issue to `In progress`).
5. As you're working on your branch, to keep up to date with `master`, run `git rebase master` and `git push --force-with-lease`.
6. When you're done, click `Ready for review` and then `Squash and merge`.
