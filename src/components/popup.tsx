import { useAtom } from "jotai";
import { updatingAtom } from "../atoms/updating"
import { functionAtom } from "../atoms/function";

export default function Popup() {

    const [updating, setUpdating] = useAtom(updatingAtom);
    const [functione, setFunction] = useAtom(functionAtom);

    function updateTwice() {
        setUpdating(false);
        setUpdating(true);
    }

    return (
        <div className="absolute w-20 text-black bg-white z-[10000] p-4 outerbox">
            <div className="text-white">Enter function (LATEX):</div>
            <div className="flex flex-row justify-between gap-2 innerbox">
                <div>z = </div>
                <input className="w-20 input" placeholder="sinxcosy" value={functione} onChange={(e) => setFunction(e.target.value)}></input>
            </div>
            <button className="bg-red-500 button" onClick={() => updating ? (updateTwice()) : (setUpdating(true))}>Submit</button>
        </div>
    )
}