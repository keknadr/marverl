import {Component} from 'react'
import MarvelService from '../../services/MarvelService'
import Spinner from '../spinner/Spinner'
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';
class CharList extends Component {
    state = {
        charList: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210
    }
    marvelService = new MarvelService()

    onRequest = (offset) => {
        this.onCharListLoading()
        this.marvelService
            .getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }

    onCharListLoading = () => {
        this.setState({newItemLoading: true})
    }

    onCharListLoaded = (newCharList) => {
        this.setState(({charList, offset}) => ({
            charList: [...charList, ...newCharList],
            loading: false,
            newItemLoading: false,
            offset: offset + 9
        }))
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    renderItems(arr) {
        const items = arr.map(({name, thumbnail, id}) => {
            const styleForThumbnail = thumbnail.includes('image_not_available')
            const clazz = styleForThumbnail ? {objectFit: 'fill'} : null

            return (
                <li
                    key={id}
                    className="char__item"
                    onClick={() => this.props.onCharSelected(id)}>
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
        
render() {
    const {charList, loading, error, offset, newItemLoading} = this.state
    
    const items = this.renderItems(charList)
    
    const errorMessage = error ? <ErrorMessage /> : null
    const spinner = loading ? <Spinner /> : null
    const content = !(loading || error) ? items  : null

    const hideButton = offset >= 1560 ? {display: 'none'} : null

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {content}
            <button
                style={hideButton}
                className="button button__main button__long"
                disabled={newItemLoading}
                onClick={() => this.onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}
}

export default CharList;