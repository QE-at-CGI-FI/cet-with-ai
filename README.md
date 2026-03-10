# Contemporary Exploratory Testing with AI

Repository for experimenting with contemporary exploratory testing with AI, community batch March 2026.

- AI as **external imagination**.
- AI as **task expansion**. 
- Results (actionable insights) are more important than intermediate artifacts.
- Artifacts are an output of testing, to support future with knowledge captured at time we know the best.
- Executable specifications of intent are an asset that invites us to explore.

## Getting started

Install playwright
`npm init playwright@latest`

Install agents
`npx playwright init-agents --loop=vscode`

Install playwright CLI
`npm install -g @playwright/cli@latest`
`playwright-cli install --skills`

## Test site

https://qe-at-cgi-fi.github.io/cet-with-ai/potion-shop/ 

https://epictestquest.github.io/the-Potion-Shop/

This test site is by the brilliant Christine Pinto, created for #28DaysOfTesting challenge.
The original repo: https://github.com/EpicTestQuest/the-Potion-Shop includes no license, meaning all rights are reserved. The site is created with Claude Code, and currently 1st copyright cases indicate that prompted apps aren't protected by copyright in the same way but this will unfold.
This repo is used for community teaching purposes only, and code is made available for ease of showcasing multifaceted quality approaches.

## Local development

# Using Python

python -m http.server 8000

# Using Node.js

npx serve

## Prompts

Create file bug_reports.txt by going through site https://epictestquest.github.io/the-Potion-Shop/ using playwright and identifying as many things to mention as possible problems or improvement suggestions as you can identify. Don't use vision.

Compare bug_reports and rikard_bugs for identified issues. List which are not in both lists, and identify which list found them.