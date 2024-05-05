import {useEffect} from "react";
import {initStore} from "../redux/store";
import {useSelector} from "react-redux";
import {FileItem, ReduxState} from "../redux/slice";
import {List, ListItem} from "@mui/material";
import {Description, Folder} from "@mui/icons-material";

function FileComponent(props: FileItem) {
    return (
        <ListItem>
            <Description sx={{ pr: 1 }}/>
            <div>
                {props.name}
            </div>
        </ListItem>

    )
}

function FolderComponent(props: FileItem) {
    return (
        <ListItem>
            <Folder sx={{ pr: 1 }}/>
            <div>
                {props.name}
            </div>
        </ListItem>
    )
}

function Item(props: FileItem) {
    return (
        <List>
            {props.type == 'file' ? <FileComponent {...props} /> : <FolderComponent  {...props}/>}
        </List>
    );
}

export function MainPage() {
    useEffect(() => {
        initStore()
    }, []); // Empty dependency array (Run only once)


    const files = useSelector((state: ReduxState) => {
        state = state.default ? state.default : state;
        console.log(state);
        return state.files;
    });
    console.log(files);


    return (
        <div>
            {
                files && files.map(fileItem => <Item {...fileItem} />)
            }
        </div>
    )
}