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
    width: 800,
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
                    style={{transform: "scale(0.7)"}}
                    variant="contained"
                    onClick={() => setModalOpen(true)}
                >
                    Sharing Info
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

                    <div>
                        <h3 className={'txt-center'}>{props.name}</h3>
                        {props.users.length ?
                            <div>
                                <p>Shared with</p>
                                <ul>
                                    {props.users.map((user, ind) => <li id={String(ind)}>{user}</li>)}
                                </ul>
                            </div>
                            :
                            <p className={'txt-center'}>This file is not shared with anybody else</p>}
                    </div>


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

export function FilesView(props: { id: number }) {
    const files = useSelector((state: ReduxState) => {
        state = state.default ? state.default : state;
        return state.files;
    });

    console.log(Object.keys(files).map(id => files[id].name));

    return (
        <div>
            <p hidden={true}>{props.id}</p>
            {
                files && Object.keys(files).map((itemId, ind) => <Item key={ind} {...files[itemId]} />)
            }
        </div>
    )
}