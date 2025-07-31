"use client"

import { useEffect, useState } from "react"
import { Paste } from "@/types/database"
import { SUPPORTED_LANGUAGES } from "@/config"


import TextEditor from "../TextEditor"
import { decryptText } from "@/utils/encryption"
import InfoCard from "../InfoCard"
import CopyButton from "../CopyButton"
import { getTimeRemaining } from "@/utils"
import PasswordModal from "./PasswordModal"
import { toast } from "react-toastify"

interface PasteViewerProps {
  paste: Paste
  secret: string
}

const PasteViewer = ({ paste, secret }: PasteViewerProps) => {
  const [decryptedPaste, setDecryptedPaste] = useState("")
  const selectedLanguage = SUPPORTED_LANGUAGES.find(lang => lang.value === paste.language)
  const [timeRemaining, setTimeRemaining] = useState("")
  const [documentURL, setDocumentURL] = useState("");
  const [openPasswordModal, setOpenPasswordModal] = useState(false)
  const [isPasswordDecrypting, setIsPasswordDecrypting] = useState(false)

  const handlePasswordSubmit = async (password: string) => {
    if (!password.trim()) {
      toast.error("Password cannot be empty")
      return
    }
    setIsPasswordDecrypting(true)

    try {
      const decryptedText = await decryptText(paste.content, secret, password)
      setDecryptedPaste(decryptedText)
      setOpenPasswordModal(false)
      toast.success("Success")
    } catch {
      toast.error("Incorrect Password")
    } finally {
      setIsPasswordDecrypting(false)
    }
  }

  const prepare = async () => {
    setTimeRemaining(getTimeRemaining(paste.expiresAt))
    setDocumentURL(window.location.href);

    if (!paste.hasPassword) {
      const content = await decryptText(paste.content, secret, "")
      setDecryptedPaste(content)
      return
    } 

    setOpenPasswordModal(true)
  }

  useEffect(() => {
    prepare()
  }, [])


  return (
    <>
      <PasswordModal 
        isSubmitting={isPasswordDecrypting}
        isOpen={openPasswordModal} 
        onSubmit={handlePasswordSubmit}
      />
      {paste.views === 0 && (
        <InfoCard variant="success">
          <div className="flex flex-row gap-3">
            <div>Document URL: </div>
            <a href={documentURL} target="__blank">{documentURL}</a>
            <CopyButton 
              copyText={documentURL}
            />
          </div>
        </InfoCard>
      )}

      <div className="content">
        <InfoCard variant="info">
          This document will expire after {timeRemaining}
        </InfoCard>

        {decryptedPaste && (
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
        )}
      </div>
    </>
  )
}

export default PasteViewer
