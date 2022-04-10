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
import ButtonApply from "../components/atoms/ButtonApply";
import InputItem from "../components/atoms/InputItem";
import HeaderOne from "../components/atoms/HeaderOne";

const client = create('https://ipfs.infura.io:5001/api/v0');


const ListApplyPage = () => {
    const { Content } = Layout;
    const navigate = useNavigate();

    const [file, setFile] = useState(null);
    const [listName, setListname] = useState("");
    const [listDes, setListDes] = useState("");

    const handleGoToListMainPage = () => navigate(`/`)
    const handleGoToListApplicantsPage = () => navigate(`/list/applicants`)
    const handleGoToListApplicantsPageWithNewApplicant = (listURL) => navigate(`/list/applicants`, { state: { applicantURL: listURL } })


    const retrieveFile = (e) => {
        const data = e.target.files[0];
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(data);
        reader.onloadend = () => {
            // console.log("Buffer data: ", Buffer(reader.result));
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
            handleGoToListApplicantsPageWithNewApplicant(listURL)

        } catch (error) {
            console.log(error.message);
        }
    };


    return (
        <Layout>
            <HeaderDobbyLabs />
            <Content className="content">
                <HeaderOne>Apply new list</HeaderOne>
                <ButtonRedirect onClick={handleGoToListMainPage}> Go back to main page </ButtonRedirect>
                <ButtonRedirect onClick={handleGoToListApplicantsPage}> Show list applicants </ButtonRedirect>

                <form onSubmit={handleSubmit}>
                    <span> List name: </span>
                    <InputItem type="text" name="listName" placeholder="listName" onChange={e => setListname(e.target.value)} /> <br></br>
                    List description:
                    <InputItem type="text" name="listDes" placeholder="listDes" onChange={e => setListDes(e.target.value)} />  <br></br>
                    <input type="file" name="listImg" onChange={retrieveFile} /> <br></br>
                    <ButtonApply type="submit"> Apply list </ButtonApply>
                </form>
            </Content>
            <FooterDobbyLabs />
        </Layout>
    )
};

export default ListApplyPage;
