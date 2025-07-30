import { db } from "./database"
import { NewPaste, PasteUpdate } from "@/types/database"

export const pasteTablename = "paste"

export const findPaste = async (uuid: string) => {
  return await db.selectFrom(pasteTablename)
    .where("uuid", "=", uuid)
    .selectAll()
    .executeTakeFirst()
}

export const createPaste = async (paste: NewPaste) => {
  return await db.insertInto(pasteTablename)
    .values(paste)
    .returningAll()
    .executeTakeFirstOrThrow()
}

export const updatePaste = async (uuid: string, updateWith: PasteUpdate) => {
  await db.updateTable(pasteTablename).set(updateWith).where('uuid', '=', uuid).execute()
}

export const deletePaste = async (uuid: string) => {
  return await db.deleteFrom(pasteTablename)
    .where("uuid", "=", uuid)
    .returningAll()
    .executeTakeFirst()
}
