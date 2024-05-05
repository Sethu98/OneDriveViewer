import {useEffect, useState} from "react";
import {initStore} from "../redux/store";
import {useSelector} from "react-redux";
import {FileItem, ReduxState} from "../redux/slice";
import {Box, Button, List, ListItem, Modal, Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
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
        <TableRow className={'fi-li'} key={props.itemId}>
            <TableCell key={0}>
                <div className={'align-center'}>
                    <Description sx={{pr: 1}}/>
                    <span>
                        {props.name}
                    </span>
                </div>
            </TableCell>
            <TableCell key={1}>
                <Button
                    style={{transform: "scale(0.5)"}}
                    variant="contained"
                    endIcon={<Download/>}
                    href={props.downloadURL}
                    download
                >
                </Button>
            </TableCell>
            <TableCell key={2}>
                <Button
                    style={{transform: "scale(0.7)"}}
                    variant="contained"
                    onClick={() => setModalOpen(true)}
                >
                    Sharing Info
                </Button>
            </TableCell>
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
        </TableRow>
    )
}

function FolderComponent(props: FileItem) {
    return (
        <TableRow key={props.itemId}>
            <TableCell key={0}>
                <div className={'align-center'}>
                    <Folder sx={{pr: 1}}/>
                    <span>
                        {props.name}
                    </span>
                </div>
            </TableCell>
            <TableCell key={1}></TableCell>
            <TableCell key={2}></TableCell>
        </TableRow>
    )
}


export function FilesView() {
    const files = useSelector((state: ReduxState) => {
        state = state.default ? state.default : state;
        return state.files;
    });

    // console.log(Object.keys(files).map(id => files[id].name));

    return (
        <div>
            {/*<p hidden={true}>{props.id}</p>*/}
            <Table>
                <TableHead>
                    {["Name", "Download", "Sharing"].map(v => <TableCell>{v}</TableCell>)}
                </TableHead>
                <TableBody>
                    {
                        files && Object.keys(files).map((itemId, ind) =>
                            files[itemId].type == 'file' ?
                                <FileComponent key={ind} {...files[itemId]} /> :
                                <FolderComponent key={ind}  {...files[itemId]}/>
                        )
                    }
                </TableBody>
            </Table>
        </div>
    )
}