const storageKey = (subId) => `catapp:hiddenVotes:${subId}`

export function getHiddenVoteIds(subId) {
    if (!subId) {
        return new Set()
    }
    try {
        const raw = sessionStorage.getItem(storageKey(subId))
        if (!raw) {
            return new Set()
        }
        const ids = JSON.parse(raw)
        return new Set(Array.isArray(ids) ? ids : [])
    } catch {
        return new Set()
    }
}

export function hideVoteId(subId, voteId) {
    const hidden = getHiddenVoteIds(subId)
    hidden.add(voteId)
    sessionStorage.setItem(storageKey(subId), JSON.stringify([...hidden]))
}

export function filterHiddenVotes(subId, votes) {
    const hidden = getHiddenVoteIds(subId)
    if (!hidden.size) {
        return votes
    }
    return votes.filter((vote) => !hidden.has(vote.id))
}
