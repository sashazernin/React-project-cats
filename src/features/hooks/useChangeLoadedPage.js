import {useRef} from "react";

function useChangeLoadedPage(requestInfo, changePage){
    const pageRef = useRef()
    window.onscroll = function () {
        if (pageRef.current.getBoundingClientRect().bottom <= window.innerHeight + 500
            && !requestInfo.isLoading
            && !requestInfo.allPagesLoad
        ) {
            changePage()
        }
    }
    return [pageRef]
}

export {useChangeLoadedPage}