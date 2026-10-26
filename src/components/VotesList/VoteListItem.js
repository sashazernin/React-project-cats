import React, {useEffect, useState} from 'react';
import c from './VotesList.module.css';
import {ThumbDownIcon, ThumbUpIcon} from '../Vote/VoteIcons';
import {imagesAPI} from '../../features/Api';
import {useCheckFavorite} from '../../features/hooks/useCheckFavorite';

const VoteListItem = ({vote, onDelete, openPopup}) => {
    const [imageUrl, setImageUrl] = useState(vote.image?.url ?? null)
    const [imageFailed, setImageFailed] = useState(false)

    useEffect(() => {
        if (vote.image?.url) {
            setImageUrl(vote.image.url)
            setImageFailed(false)
            return
        }
        if (!vote.image_id) {
            setImageUrl(null)
            return
        }
        let cancelled = false
        imagesAPI.getImageById(vote.image_id)
            .then((resp) => {
                if (!cancelled && resp.data?.url) {
                    setImageUrl(resp.data.url)
                    setImageFailed(false)
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setImageFailed(true)
                }
            })
        return () => {
            cancelled = true
        }
    }, [vote.image?.url, vote.image_id])

    const liked = vote.value === 1
    const [favoriteData, , setFavoriteData] = useCheckFavorite(vote.image_id)

    const openImagePopup = () => {
        if (!imageUrl || imageFailed || !openPopup) {
            return
        }
        openPopup(
            favoriteData.favoriteId,
            vote.image_id,
            imageUrl,
            favoriteData.isFavorite,
            setFavoriteData
        )
    }

    return (
        <li className={c.card}>
            <div
                className={imageUrl && !imageFailed ? `${c.media} ${c.mediaClickable}` : c.media}
                onClick={openImagePopup}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        openImagePopup()
                    }
                }}
                role={imageUrl && !imageFailed ? 'button' : undefined}
                tabIndex={imageUrl && !imageFailed ? 0 : undefined}
                aria-label={imageUrl && !imageFailed ? 'Open image' : undefined}
            >
                {imageUrl && !imageFailed ? (
                    <img
                        className={c.photo}
                        src={imageUrl}
                        alt="Cat"
                        onError={() => setImageFailed(true)}
                    />
                ) : (
                    <div className={c.photoPlaceholder}>🐱</div>
                )}
            </div>
            <div className={c.cardFooter}>
                <span className={liked ? c.choiceLike : c.choiceDislike}>
                    {liked ? (
                        <>
                            <ThumbUpIcon className={c.choiceIcon}/>
                            Liked
                        </>
                    ) : (
                        <>
                            <ThumbDownIcon className={c.choiceIcon}/>
                            Disliked
                        </>
                    )}
                </span>
                <button
                    type="button"
                    className={c.deleteButton}
                    onClick={() => onDelete(vote.id)}
                    aria-label="Delete vote"
                >
                    Delete
                </button>
            </div>
        </li>
    )
}

export default VoteListItem
