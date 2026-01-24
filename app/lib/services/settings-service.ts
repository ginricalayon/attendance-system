import { ICreateSettingsRequest } from "../schema/settings.schema";
import { db } from "../firebase/admin";
import { DBCollections } from "../schema/enums.schema";
import { ApiError } from "@/app/types";
import { FieldValue } from "firebase-admin/firestore";

export async function configureEventSettings(request: ICreateSettingsRequest) {
  try {
    const eventRef = db.collection(DBCollections.EVENTS).doc(request.event_id);
    const eventDoc = await eventRef.get();

    if (!eventDoc.exists) {
      throw new ApiError("Event not found", 404, "EVENT_NOT_FOUND");
    }

    const eventData = eventDoc.data();

    const settingsRef = db
      .collection(DBCollections.SETTINGS)
      .doc("afAlVv2KI0uFFxATwX8C");

    await settingsRef.set({
      ...request,
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
    });

    return {
      settings_id: settingsRef.id,
      event_id: request.event_id,
      name: eventData?.name,
      description: eventData?.description,
      type: request.type,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("An unexpected error occurred", 500, "INTERNAL_ERROR");
  }
}

export async function getEventSettings() {
  try {
    const settingsRef = await db
      .collection(DBCollections.SETTINGS)
      .limit(1)
      .get();

    const settingsDoc = settingsRef.docs[0];

    if (!settingsDoc.exists) {
      throw new ApiError("Settings not found", 404, "SETTINGS_NOT_FOUND");
    }

    const event_id = settingsDoc.data()?.event_id;

    const eventRef = db.collection(DBCollections.EVENTS).doc(event_id);
    const eventDoc = await eventRef.get();

    if (!eventDoc.exists) {
      throw new ApiError("Event not found", 404, "EVENT_NOT_FOUND");
    }

    const eventData = eventDoc.data();

    return {
      settings_id: settingsDoc.id,
      event_id: event_id,
      name: eventData?.name,
      description: eventData?.description,
      type: settingsDoc.data()?.type,
      created_at: settingsDoc.data()?.created_at.toDate().toISOString(),
      updated_at: settingsDoc.data()?.updated_at.toDate().toISOString(),
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("An unexpected error occurred", 500, "INTERNAL_ERROR");
  }
}
