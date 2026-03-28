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

    // Run both queries in parallel
    const [eventStatsSnapshot, winnersSnapshot] = await Promise.all([
      db
        .collection(DBCollections.EVENT_STATS)
        .where("event_id", "==", event_id)
        .where("is_login", "==", true)
        .get(),
      db
        .collection(DBCollections.RAFFLE_WINNERS)
        .where("event_id", "==", event_id)
        .get(),
    ]);

    const loggedInStudentNumbers = eventStatsSnapshot.docs.map(
      (doc) => doc.data().student_number as string,
    );

    if (loggedInStudentNumbers.length === 0) {
      return { students: [], total: 0 };
    }

    const wonStudentNumbers = new Set(
      winnersSnapshot.docs.map((doc) => doc.data().student_number as string),
    );

    const eligibleStudentNumbers = loggedInStudentNumbers.filter(
      (sn) => !wonStudentNumbers.has(sn),
    );

    if (eligibleStudentNumbers.length === 0) {
      return { students: [], total: 0 };
    }

    // Fetch student details in parallel batches of 30 (Firestore `in` limit)
    const batchPromises = [];
    for (let i = 0; i < eligibleStudentNumbers.length; i += 30) {
      const batch = eligibleStudentNumbers.slice(i, i + 30);
      batchPromises.push(
        db
          .collection(DBCollections.STUDENTS)
          .where("student_number", "in", batch)
          .get(),
      );
    }

    const batchResults = await Promise.all(batchPromises);
    const students: IRaffleEligibleStudent[] = [];
    for (const snapshot of batchResults) {
      for (const doc of snapshot.docs) {
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

export async function pickWinners(
  count: number = 5,
): Promise<IRaffleWinner[]> {
  try {
    const settings = await getEventSettings();
    const { event_id } = settings;

    const { students } = await getEligibleStudents();

    // Exclude students whose student number starts with "422"
    const eligibleStudents = students.filter(
      (s) => !s.student_number.startsWith("422"),
    );

    if (eligibleStudents.length === 0) {
      throw new ApiError(
        "No eligible students remaining",
        400,
        "NO_ELIGIBLE_STUDENTS",
      );
    }

    const actualCount = Math.min(count, eligibleStudents.length);
    const pickedWinners: IRaffleWinner[] = [];
    const pickedStudentNumbers = new Set<string>();

    // Pick all winners first (no I/O)
    for (let i = 0; i < actualCount; i++) {
      const remaining = eligibleStudents.filter(
        (s) => !pickedStudentNumbers.has(s.student_number),
      );

      if (remaining.length === 0) break;

      const winnerIndex = randomInt(remaining.length);
      const winner = remaining[winnerIndex];
      pickedStudentNumbers.add(winner.student_number);

      const winnerRef = db.collection(DBCollections.RAFFLE_WINNERS).doc();
      pickedWinners.push({
        winner_id: winnerRef.id,
        event_id,
        student_number: winner.student_number,
        first_name: winner.first_name,
        last_name: winner.last_name,
        middle_initial: winner.middle_initial,
        department: winner.department,
        won_at: new Date().toISOString(),
      });
    }

    // Batch write all winners in a single Firestore operation
    const batch = db.batch();
    for (const winner of pickedWinners) {
      const winnerRef = db.collection(DBCollections.RAFFLE_WINNERS).doc(winner.winner_id);
      batch.set(winnerRef, {
        event_id,
        student_number: winner.student_number,
        first_name: winner.first_name,
        last_name: winner.last_name,
        middle_initial: winner.middle_initial,
        department: winner.department,
        won_at: FieldValue.serverTimestamp(),
      });
    }
    await batch.commit();

    return pickedWinners;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("Failed to pick winners", 500, "INTERNAL_ERROR");
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
