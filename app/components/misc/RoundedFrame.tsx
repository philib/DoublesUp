import React, {CSSProperties, ReactNode, useEffect, useRef} from "react";
import styles from '../../app.module.css'

export const RoundedFrame: React.FunctionComponent<{
    style?: CSSProperties,
    test?: string,
    children: ReactNode | ReactNode[]
}> = ({style, children, test}) => {
    const ref = useRef<HTMLDivElement | null>(null)
    const [maxContentHeight, setMaxContentHeight] = React.useState<string | null>(null);
    useEffect(() => {
        if (ref && ref.current && ref.current.clientHeight) {
            setMaxContentHeight(`${Math.min(window.innerHeight, ref.current.clientHeight)}px`)
            console.log(test, 'ref', ref, 'maxContentHeight', Math.min(window.innerHeight, ref.current.clientHeight))
        }
    }, [ref, ref.current, ref.current?.clientHeight])
    console.log("rendered", test)
    const padding = 20;
    return (
        <div
            ref={ref} style={{
            height: maxContentHeight ?? '100%',
            // visibility: ref == null || maxContentHeight === null ? 'hidden' : 'visible'
        }}>
            <div
                className={`${styles.noScrollbar} ${styles.roundedCorners}`}
                style={{
                    ...style,
                    position: 'relative',
                    overflow: 'auto',
                    top: `${padding}px`,
                    right: `-${padding}px`,
                    width: `calc(100% - ${padding * 2}px)`,
                    height: '100%',
                    maxHeight: `calc(100% - ${padding * 2}px)`,
                }}>
                {children}
            </div>
        </div>
    );
}