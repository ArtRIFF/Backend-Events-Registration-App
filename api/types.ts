import { ObjectId } from "mongodb"

export type TEventsCard = {
    _id: ObjectId,
    title: string,
    description: string,
    event_date: string,
    organizer: string
}

export type TParticipan = {
    _id: ObjectId,
    name: string,
    email: string
}
