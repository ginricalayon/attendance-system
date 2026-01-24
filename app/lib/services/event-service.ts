import {
  ICreateEventRequest,
  IUpdateEventRequest,
} from "../schema/event.schema";
import { db } from "../firebase/admin";
import { DBCollections } from "../schema/enums.schema";
import { ApiError } from "@/app/types";
import { FieldValue } from "firebase-admin/firestore";

export async function createEvent(request: ICreateEventRequest) {
  try {
    const existingEvent = await db
      .collection(DBCollections.EVENTS)
      .where("name", "==", request.name)
      .get();

    if (existingEvent.docs.length > 0) {
      throw new ApiError("Event already exists", 400, "EVENT_ALREADY_EXISTS");
    }

    const eventRef = db.collection(DBCollections.EVENTS).doc();

    await eventRef.set({
      ...request,
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
    });

    return {
      event_id: eventRef.id,
      name: request.name,
      description: request.description,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("An unexpected error occurred", 500, "INTERNAL_ERROR");
  }
}

export async function getEvents() {
  try {
    const events = await db
      .collection(DBCollections.EVENTS)
      .orderBy("created_at", "desc")
      .get();

    return events.docs.map((doc) => ({
      event_id: doc.id,
      name: doc.data().name,
      description: doc.data().description,
      created_at: doc.data().created_at.toDate().toISOString(),
      updated_at: doc.data().updated_at.toDate().toISOString(),
    }));
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("An unexpected error occurred", 500, "INTERNAL_ERROR");
  }
}

export async function updateEvent(request: IUpdateEventRequest, id: string) {
  try {
    const eventRef = db.collection(DBCollections.EVENTS).doc(id);
    const eventDoc = await eventRef.get();

    if (!eventDoc.exists) {
      throw new ApiError("Event not found", 404, "EVENT_NOT_FOUND");
    }

    const eventData = eventDoc.data();

    if (request.name !== undefined && eventData?.name !== request.name) {
      const existingEvent = await db
        .collection(DBCollections.EVENTS)
        .where("name", "==", request.name)
        .get();

      if (existingEvent.docs.length > 0) {
        throw new ApiError("Event already exists", 400, "EVENT_ALREADY_EXISTS");
      }
    }

    const updateData: Record<string, unknown> = {
      updated_at: FieldValue.serverTimestamp(),
    };

    if (request.name !== undefined) {
      updateData.name = request.name;
    }

    if (request.description !== undefined) {
      updateData.description = request.description;
    }

    await eventRef.update(updateData);

    return {
      event_id: id,
      created_at: eventData?.created_at.toDate().toISOString(),
      updated_at: new Date().toISOString(),
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("An unexpected error occurred", 500, "INTERNAL_ERROR");
  }
}

export async function deleteEvent(id: string) {
  try {
    const eventRef = db.collection(DBCollections.EVENTS).doc(id);
    const eventDoc = await eventRef.get();
    if (!eventDoc.exists) {
      throw new ApiError("Event not found", 404, "EVENT_NOT_FOUND");
    }

    await eventRef.delete();

    return {
      event_id: id,
      created_at: eventDoc.data()?.created_at.toDate().toISOString(),
      updated_at: new Date().toISOString(),
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("An unexpected error occurred", 500, "INTERNAL_ERROR");
  }
}

export async function getEvent(id: string) {
  try {
    const eventRef = db.collection(DBCollections.EVENTS).doc(id);
    const eventDoc = await eventRef.get();

    if (!eventDoc.exists) {
      throw new ApiError("Event not found", 404, "EVENT_NOT_FOUND");
    }

    return {
      event_id: id,
      name: eventDoc.data()?.name,
      description: eventDoc.data()?.description,
      created_at: eventDoc.data()?.created_at.toDate().toISOString(),
      updated_at: eventDoc.data()?.updated_at.toDate().toISOString(),
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("An unexpected error occurred", 500, "INTERNAL_ERROR");
  }
}
