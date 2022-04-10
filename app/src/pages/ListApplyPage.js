import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom'
import { Layout } from 'antd';
import { Button, Form, FormControl, InputGroup } from "react-bootstrap";
import { useFormik } from 'formik'
import ButtonRedirect from "../components/atoms/ButtonRedirect";
import HeaderDobbyLabs from "../components/organisms/HeaderDobbyLabs";
import FooterDobbyLabs from "../components/organisms/FooterDobbyLabs";
import { Buffer } from "buffer"
import { create } from "ipfs-http-client";

const client = create('https://ipfs.infura.io:5001/api/v0');


const ListApplyPage = () => {
    const { Content } = Layout;
    const navigate = useNavigate();

    const [file, setFile] = useState(null);
    const [listName, setListname] = useState("");
    const [listDes, setListDes] = useState("");

    const handleGoToListMainPage = () => navigate(`/`)
    const handleGoToListApplicantsPage = () => navigate(`/list/applicants`)
    // const handleGoToListApplicantsPageWithNewApplicant = (listURL) => navigate(`/list/applicants`, { applicantURL: listURL })
    const handleaaa = (listURL) => navigate(`/list/applicants`, { state: { applicantURL: listURL } })

    const [items, setItems] = useState([])

    // useEffect(() => {
    //     fetch("https://ipfs.infura.io/ipfs/QmVEGHvpxE1k3UKrwdNMAoWmd5Yeu6AtcCQ8oavZU8qCzw")
    //         .then(res => res.json())
    //         .then(
    //             (result) => {
    //                 setItems(result);

    //             },
    //             (error) => {
    //                 console.log(error)
    //             }
    //         )
    // }, [])


    const retrieveFile = (e) => {
        const data = e.target.files[0];
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(data);
        reader.onloadend = () => {
            console.log("Buffer data: ", Buffer(reader.result));
            setFile(Buffer(reader.result));
        }

        e.preventDefault();
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const imgIPFS = await client.add(file);
            const imgURL = `https://ipfs.infura.io/ipfs/${imgIPFS.path}`;
            console.log(`imgURL: ${imgURL}`)

            const listIPFS = await client.add(`{"listApplicantName": "${listName}", "listApplicantDes": "${listDes}", "listApplicantImg": "${imgURL}"}`);
            const listURL = `https://ipfs.infura.io/ipfs/${listIPFS.path}`;
            console.log(`finalURL: ${listURL}`)
            handleaaa(listURL)

        } catch (error) {
            console.log(error.message);
        }
    };


    return (
        <Layout>
            <HeaderDobbyLabs />
            <Content className="content">
                <h1>Apply new list</h1>
                <ButtonRedirect onClick={handleGoToListMainPage}> Go back to main page </ButtonRedirect>
                <ButtonRedirect onClick={handleGoToListApplicantsPage}> Show list applicants </ButtonRedirect>

                <form className="form" onSubmit={handleSubmit}>
                    List name:
                    <input type="text" name="listName" placeholder="listName" onChange={e => setListname(e.target.value)} /> <br></br>
                    List description:
                    <input type="text" name="listDes" placeholder="listDes" onChange={e => setListDes(e.target.value)} />  <br></br>
                    <input type="file" name="listImg" onChange={retrieveFile} /> <br></br>
                    <button type="submit" className="btn">Apply list</button>
                </form>
            </Content>
            <FooterDobbyLabs />
        </Layout>
    )
};

export default ListApplyPage;
