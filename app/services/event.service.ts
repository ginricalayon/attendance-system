import { ICreateEventRequest, IEvent, IUpdateEventRequest } from "../lib/schema/event.schema";
import axios from "axios";

export interface EventsApiResponse {
  success: boolean;
  data: (IEvent & { event_id: string })[];
}

export interface EventApiResponse {
  success: boolean;
  data: IEvent & { event_id: string };
}

export const getEvents = async () => {
  const { data } = await axios.get<EventsApiResponse>("/api/event");
  return data.data;
};

export const createEvent = async (payload: ICreateEventRequest) => {
  const { data } = await axios.post<EventApiResponse>("/api/event", payload);
  return data.data;
};

export const updateEvent = async ({ id, data }: { id: string; data: IUpdateEventRequest }) => {
  const response = await axios.patch<EventApiResponse>(`/api/event/${id}`, data);
  return response.data.data;
};

export const deleteEvent = async (id: string) => {
  const { data } = await axios.delete<EventApiResponse>(`/api/event/${id}`);
  return data.data;
};
