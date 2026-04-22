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

    // console.log(`Fetching month status for ${year}-${mm} for user ${username}`);
    // console.log(`Fetching body status for ${username} for ${year}-${mm}`);
    try {
        const bodyStatus = await BodyStatus.find({
            date: new RegExp(`^${year}-${mm}`),
            username
        }).lean();

        // console.log(`Found ${bodyStatus.length} entries for ${year}-${mm} for user ${username}`);
      
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
            // console.log(`IN BODYSTATUSCONTROLLER.JS: No body status found for ${year}-${mm} for user ${username}`);
          return res.status(404).json({ empty: true });
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
  const { monthData } = req.body;

  try {
    for (const dayData of Object.values(monthData)) {
      const { date, bbt, bleeding, mucus, mucusCharacteristic, notes, symptoms } = dayData;

      const hasData = bbt || bleeding || mucus || mucusCharacteristic || notes || symptoms?.length > 0;
      if (!hasData) continue;

      const fields = {
        basilBodyTemp: bbt,
        bleeding,
        mucusSensations: mucus,
        mucusCharacteristics: mucusCharacteristic,
        notes,
        secondaryBiomarkers: symptoms ?? []
      };

      const update = Object.fromEntries(
        Object.entries(fields).filter(([_, v]) => v !== undefined)
      );

      await BodyStatus.findOneAndUpdate(
        { username, date },
        { $set: update },
        { returnDocument: 'after', upsert: true }
      );
    }

    res.json({ message: 'Body status saved successfully' });
  } catch (err) {
    console.error('Error saving body status:', err);
    res.status(500).json({ message: 'Error saving body status' });
  }
}