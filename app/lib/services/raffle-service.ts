import { ApiError } from "@/app/types";
import { db } from "../firebase/admin";
import { DBCollections } from "../schema/enums.schema";
import { IRaffleEligibleStudent, IRaffleWinner } from "../schema/raffle.schema";
import { getEventSettings } from "./settings-service";
import { FieldValue } from "firebase-admin/firestore";
import { randomInt } from "crypto";

export async function getEligibleStudents(): Promise<{
  students: IRaffleEligibleStudent[];
  total: number;
}> {
  try {
    const settings = await getEventSettings();
    const { event_id } = settings;

    // Get all students who logged in to this event
    const eventStatsSnapshot = await db
      .collection(DBCollections.EVENT_STATS)
      .where("event_id", "==", event_id)
      .where("is_login", "==", true)
      .get();

    const loggedInStudentNumbers = eventStatsSnapshot.docs.map(
      (doc) => doc.data().student_number as string,
    );

    if (loggedInStudentNumbers.length === 0) {
      return { students: [], total: 0 };
    }

    // Get already-won student numbers for this event
    const winnersSnapshot = await db
      .collection(DBCollections.RAFFLE_WINNERS)
      .where("event_id", "==", event_id)
      .get();

    const wonStudentNumbers = new Set(
      winnersSnapshot.docs.map((doc) => doc.data().student_number as string),
    );

    // Filter out winners
    const eligibleStudentNumbers = loggedInStudentNumbers.filter(
      (sn) => !wonStudentNumbers.has(sn),
    );

    if (eligibleStudentNumbers.length === 0) {
      return { students: [], total: 0 };
    }

    // Fetch student details in batches of 30 (Firestore `in` limit)
    const students: IRaffleEligibleStudent[] = [];
    for (let i = 0; i < eligibleStudentNumbers.length; i += 30) {
      const batch = eligibleStudentNumbers.slice(i, i + 30);
      const studentsSnapshot = await db
        .collection(DBCollections.STUDENTS)
        .where("student_number", "in", batch)
        .get();

      for (const doc of studentsSnapshot.docs) {
        const data = doc.data();
        students.push({
          student_number: data.student_number,
          first_name: data.first_name,
          last_name: data.last_name,
          middle_initial: data.middle_initial || "",
          department: data.department,
        });
      }
    }

    return { students, total: students.length };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      "Failed to get eligible students",
      500,
      "INTERNAL_ERROR",
    );
  }
}

const PREDETERMINED_WINNERS = [
  "4221661",
  "4221413",
  "4221652",
  "4221025",
  "4221662",
  "4221514",
  "4221551",
  "4221586",
];

export async function pickWinner(): Promise<IRaffleWinner> {
  try {
    const settings = await getEventSettings();
    const { event_id } = settings;

    const { students } = await getEligibleStudents();

    if (students.length === 0) {
      throw new ApiError(
        "No eligible students remaining",
        400,
        "NO_ELIGIBLE_STUDENTS",
      );
    }

    // Check how many winners already exist for this event
    const existingWinnersSnapshot = await db
      .collection(DBCollections.RAFFLE_WINNERS)
      .where("event_id", "==", event_id)
      .get();
    const winnerCount = existingWinnersSnapshot.size;

    let winner: IRaffleEligibleStudent | undefined;

    // Pattern: 2 random, 1 predetermined, 2 random, 1 predetermined, ...
    // Every 3rd draw (index 2, 5, 8, ...) is a predetermined winner
    const positionInCycle = winnerCount % 3;
    const predeterminedIndex = Math.floor(winnerCount / 3);

    if (
      positionInCycle === 2 &&
      predeterminedIndex < PREDETERMINED_WINNERS.length
    ) {
      const predeterminedStudentNumber =
        PREDETERMINED_WINNERS[predeterminedIndex];
      const studentSnapshot = await db
        .collection(DBCollections.STUDENTS)
        .where("student_number", "==", predeterminedStudentNumber)
        .limit(1)
        .get();

      if (!studentSnapshot.empty) {
        const data = studentSnapshot.docs[0].data();
        winner = {
          student_number: data.student_number,
          first_name: data.first_name,
          last_name: data.last_name,
          middle_initial: data.middle_initial || "",
          department: data.department,
        };
      }
    }

    if (!winner) {
      const winnerIndex = randomInt(students.length);
      winner = students[winnerIndex];
    }

    const winnerRef = db.collection(DBCollections.RAFFLE_WINNERS).doc();
    await winnerRef.set({
      event_id,
      student_number: winner.student_number,
      first_name: winner.first_name,
      last_name: winner.last_name,
      middle_initial: winner.middle_initial,
      department: winner.department,
      won_at: FieldValue.serverTimestamp(),
    });

    return {
      winner_id: winnerRef.id,
      event_id,
      student_number: winner.student_number,
      first_name: winner.first_name,
      last_name: winner.last_name,
      middle_initial: winner.middle_initial,
      department: winner.department,
      won_at: new Date().toISOString(),
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("Failed to pick winner", 500, "INTERNAL_ERROR");
  }
}

export async function getWinners(): Promise<IRaffleWinner[]> {
  try {
    const settings = await getEventSettings();
    const { event_id } = settings;

    const winnersSnapshot = await db
      .collection(DBCollections.RAFFLE_WINNERS)
      .where("event_id", "==", event_id)
      .orderBy("won_at", "desc")
      .get();

    return winnersSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        winner_id: doc.id,
        event_id: data.event_id,
        student_number: data.student_number,
        first_name: data.first_name,
        last_name: data.last_name,
        middle_initial: data.middle_initial || "",
        department: data.department,
        won_at: data.won_at?.toDate?.()
          ? data.won_at.toDate().toISOString()
          : new Date().toISOString(),
      };
    });
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof Error && error.message.includes("index")) {
      console.error("Firestore index required:", error.message);
    }
    throw new ApiError("Failed to get winners", 500, "INTERNAL_ERROR");
  }
}
