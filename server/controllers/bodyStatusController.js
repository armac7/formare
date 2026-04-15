import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import { User } from '../models/User.js';
import { BodyStatus } from '../models/BodyStatus.js';

export async function getMonthStatus(req, res) {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  // console.log(req.session.user);

    const { username } = req.session.user;
    const { year, month } = req.query;
      
    const mm = String(month).padStart(2, "0");

    // console.log(`Fetching body status for ${username} for ${year}-${mm}`);
    try {
        const bodyStatus = await BodyStatus.find({
            date: new RegExp(`^${year}-${mm}`),
            username
        }).lean();

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
            return res.status(404).json({ message: 'No body status found for the specified date' });
        }
    } catch (err) {
      console.error('Error fetching body status:', err);
      return res.status(500).json({ message: 'Error fetching body status' });
    }
}

export async function editBodyStatus(req, res) {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { username } = req.session.user;
  const { date, basilBodyTemp, mucusSensations, mucusCharacteristics, secondaryBiomarkers, notes } = req.body;

  const fields = { basilBodyTemp, mucusSensations, mucusCharacteristics, secondaryBiomarkers, notes };
  // filters out all undefined fields to avoid overwriting existing data with undefined values when using findOneAndUpdate with upsert: true
  const update = Object.fromEntries(Object.entries(fields).filter(([_, v]) => 
    v !== undefined
  ));

  try {
    const bodyStatus = await BodyStatus.findOneAndUpdate(
      { username, date },
      { $set: update },
      { new: true, upsert: true }
    );

    res.json({ message: 'Body status saved successfully' });
  } catch (err) {
    console.error('Error saving body status:', err);
    res.status(500).json({ message: 'Error saving body status' });
  }
}