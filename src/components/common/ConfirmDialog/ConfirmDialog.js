import React, {useCallback, useEffect} from 'react';
import c from './ConfirmDialog.module.css';

const ConfirmDialog = ({
    isOpen,
    title,
    message,
    confirmLabel = 'Delete',
    cancelLabel = 'Cancel',
    onConfirm,
    onCancel,
    embedded = false,
}) => {
    const escPressed = useCallback((event) => {
        if (event.keyCode === 27 && isOpen) {
            onCancel?.()
        }
    }, [isOpen, onCancel])

    useEffect(() => {
        document.addEventListener('keydown', escPressed)
        return () => document.removeEventListener('keydown', escPressed)
    }, [escPressed])

    if (!isOpen) {
        return null
    }

    const layerClass = embedded ? c.layerEmbedded : c.layerFixed

    return (
        <div
            className={layerClass}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            onClick={onCancel}
        >
            <div className={c.card} onClick={(e) => e.stopPropagation()}>
                <div className={c.header}>
                    <h2 id="confirm-dialog-title" className={c.title}>{title}</h2>
                    <button type="button" className={c.close} aria-label="Close" onClick={onCancel}/>
                </div>
                {message && (
                    <div className={c.body}>
                        <p className={c.message}>{message}</p>
                    </div>
                )}
                <div className={c.footer}>
                    <div className={c.actions}>
                        <button type="button" className={`${c.btn} ${c.btnOutline}`} onClick={onCancel}>
                            {cancelLabel}
                        </button>
                        <button type="button" className={`${c.btn} ${c.btnDanger}`} onClick={onConfirm}>
                            {confirmLabel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConfirmDialog;
