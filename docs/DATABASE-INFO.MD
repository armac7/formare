# Formare Database Schema Documentation

This document outlines the database schema for **Formare**, a menstrual cycle tracking application. The schema is designed to store user authentication data and detailed body status information to allow the app to answer queries such as:

> "What is my body status today?"  

and to predict future body status for period projections.

---

## **Collections Overview**

### 1. `Users`
Stores authentication and basic account information for each user.

**Fields:**

| Field       | Type   | Description                               |
|------------|--------|-------------------------------------------|
| `_id`      | ObjectId | Unique identifier for the user (MongoDB generated). |
| `username` | String  | Unique username for authentication.      |
| `passwordHash` | String | Hashed password for secure authentication. |

**Example Document:**
```json
{
  "_id": "642fa3f8b5e1d8a1c5f3b9a2",
  "username": "jane_doe",
  "passwordHash": "$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36ZzVq4i"
}
```

### 2. `Body Status`
Stores detailed physiological data recorded daily for each user.

**Fields:**

| Field                        | Type              | Description |
|-------------------------------|-----------------|-------------|
| `_id`                         | ObjectId        | Unique identifier for the document. |
| `date`                        | String (MM/DD/YYYY) | The date of the entry. |
| `user`                        | String          | Username of the user this entry belongs to. |
| `blood-info`                  | String          | Bleeding information for the day (e.g., "light", "medium", "heavy"). |
| `cervical-mucus-sensation`    | String          | Sensation observed for cervical mucus (e.g., "dry", "moist", "wet"). |
| `cervical-mucus-characteristic` | String        | Physical characteristic of cervical mucus (e.g., "tacky", "stretchy"). |
| `basil-body-temp` | Double | Recorded Basil Body Temperature (e.g., "98.82") |
| `secondary-biomarkers`        | Array of Strings | Any additional biomarker data (e.g., headache, back ache, fatigue, etc.). |
| `notes`                       | String          | Optional notes provided by the user. |

**Example Document:**
```json
{
  "_id": "6430b3c9a5e1f8b1c7d4f2b3",
  "date": "04/07/2026",
  "user": "jane_doe",
  "blood-info": "light",
  "cervical-mucus-sensation": "light",
  "cervical-mucus-characteristic": "dry",
  "basil-body-temp": "98.82",
  "secondary-biomarkers": ["headache", "pms", "backache"],
  "notes": "Mild cramps in the morning"
}
```

## Usage Notes

- Each `Body Status` document is linked to a `user` in the `Users` collection via the `username` field.
- The primary transaction revolves around querying the latest `Body Status` for a user to provide insights and predictions.
- All sensitive data, including any biomarkers, **should be stored securely**.
- Date is stored as `MM/DD/YYYY` to simplify user-facing queries and display.
- If the `username` in `Users` is updated, `user` in `Body Status` must also be if they correlate.

---

## Design Considerations

1. **Scalability:**  
   - Each user can have multiple `Body Status` entries.  
   - Each `Body Status` entry relates to a single day for a given user.
   - Indexing `user` and `date` fields is recommended for fast retrieval of daily entries.

2. **Security:**  
   - Ensure sensitive health data is stored securely and, if possible, encrypted at rest.  
   - Use secure practices when transmitting and storing data (e.g., HTTPS, encrypted fields).

3. **Predictive Analytics:**  
   - Historical `Body Status` data can be used to predict future cycles, ovulation, and fertile windows.  
   - Ensure consistent data formats for accurate predictions.

4. **Extensibility:**  
   - The schema is designed to easily add new biomarkers or user-tracked metrics as needed.  
   - Future fields should maintain consistent naming conventions for easy querying.
