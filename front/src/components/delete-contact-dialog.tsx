import type {Contact} from "../models/contact.ts";
import {X} from "lucide-react";
import useContactStore from "../stores/contactStore.ts";

interface DeleteContactDialogProps {
    contact: Contact
    onClose: () => void
}

export default function DeleteContactDialog({contact, onClose}: DeleteContactDialogProps) {

    const {deleteContact} = useContactStore()

    const handleDeleteContact = async() => {
        await deleteContact(contact._id)
        onClose()
    }

    return (
        <div className="flex items-center overflow-x-hidden">
            <div className="fixed inset-0 w-screen h-screen bg-black/75"/>
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 w-xl bg-black border border-white/30 rounded-lg shadow-md shadow-white/10">
                <div>
                    <X
                        strokeWidth={1.5}
                        className="ml-auto cursor-pointer"
                        onClick={onClose}
                    />
                </div>
                <div>
                    <h1 className="text-lg font-medium">Suppression de <b>{contact.firstName} {contact.lastName}</b></h1>
                    <p className="text-[#bebebe] mt-2 text-muted-foreground text-sm">
                        Êtes-vous sûr de vouloir supprimer le contact <b>{contact.firstName} {contact.lastName}</b> ?<br />
                        Cette action est irréversible.
                    </p>
                </div>
                <div className="flex justify-end gap-4 mt-4">
                    <button
                        className="text-white border border-white/30 hover:border-white/45 focus:outline-none cursor-pointer px-4 py-1 rounded-sm"
                        onClick={onClose}
                    >
                        Annuler
                    </button>
                    <button
                        className="bg-red-600 text-white hover:bg-red-700 focus:outline-none cursor-pointer px-2 py-1 rounded-sm"
                        onClick={handleDeleteContact}
                    >
                        Supprimer
                    </button>
                </div>
            </div>
        </div>
    )
}