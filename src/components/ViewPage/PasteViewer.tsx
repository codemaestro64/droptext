"use client"

import { useEffect, useState } from "react"
import { Paste } from "@/types/database"
import { SUPPORTED_LANGUAGES } from "@/config"


import TextEditor from "../TextEditor"
import { decryptText } from "@/utils/encryption"
import InfoCard from "../InfoCard"
import CopyButton from "../CopyButton"
import { getTimeRemaining } from "@/utils"

interface PasteViewerProps {
  paste: Paste
  secret: string
}

const PasteViewer = ({ paste, secret }: PasteViewerProps) => {
  const [decryptedPaste, setDecryptedPaste] = useState("")
  const selectedLanguage = SUPPORTED_LANGUAGES.find(lang => lang.value === paste.language)
  const [timeRemaining, setTimeRemaining] = useState("")
  const [pasteURL, setPasteURL] = useState("");

  useEffect(() => {
    const pasteDate = new Date(paste.createdAt + "Z")

    setTimeRemaining(getTimeRemaining(pasteDate, paste.duration))
    setPasteURL(window.location.href);
    const content = decryptText(paste.content, secret, "")
    setDecryptedPaste(content)
  }, [])


  return (
    <>
      {paste.views === 1 && (
        <InfoCard variant="success">
          <div className="flex flex-row gap-3">
            <div>Document URL: </div>
            <a href={pasteURL} target="__blank">{pasteURL}</a>
            <CopyButton 
              copyText={window.location.href}
            />
          </div>
        </InfoCard>
      )}

      {paste.views === 0 && (
        <InfoCard variant="info">
          This document will expire after {timeRemaining}
        </InfoCard>
      )}

      <section className="card backdrop-blur-lg rounded-2xl shadow-2xl border-color overflow-hidden mb-8">
        <div className="card-body">
          <TextEditor
            language={selectedLanguage?.value as string}
            value={decryptedPaste}
            editable={false}
            height="auto"
          />
        </div>
      </section>
    </>
  )
}

export default PasteViewer
