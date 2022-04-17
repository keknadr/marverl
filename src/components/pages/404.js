import {Link} from 'react-router-dom'

const Page404 = () => {
    return (
        <div>
            <div
                style={{marginTop: '50px', textAlign: 'center', fontSize: '50px', fontWeight: '700'}}>
                No found <br /> 404 error
            </div>
            <Link
                style={{marginTop: '30px', display: 'block', textAlign: 'center', fontSize: '30px'}}
                to='/'>Go back</Link>
        </div>
    )
}

export default Page404