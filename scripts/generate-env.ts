#!/usr/bin/env ts-node

import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import prompts, { PromptObject } from 'prompts'

// Load existing .env if present
const envPath = path.resolve(process.cwd(), '.env')
const examplePath = path.resolve(process.cwd(), '.env.example')

const existingEnv = fs.existsSync(envPath)
  ? dotenv.parse(fs.readFileSync(envPath))
  : {}

const exampleEnv = fs.existsSync(examplePath)
  ? dotenv.parse(fs.readFileSync(examplePath))
  : {}

async function main() {
  const questions: PromptObject<string>[] = Object.entries(exampleEnv).map(
    ([key, defaultValue]) => ({
      type: 'text',
      name: key,
      message: `Enter value for ${key}:`,
      initial: existingEnv[key] || defaultValue,
    })
  )

  const answers = await prompts(questions, {
    onCancel: () => {
      console.log('Cancelled.')
      process.exit(1)
    },
  })

  const mergedEnv = {
    ...existingEnv,
    ...answers,
  }

  const content = Object.entries(mergedEnv)
    .map(([key, val]) => `${key}=${val}`)
    .join('\n')

  fs.writeFileSync(envPath, content)
  console.log(`✅ .env file generated at ${envPath}`)
}

main()
