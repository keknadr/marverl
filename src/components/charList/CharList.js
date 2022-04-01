import {Component} from 'react'
import MarvelService from '../../services/MarvelService'
import Spinner from '../spinner/Spinner'
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';
// import abyss from '../../resources/img/abyss.jpg';
class CharList extends Component {
    state = {
        charList: [],
        loading: true,
        error: false
    }
    marvelService = new MarvelService()

    componentDidMount() {
        this.marvelService
            .getAllCharacters()
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }

    onCharListLoaded = (charList) => {
        this.setState({
            charList,
            loading: false
        })
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
        // return items
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }
        
    render() {
        const {charList, loading, error} = this.state
        
        const items = this.renderItems(charList)
        
        const errorMessage = error ? <ErrorMessage /> : null
        const spinner = loading ? <Spinner style={{gridColumn: '2/3'}} /> : null
        const content = !(loading || error) ? items  : null

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;