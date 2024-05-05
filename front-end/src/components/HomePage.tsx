import {SERVER_URL} from "../constants";


export function HomePage() {
    return (
        <div>
            <h1>Welcome</h1>
            <p>You need to login to microsoft to continue</p>
            <a href={SERVER_URL + '/login'}>Click to login</a>
        </div>
    );
}