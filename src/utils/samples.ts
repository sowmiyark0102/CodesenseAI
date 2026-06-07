export const SAMPLE_CODES: Record<string, { code: string; filename: string; language: string }> = {
  javascript: {
    filename: 'userController.js',
    language: 'javascript',
    code: `const express = require('express');
const db = require('./database');
const jwt = require('jsonwebtoken');

// User controller for auth endpoints
const login = async (req, res) => {
  const { username, password } = req.body;
  
  // Query database for user
  const query = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'";
  const user = await db.query(query);
  
  if (user.length > 0) {
    const token = jwt.sign({ id: user[0].id }, 'secret123');
    res.json({ token, user: user[0] });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
};

const getUsers = async (req, res) => {
  var users = [];
  var result = await db.query('SELECT * FROM users');
  for (var i = 0; i < result.length; i++) {
    users.push(result[i]);
  }
  res.json(users);
};

const deleteUser = (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM users WHERE id = ' + id);
  res.json({ message: 'Deleted' });
};

module.exports = { login, getUsers, deleteUser };`,
  },
  python: {
    filename: 'data_processor.py',
    language: 'python',
    code: `import pickle
import os
import requests

def load_user_data(filename):
    # Load serialized user data
    with open(filename, 'rb') as f:
        data = pickle.load(f)
    return data

def process_records(records):
    results = []
    for i in range(len(records)):
        record = records[i]
        # Process each record
        processed = {}
        processed['id'] = record['id']
        processed['name'] = record['name']
        processed['score'] = calculate_score(record)
        results.append(processed)
    return results

def calculate_score(record):
    score = 0
    for key in record:
        score = score + record[key] if type(record[key]) == int else score
    return score

def fetch_external_data(url):
    # Fetch data without timeout or error handling
    response = requests.get(url)
    return response.json()

def save_results(data, path):
    # Save to path provided by user - no validation
    os.system('mkdir -p ' + os.path.dirname(path))
    with open(path, 'w') as f:
        f.write(str(data))

class DataManager:
    def __init__(self):
        self.cache = {}
        self.data = []
    
    def add(self, item):
        self.data.append(item)
        self.cache[item['id']] = item
    
    def get_all(self):
        return self.data`,
  },
  typescript: {
    filename: 'apiService.ts',
    language: 'typescript',
    code: `interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
}

class ApiService {
  private baseUrl: string = 'http://api.example.com';
  private apiKey: string = 'sk-prod-abc123xyz789-supersecret';
  
  async getUser(id: any): Promise<any> {
    const response = await fetch(\`\${this.baseUrl}/users/\${id}\`, {
      headers: { 'Authorization': this.apiKey }
    });
    const data = await response.json();
    return data;
  }
  
  async updateUser(user: any): Promise<any> {
    // No input validation
    const response = await fetch(\`\${this.baseUrl}/users/\${user.id}\`, {
      method: 'PUT',
      body: JSON.stringify(user),
      headers: { 'Content-Type': 'application/json' }
    });
    return response.json();
  }
  
  async bulkProcess(users: User[]): Promise<User[]> {
    let results: User[] = [];
    for (let i = 0; i < users.length; i++) {
      // Sequential await inside loop — N+1 problem
      const result = await this.updateUser(users[i]);
      results.push(result);
    }
    return results;
  }
  
  logSensitiveData(user: User): void {
    console.log('User logged in:', JSON.stringify(user));
  }
}

export default new ApiService();`,
  },
};

export const LANGUAGE_EXTENSIONS: Record<string, string> = {
  javascript: 'js',
  typescript: 'ts',
  python: 'py',
  java: 'java',
  cpp: 'cpp',
  go: 'go',
  rust: 'rs',
};
