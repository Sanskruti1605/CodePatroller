# Pull Request Sentinel

Build a polished, interactive frontend for my BE Computer Engineering project:

**CodePatroller — AI-Assisted Security Vulnerability Detection in GitHub Pull Requests.**

TECH STACK:
React, TypeScript, Tailwind CSS, shadcn/ui, Lucide icons, Recharts, React Router.

DESIGN:
Create a professional security dashboard inspired by GitHub and Snyk. Use a light theme, navy text, blue accents, white cards, subtle borders, severity badges, and a collapsible left sidebar. Make it responsive and suitable for a college project demonstration.

PAGES:

1. Dashboard: Summary cards, severity chart, vulnerability trend chart, recent pull requests, and recent findings.
2. Repositories: Repository table and an Add Repository modal.
3. Pull Requests: Searchable PR table, filters, scan status, and an Analyze PR button.
4. Security Review: Code viewer on the left; security findings on the right. Highlight affected lines and show vulnerability descriptions, severity, impact, recommended fixes, and safer code examples.
5. Security Findings: Search, severity filters, status filters, and actions to resolve, dismiss, or reopen findings.
6. Dependency Analysis: Dependency table, severity indicators, and a simulated dependency scan.
7. Scan History: Previous scans, results, and a details modal.
8. Settings: Scan preferences, notification preferences, and GitHub integration status.

MAIN DEMO:
Use a sample Python authentication pull request. Show three illustrative findings: SQL injection, hardcoded secret, and weak password validation. Clicking a finding must highlight its code line and display its explanation and suggested fix.

FUNCTIONALITY:
Use consistent mock data. Implement working navigation, search, filters, modals, simulated scan progress, toast notifications, and finding status updates. Save simple demo changes in localStorage.

Show a DEMO MODE badge. Clearly state that scans, AI explanations, and GitHub integration are simulated. Do not fabricate live scan results.

Keep components reusable and code simple. Build all pages in the same application. Prioritize the Security Review page and working interactions. Avoid unnecessary features, extra dependencies, and lengthy explanations. Do not build a backend.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://pull-request-sentinel.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/34820863-68b9-4799-86f9-c88eddc59acc).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
