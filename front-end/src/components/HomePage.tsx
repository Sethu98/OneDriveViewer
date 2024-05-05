import {SERVER_URL} from "../constants";


export function HomePage() {
    return (
        <div className={'txt-center'}>
            <h1>Welcome to One Drive Viewer</h1>
            <p>You need to login to microsoft to continue</p>
            <a href={SERVER_URL + '/login'}>Click to login</a>
        </div>
    );
}