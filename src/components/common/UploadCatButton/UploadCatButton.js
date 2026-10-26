import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import cta from '../../../styles/primaryCta.module.css';
import c from './UploadCatButton.module.css';
import {UploadFileIcon} from '../../Upload/UploadIcon';
import Preloader from '../Preloader/Preloader';
import {uploadImage} from '../../../features/slices/UploadSlice';

const UploadCatButton = ({className, compact = false, onError, onSuccess}) => {
    const dispatch = useDispatch()
    const subscriberName = useSelector((state) => state.Subscriber.SubscriberName)
    const imageIsLoading = useSelector((state) => state.upload.imageIsLoading)
    const onUploadImage = async (e) => {
        const file = e.target.files?.[0]
        e.target.value = ''
        if (!file) {
            return
        }
        if (file.size <= 262144) {
            await dispatch(uploadImage([{
                file,
                sub_id: subscriberName,
            }, onError, onSuccess]))
        } else if (file.type !== 'image/jpeg') {
            onError?.('Your image is too big. Max size is 250kb. Try to convert your image to jpg')
        } else {
            onError?.('Your image is too big. Max size is 250kb')
        }
    }

    return (
        <label
            className={`${cta.cta} ${c.root} ${compact ? c.compact : ''} ${className ?? ''}`}
        >
            {imageIsLoading ? (
                <span className={c.loader} aria-hidden="true">
                    <Preloader/>
                </span>
            ) : (
                <UploadFileIcon className={c.icon}/>
            )}
            <span className={`${c.label} ${c.labelText}`}>Upload a cat</span>
            <input
                type="file"
                onChange={onUploadImage}
                accept="image/*"
                className={c.input}
                aria-label="Upload a cat image"
                disabled={imageIsLoading}
            />
        </label>
    )
}

export default UploadCatButton;
