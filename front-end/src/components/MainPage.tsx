import {useEffect} from "react";
import {initStore} from "../redux/store";
import {useSelector} from "react-redux";
import {FileItem, ReduxState} from "../redux/slice";
import {Button, List, ListItem} from "@mui/material";
import {Description, Download, Folder} from "@mui/icons-material";

function FileComponent(props: FileItem) {
    return (
        <ListItem className={'fi-li'}>
            <Description sx={{pr: 1}}/>
            <div>
                {props.name}
            </div>
            <Button
                style={{transform: "scale(0.5)"}}
                variant="contained"
                endIcon={<Download/>}
                href={props.downloadURL}
                download
            >
            </Button>
        </ListItem>

    )
}

function FolderComponent(props: FileItem) {
    return (
        <ListItem className={'fi-li'}>
            <Folder sx={{pr: 1}}/>
            <div>
                {props.name}
            </div>
        </ListItem>
    )
}

function Item(props: FileItem) {
    return (
        <List sx={{
            padding: '10px',
        }}>
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