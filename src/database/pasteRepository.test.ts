import { createPaste, findPaste, updatePaste, deletePaste } from './pasteRepository'
import { db } from './database'
//import { Paste } from '@/types/database'

const testUUID = 'test-paste-uuid'
const basePaste = {
  uuid: testUUID,
  content: 'console.log("Hello, world!")',
  language: 'javascript',
  hasPassword: false,
  views: 0,
  duration: 10, 
  createdAt: new Date(),
}

describe('Paste Repository', () => {
  afterAll(async () => {
    await db.deleteFrom('paste').where('uuid', '=', testUUID).execute()
  })

  it('should create a new paste', async () => {
    const created = await createPaste(basePaste)
    expect(created).toMatchObject(basePaste)
  })

  it('should not allow duplicate UUIDs', async () => {
    await expect(createPaste(basePaste)).rejects.toThrow()
  })

  it('should find a paste by uuid', async () => {
    const found = await findPaste(testUUID)
    expect(found).not.toBeNull()
    expect(found?.uuid).toBe(testUUID)
  })

  it('should return undefined for nonexistent uuid', async () => {
    const result = await findPaste('non-existent-uuid')
    expect(result).toBeUndefined()
  })

  it('should update a paste', async () => {
    await updatePaste(testUUID, { views: 42 })
    const updated = await findPaste(testUUID)
    expect(updated?.views).toBe(42)
  })

  it('should delete a paste', async () => {
    const deleted = await deletePaste(testUUID)
    expect(deleted?.uuid).toBe(testUUID)

    const afterDelete = await findPaste(testUUID)
    expect(afterDelete).toBeUndefined()
  })

  it('should return undefined when deleting a non-existent paste', async () => {
    const result = await deletePaste('non-existent-uuid')
    expect(result).toBeUndefined()
  })
})
