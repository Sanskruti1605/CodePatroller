export type Severity = "critical" | "high" | "medium" | "low";
export type FindingStatus = "open" | "resolved" | "dismissed";

export const repositories = [
  { id: "r1", name: "campus-auth-service", owner: "nandini-k", language: "Python", prs: 4, lastScan: "2026-10-26", issues: 3 },
  { id: "r2", name: "library-portal", owner: "nandini-k", language: "TypeScript", prs: 2, lastScan: "2026-10-24", issues: 2 },
  { id: "r3", name: "attendance-api", owner: "be-comp-team", language: "Java", prs: 1, lastScan: "2026-10-20", issues: 1 },
];

export const pullRequests = [
  { id: 42, title: "Add login & registration endpoints", repo: "campus-auth-service", author: "nandini-k", status: "scanned", findings: 3, updated: "2026-10-26" },
  { id: 41, title: "Refactor session middleware", repo: "campus-auth-service", author: "rahul-p", status: "scanned", findings: 0, updated: "2026-10-25" },
  { id: 18, title: "Upgrade search component", repo: "library-portal", author: "sneha-m", status: "pending", findings: 0, updated: "2026-10-24" },
  { id: 17, title: "Add book reservation form", repo: "library-portal", author: "nandini-k", status: "scanned", findings: 2, updated: "2026-10-23" },
  { id: 9, title: "Export attendance as CSV", repo: "attendance-api", author: "amit-s", status: "failed", findings: 1, updated: "2026-10-20" },
];

export const demoFile = "auth/login.py";
export const demoCode = `import sqlite3
import hashlib
from flask import Flask, request, jsonify

app = Flask(__name__)

SECRET_KEY = "sk_live_9f8a7b6c5d4e3f2a1b0c"
DB_PATH = "users.db"


def get_db():
    return sqlite3.connect(DB_PATH)


def is_valid_password(password):
    return len(password) >= 4


@app.route("/register", methods=["POST"])
def register():
    username = request.json["username"]
    password = request.json["password"]
    if not is_valid_password(password):
        return jsonify({"error": "Password too short"}), 400
    hashed = hashlib.sha256(password.encode()).hexdigest()
    db = get_db()
    db.execute("INSERT INTO users VALUES (?, ?)", (username, hashed))
    db.commit()
    return jsonify({"ok": True})


@app.route("/login", methods=["POST"])
def login():
    username = request.json["username"]
    password = request.json["password"]
    hashed = hashlib.sha256(password.encode()).hexdigest()
    db = get_db()
    query = f"SELECT * FROM users WHERE username = '{username}' AND password = '{hashed}'"
    user = db.execute(query).fetchone()
    if user:
        return jsonify({"token": SECRET_KEY})
    return jsonify({"error": "Invalid credentials"}), 401`;

export type Finding = {
  id: string;
  title: string;
  severity: Severity;
  cwe: string;
  file: string;
  line: number;
  repo: string;
  pr: number;
  description: string;
  impact: string;
  fix: string;
  saferCode: string;
};

