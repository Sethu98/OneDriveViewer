import {useEffect, useState} from "react";
import {initStore} from "../redux/store";
import {useSelector} from "react-redux";
import {FileItem, ReduxState} from "../redux/slice";
import {Box, Button, List, ListItem, Modal} from "@mui/material";
import {Description, Download, Folder} from "@mui/icons-material";



const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function FileComponent(props: FileItem) {
    let [isModalOpen, setModalOpen] = useState(false);

    return (
        <div>
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

                <Button
                    variant="contained"
                    onClick={() => setModalOpen(true)}
                >
                    View permissions
                </Button>
            </ListItem>
            <Modal
                // className={'permission-modal'}
                open={isModalOpen}
                onClose={() => setModalOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle}>
                    <ul>
                        {props.users.map((user, ind) => <li id={String(ind)}>{user}</li>)}
                    </ul>
                </Box>
            </Modal>
        </div>
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