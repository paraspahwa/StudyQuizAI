#!/usr/bin/env python3
"""
Database initialization script for StudyQuizAI
Initializes PostgreSQL database and creates tables

Usage:
    python init_db.py
"""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from database import init_db

if __name__ == "__main__":
    print("🗄️  Initializing StudyQuizAI PostgreSQL database...")
    init_db()
    print("✅ Database initialized successfully!")
    print("📊 Tables created:")
    print("   - users")
    print("   - quizzes")
    print("   - quiz_results")
    print("   - payments")
