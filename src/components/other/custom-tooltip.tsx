import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export const CustomTooltip = ({
                                  content,
                                  children,
                                  side = "top",
                                  offset = 8,
                              }: {
    content: React.ReactNode;
    children: React.ReactNode;
    side?: "top" | "bottom" | "left" | "right";
    offset?: number;
}) => {
    const [show, setShow] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (show && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();

            let top = rect.top;
            let left = rect.left;

            switch (side) {
                case "top":
                    top = rect.top - offset;
                    left = rect.left + rect.width / 2;
                    break;
                case "bottom":
                    top = rect.bottom + offset;
                    left = rect.left + rect.width / 2;
                    break;
                case "left":
                    top = rect.top + rect.height / 2;
                    left = rect.left - offset;
                    break;
                case "right":
                    top = rect.top + rect.height / 2;
                    left = rect.right + offset;
                    break;
            }

            setCoords({ top, left });
        }
    }, [show, side, offset]);

    return (
        <>
            <div
                ref={triggerRef}
                style={{ display: "inline-block" }}
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
            >
                {children}
            </div>

            {show &&
                createPortal(
                    <div
                        style={{
                            position: "fixed",
                            top: coords.top,
                            left: coords.left,
                            transform: "translate(-50%, -100%)",
                            background: "#333",
                            color: "#fff",
                            padding: "6px 10px",
                            borderRadius: 6,
                            fontSize: 12,
                            whiteSpace: "nowrap",
                            zIndex: 9999,
                            pointerEvents: "none",
                        }}
                    >
                        {content}
                    </div>,
                    document.body
                )}
        </>
    );
};