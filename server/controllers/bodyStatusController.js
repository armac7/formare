import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import { User } from '../models/User.js';
import { BodyStatus } from '../models/BodyStatus.js';

/*
* getMonthStatus(req, res)
* 
* purpose: Handles fetching and updating body status data for the calendar.
* @param {Object} req - Express request object, expects session with user info and params for year/month.
* @param {Object} res - Express response object, used to send back JSON data or error messages.
*/
export async function getMonthStatus(req, res) {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  
  // destructures username from session and year/month from request parameters
  const { username } = req.session.user;
  const { year, month } = req.params;
      
  // pads month with leading zero if necessary (e.g., "3" becomes "03")
  const mm = String(month).padStart(2, "0");

  try {
    // queries the BodyStatus collection for entries matching the specified year/month and username
    const bodyStatus = await BodyStatus.find({
      date: new RegExp(`^${year}-${mm}`),
      username
    }).lean();
    // uses .lean() to get plain JavaScript objects instead of Mongoose documents for better performance

    // if body status entries are found, formats them into a consistent structure for the frontend
    if (bodyStatus.length > 0) {
      const formatted = bodyStatus.map(entry => ({
        date: entry.date,
        bbt: entry.basilBodyTemp ?? null,
        bleeding: entry.bleeding ?? null,
        mucus: entry.mucusSensations ?? null,
        mucusCharacteristic: entry.mucusCharacteristics ?? null,
        notes: entry.notes ?? "",
        symptoms: entry.secondaryBiomarkers?.length
        ? entry.secondaryBiomarkers.join(", ")
        : ""
      }));
          
      return res.json(formatted);
    } else {
      return res.status(404).json({ empty: true });
    }
  } catch (err) {
    console.error('Error fetching body status:', err);
    return res.status(500).json({ message: 'Error fetching body status' });
  }
}

/*
* editBodyStatus(req, res)
* 
* purpose: Handles saving/updating body status data for the calendar.
* @param {Object} req - Express request object, expects session with user info and body containing monthData.
* @param {Object} res - Express response object, used to send back success message or error messages.
*/
export async function editBodyStatus(req, res) {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // destructures username from session and monthData from request body
  const { username } = req.session.user;
  const { monthData } = req.body;

  // NOTE: THIS CODE NEEDS TO BE BETTER OPTIMZIED — CURRENTLY IT MAKES ONE DB CALL PER DAY WITH DATA, WHICH COULD BE UP TO 31 CALLS PER MONTH.
  try {
    // iterates over each day's data in monthData and updates or creates a BodyStatus entry for each day that has data
    for (const dayData of Object.values(monthData)) {
      // destructures relevant fields from dayData
      const { date, bbt, bleeding, mucus, mucusCharacteristic, notes, symptoms } = dayData;

      // makes sure there's at least one field with data before making a database call to avoid unnecessary updates for empty days
      const hasData = bbt || bleeding || mucus || mucusCharacteristic || notes || symptoms?.length > 0;
      if (!hasData) continue;

      // makes an update object with all the given data
      const fields = {
        basilBodyTemp: bbt,
        bleeding,
        mucusSensations: mucus,
        mucusCharacteristics: mucusCharacteristic,
        notes,
        secondaryBiomarkers: symptoms ?? []
      };

      // filters out undefined values from the update object to prevent overwriting existing data with undefined
      const update = Object.fromEntries(
        Object.entries(fields).filter(([_, v]) => v !== undefined)
      );

      // uses findOneAndUpdate with upsert option to either update the existing entry 
      // for the date or create a new one if it doesn't exist
      await BodyStatus.findOneAndUpdate(
        { username, date },
        { $set: update },
        { returnDocument: 'after', upsert: true }
      );
    }

    // after processing all days, sends a success response back to the client
    res.json({ message: 'Body status saved successfully' });
  } catch (err) {
    console.error('Error saving body status:', err);
    res.status(500).json({ message: 'Error saving body status' });
  }
}