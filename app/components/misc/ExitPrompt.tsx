import {ReactNode, useEffect} from "react";
import {ChildProps} from "postcss";

export const ExitPrompt: React.FC<{children: ReactNode | ReactNode[]}> = ({children}) => {
    useEffect(()=> {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault()
            e.returnValue = ''
        }
        window.addEventListener('beforeunload', handleBeforeUnload)
        return () => window.removeEventListener('beforeunload', handleBeforeUnload)
    },[])
    return (<> {children} </>)
}