export const findings: Finding[] = [
  {
    id: "F-101",
    title: "SQL Injection",
    severity: "critical",
    cwe: "CWE-89",
    file: demoFile,
    line: 38,
    repo: "campus-auth-service",
    pr: 42,
    description: "User input (username) is inserted directly into a SQL string with an f-string. An attacker can change the query logic.",
    impact: "Input like ' OR '1'='1' -- bypasses login and may expose or modify every user record.",
    fix: "Use parameterized queries so the database treats input as data, never as SQL.",
    saferCode: `query = "SELECT * FROM users WHERE username = ? AND password = ?"
user = db.execute(query, (username, hashed)).fetchone()`,
  },
  {
    id: "F-102",
    title: "Hardcoded Secret",
    severity: "high",
    cwe: "CWE-798",
    file: demoFile,
    line: 7,
    repo: "campus-auth-service",
    pr: 42,
    description: "A live-looking secret key is committed in source code and is also returned to clients as a token.",
    impact: "Anyone with repository access (or any logged-in user) learns the key and can forge or reuse tokens.",
    fix: "Load secrets from environment variables or a secret manager, rotate the exposed key, and issue per-user signed tokens.",
    saferCode: `import os
SECRET_KEY = os.environ["SECRET_KEY"]  # never commit real values`,
  },
  {
    id: "F-103",
    title: "Weak Password Validation",
    severity: "medium",
    cwe: "CWE-521",
    file: demoFile,
    line: 16,
    repo: "campus-auth-service",
    pr: 42,
    description: "Passwords only need 4 characters. Combined with unsalted SHA-256, accounts are easy to brute-force.",
    impact: "Weak passwords can be guessed quickly, leading to account takeover.",
    fix: "Require a minimum of 12 characters with mixed character types, and hash with bcrypt or argon2.",
    saferCode: `import re

def is_valid_password(password):
    return (len(password) >= 12
            and re.search(r"[A-Z]", password)
            and re.search(r"[a-z]", password)
            and re.search(r"\\d", password))`,
  },
  {
    id: "F-201",
    title: "Cross-Site Scripting (XSS)",
    severity: "high",
    cwe: "CWE-79",
    file: "src/ReservationForm.tsx",
    line: 54,
    repo: "library-portal",
    pr: 17,
    description: "Book notes are rendered with dangerouslySetInnerHTML without sanitizing.",
    impact: "Injected scripts can run in other users' browsers.",
    fix: "Render as plain text or sanitize with a trusted library.",
    saferCode: `<p>{note}</p>`,
  },
  {
    id: "F-202",
    title: "Missing CSRF Protection",
    severity: "low",
    cwe: "CWE-352",
    file: "src/api/reserve.ts",
    line: 12,
    repo: "library-portal",
    pr: 17,
    description: "State-changing request lacks a CSRF token.",
    impact: "A malicious site could submit reservations on a user's behalf.",
    fix: "Add CSRF tokens or SameSite=strict cookies.",
    saferCode: `headers: { "X-CSRF-Token": csrfToken }`,
  },
  {
    id: "F-301",
    title: "Path Traversal in CSV export",
    severity: "medium",
    cwe: "CWE-22",
    file: "ExportController.java",
    line: 33,
    repo: "attendance-api",
    pr: 9,
    description: "File name from the request is joined to a directory path without validation.",
    impact: "Attackers could read files outside the export folder.",
    fix: "Normalize the path and verify it stays inside the export directory.",
    saferCode: `Path p = base.resolve(name).normalize();
if (!p.startsWith(base)) throw new SecurityException();`,
  },
];

export const dependencies = [
  { name: "flask", version: "1.0.2", latest: "3.0.3", severity: "high" as Severity, advisory: "Session cookie disclosure", repo: "campus-auth-service" },
  { name: "requests", version: "2.19.0", latest: "2.32.3", severity: "medium" as Severity, advisory: "Credential leak on redirect", repo: "campus-auth-service" },
  { name: "pyyaml", version: "5.3", latest: "6.0.2", severity: "critical" as Severity, advisory: "Arbitrary code execution via load()", repo: "campus-auth-service" },
  { name: "lodash", version: "4.17.15", latest: "4.17.21", severity: "high" as Severity, advisory: "Prototype pollution", repo: "library-portal" },
  { name: "axios", version: "1.6.0", latest: "1.7.7", severity: "medium" as Severity, advisory: "CSRF token exposure", repo: "library-portal" },
  { name: "react", version: "18.3.1", latest: "18.3.1", severity: "low" as Severity, advisory: "No known issues", repo: "library-portal" },
];

export const scanHistory = [
  { id: "S-1009", repo: "campus-auth-service", pr: 42, date: "2026-10-26 14:02", duration: "38s", result: "3 findings", critical: 1, high: 1, medium: 1, low: 0 },
  { id: "S-1008", repo: "campus-auth-service", pr: 41, date: "2026-10-25 11:40", duration: "22s", result: "Clean", critical: 0, high: 0, medium: 0, low: 0 },
  { id: "S-1007", repo: "library-portal", pr: 17, date: "2026-10-23 16:15", duration: "41s", result: "2 findings", critical: 0, high: 1, medium: 0, low: 1 },
  { id: "S-1006", repo: "attendance-api", pr: 9, date: "2026-10-20 09:30", duration: "—", result: "Failed", critical: 0, high: 0, medium: 1, low: 0 },
];

export const trend = [
  { week: "W1", critical: 2, high: 4, medium: 5, low: 3 },
  { week: "W2", critical: 1, high: 3, medium: 6, low: 2 },
  { week: "W3", critical: 2, high: 2, medium: 4, low: 3 },
  { week: "W4", critical: 1, high: 2, medium: 2, low: 1 },
];

export const severityOrder: Severity[] = ["critical", "high", "medium", "low"];
