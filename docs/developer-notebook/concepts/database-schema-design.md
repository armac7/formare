# Database Schema Design (MongoDB)

## Overview
Designing a database schema in MongoDB starts with understanding user behavior and the core actions (transactions) performed in the application.

---

## Key Principle
Instead of focusing only on data structure, focus on:

> "What is the user doing?"

---

## Application Context (Formare)
In Formare, the primary user action is:

> "What is/was my body status today (or on a specific day)?"

This includes:
- Basal Body Temperature (BBT)
- Cervical Mucus (CM)
- Symptoms
- Flow

---

## Schema Insight

Because MongoDB is document-based, the schema should be designed around **user-centered transactions**.

### Example Approach:
Each entry represents a daily record:

```json
{
  "userId": "123",
  "date": "2026-04-07",
  "bbt": 97.5,
  "cm": "dry",
  "flow": "light",
  "symptoms": ["cramps", "fatigue"]
}