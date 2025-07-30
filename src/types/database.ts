import {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely'

export interface PasteTable {
  id: Generated<number>,
  uuid: string
  content: string 
  language: string 
  hasPassword: ColumnType<boolean, boolean | number, boolean | number>
  views: number
  duration: number
  createdAt: Generated<Date>,
}

export type Paste = Selectable<PasteTable>
export type NewPaste = Insertable<PasteTable>
export type PasteUpdate = Updateable<PasteTable>

export interface Database {
  paste: PasteTable
}
