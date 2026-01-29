# Contributing to Text Toxicity Analyzer

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/text-toxicity-analyzer.git
   ```
3. **Set up the development environment** following the README instructions

## 📝 How to Contribute

### Reporting Bugs

- Check existing issues to avoid duplicates
- Use the bug report template
- Include steps to reproduce
- Include browser/environment details

### Suggesting Features

- Open an issue with the `feature request` label
- Describe the use case and expected behavior
- Be open to discussion

### Submitting Code

1. Create a feature branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following our code style

3. Test your changes:

   ```bash
   # Frontend
   cd frontend && npm run lint

   # Backend
   php -l backend/**/*.php
   ```

4. Commit with clear messages:

   ```bash
   git commit -m "feat: add toxicity threshold configuration"
   ```

5. Push and create a Pull Request

## 🎨 Code Style

### JavaScript/React

- Use functional components with hooks
- Use ES6+ syntax
- Follow the existing component structure

### PHP

- Follow PSR-12 coding standard
- Use meaningful variable and function names
- Add PHPDoc comments for functions

### Python

- Follow PEP 8
- Use type hints where appropriate
- Add docstrings for functions

## 📋 Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

## 🔍 Code Review Process

1. All PRs require at least one review
2. Address feedback and update your PR
3. Maintain a clean commit history
4. Ensure CI checks pass

## 💬 Questions?

Open an issue with the `question` label or reach out to the maintainers.

---

Thank you for contributing! 🎉
