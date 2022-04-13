import {useState, useEffect, useRef} from 'react'
import PropTypes from 'prop-types';
import useMarvelService from '../../services/MarvelService'

import Spinner from '../spinner/Spinner'
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

const CharList = (props) => {
    const [charList, setCharList] = useState([])
    const [newItemLoading, setNewItemLoading] = useState(false)
    const [offset, setOffset] = useState(210)
    const [charEnded, setCharEnded] = useState(false)

    const {loading, error, getAllCharacters} = useMarvelService()

    useEffect(() => {
        onRequest(offset, true)
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true)
        getAllCharacters(offset)
            .then(onCharListLoaded)
    }

    const onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        setCharList(charList => [...charList, ...newCharList])
        setNewItemLoading(false)
        setOffset(offset => offset + 9)
        setCharEnded(ended)
    }

    const itemsRefs = useRef([])

    const focusOnItem = (id) => {
        itemsRefs.current.forEach(item => item.classList.remove('char__item_selected'))
        itemsRefs.current[id].classList.add('char__item_selected')
        itemsRefs.current[id].focus()
    }

    function renderItems(arr) {
        const items = arr.map(({name, thumbnail, id}, index) => {
            const styleForThumbnail = thumbnail.includes('image_not_available')
            const clazz = styleForThumbnail ? {objectFit: 'fill'} : null

            return (
                <li
                    key={id}
                    ref={el => itemsRefs.current[index] = el}
                    tabIndex={0}
                    className="char__item"
                    onClick={() => {
                        props.onCharSelected(id)
                        focusOnItem(index)
                    }}
                    onKeyPress={e => {
                        if (e.key === ' ' || e.key === 'Enter') {
                            props.onCharSelected(id)
                            focusOnItem(index)
                        }
                    }}>
                        <img style={clazz} src={thumbnail} alt={name}/>
                        <div className="char__name">{name}</div>
                </li>
            )
        })

        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }
            
    const items = renderItems(charList)
    
    const errorMessage = error ? <ErrorMessage /> : null
    const spinner = loading && !newItemLoading ? <Spinner /> : null

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {items}
            <button
                style={{'display': charEnded ? 'none' : 'block'}}
                className="button button__main button__long"
                disabled={newItemLoading}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;