import { useState, useEffect } from 'react'
import useMarvelService from '../../services/MarvelService'

import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner'

import './comicsList.scss';

const ComicsList = () => {
    const [comicsList, setComicsList] = useState([])
    const [offset, setOffset] = useState(2000)
    const [newItemsLoading, setNewItemsLoading] = useState(false)
    const [comicsEnded, setComicsEnded] = useState(false)

    const {loading, error, getAllComics} = useMarvelService()

    useEffect(() => {
        onRequest(offset, true)
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewItemsLoading(false) : setNewItemsLoading(true)

        getAllComics(offset)
            .then(onComicsListLoaded)
    }

    const onComicsListLoaded = (newComicsList) => {
        let ended = false
        if (newComicsList.length < 8) {
            ended = true
        }

        setComicsList(comics => [...comics, ...newComicsList])
        setOffset(offset => offset + 8)
        setNewItemsLoading(false)
        setComicsEnded(ended)
    }

    const renderItems = (array) => {
        const items = array.map(({id, title, thumbnail, price}) => {
            return (
                <li
                    key={id}
                    className="comics__item">
                    <a href="#">
                        <img src={thumbnail} alt="ultimate war" className="comics__item-img"/>
                        <div className="comics__item-name">{title}</div>
                        <div className="comics__item-price">{price}</div>
                    </a>
                </li>
            )
        })

        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }

    const items = renderItems(comicsList)

    const errorMessage = error ? <ErrorMessage /> : null
    const spinner = loading && !newItemsLoading ? <Spinner /> : null

    return (
        <div className="comics__list">
            {items}
            {errorMessage}
            {spinner}
            <button
                className="button button__main button__long"
                style={comicsEnded ? {display: 'none'} : null}
                disabled={newItemsLoading}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;

