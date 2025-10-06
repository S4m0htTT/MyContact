import {useNavigate, useParams} from "react-router";
import useContactStore from "../stores/contactStore.ts";
import {useEffect, useState} from "react";
import {Loader} from "lucide-react";

export default function EditContact() {
    const params = useParams();

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const {fetchSingleContact, singleContact} = useContactStore()
    const navigate = useNavigate();

    useEffect(() => {
        const delayFetch = setTimeout(() => {
            void fetchSingleContact(params.id ?? "000000000000000000000000").finally(() => setIsLoading(false));
        }, 250)
        return () => clearTimeout(delayFetch);
    }, []);

    const handleBack = () => {
        navigate("/")
    }

    return (
        <>
            <div onClick={handleBack}>
                <p className="text-white">Retour</p>
            </div>
            {
                isLoading ? (
                    <div className="flex justify-center items-center mt-10">
                        <div
                            className="size-16 border-[6px] text-[#616161] text-xl animate-spin border-gray-300 flex items-center justify-center border-t-[#616161] rounded-full"/>
                    </div>
                ) : (
                    <div>
                        <p className="text-white">{params.id}</p>
                        <pre className={"text-white"}>
                            {JSON.stringify(singleContact, null, 2)}
                        </pre>
                    </div>
                )
            }
        </>
    )
}