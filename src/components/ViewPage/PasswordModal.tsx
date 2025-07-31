import Modal from 'react-modal'
import { Unlock } from 'lucide-react';
import TextInput from '../TextInput';
import { useState } from 'react';
import Button from '../Button';

interface PasswordModalProps {
  isOpen: boolean
  onSubmit: (password: string) => void
  isSubmitting: boolean
}

Modal.setAppElement('#app'); 
const modalStyle = {
  content: {
    minWidth: "400px",
  }
};

const PasswordModal = ({ isOpen, onSubmit, isSubmitting }: PasswordModalProps) => {
  const [password, setPassword] = useState("")
  
  const onClose = () => {
  }

  const handleSubmit = () => {
    onSubmit(password)
  }
  
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="card backdrop-blur-lg rounded-2xl shadow-2xl border-color p-5 w-fit h-fit my-10 outline-none focus:outline-none"
      style={modalStyle}
      parentSelector={() => document.querySelector('#app')!}
      overlayClassName="fixed inset-0 bg-black/50 flex justify-center"
    >
      <h3 className="text-base/7 font-medium text-primary" >Password Encrypted</h3>
      <p className="mt-2 text-sm/6 text-white/50">Enter password to decrypt.</p>
      <TextInput 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password" 
        className="w-[100%] my-2" 
      />
      <Button 
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="text-white px-6"
      >
        <Unlock className="w-4 h-4" />
        <span>{isSubmitting ? "Submitting..." : "Submit"}</span>
      </Button>
    </Modal>
  )
}

export default PasswordModal