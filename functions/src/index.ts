import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

export const aggregateAttendance = onDocumentCreated(
  {
    document: "attendance/{docId}",
    region: "asia-southeast1",
  },
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;

    const data = snapshot.data();
    const { student_number, event_id, settings_id, department, type } = data;

    // We only track LOGIN and LOGOUT types explicitly
    const isLogin = type === "login";
    const isLogout = type === "logout";

    if (!isLogin && !isLogout) return;

    const statsRef = db.collection("event_stats").doc(event_id);
    // Proper nested structure for set({ merge: true })
    const statsUpdate: any = {
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
      event_id: event_id,
      overall: {},
      departments: {
        [department]: {
          department: department
        }
      }
    };

    // 1. Increment raw totals based on type
    if (isLogin) {
      statsUpdate.departments[department].total_login = admin.firestore.FieldValue.increment(1);
      statsUpdate.overall.total_login = admin.firestore.FieldValue.increment(1);
    } else {
      statsUpdate.departments[department].total_logout = admin.firestore.FieldValue.increment(1);
      statsUpdate.overall.total_logout = admin.firestore.FieldValue.increment(1);
    }

    // 2. Check for completion
    const complementaryType = isLogin ? "logout" : "login";
    const complementaryQuery = await db
      .collection("attendance")
      .where("student_number", "==", student_number)
      .where("settings_id", "==", settings_id)
      .where("event_id", "==", event_id)
      .where("type", "==", complementaryType)
      .limit(1)
      .get();

    const isComplete = !complementaryQuery.empty;

    if (isComplete) {
      statsUpdate.departments[department].total_complete = admin.firestore.FieldValue.increment(1);
      statsUpdate.overall.total_complete = admin.firestore.FieldValue.increment(1);
    }

    // Use merge so we don't overwrite existing stats
    await statsRef.set(statsUpdate, { merge: true });

    console.log(`Aggregated stats for ${student_number} in event ${event_id} successfully.`);
  }
);
