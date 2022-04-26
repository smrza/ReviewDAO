import { React, useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Layout } from 'antd';
import { Form, FormControl, InputGroup } from "react-bootstrap";
import { useFormik } from 'formik'
import ButtonRedirect from "../components/atoms/ButtonRedirect";
import HeaderDobbyLabs from "../components/organisms/HeaderDobbyLabs";
import FooterDobbyLabs from "../components/organisms/FooterDobbyLabs";
import { Buffer } from "buffer"
import { create } from "ipfs-http-client";
import HeaderOne from "../components/atoms/HeaderOne";
import ButtonApply from "../components/atoms/ButtonApply"

const client = create('https://ipfs.infura.io:5001/api/v0');


const AddListPage = () => {
    const { Content } = Layout;
    const navigate = useNavigate();
    const location = useLocation()

    const [file, setFile] = useState(null);
    const [listName, setListname] = useState("");
    const [listDes, setListDes] = useState("");

    const listAddress = location.state.listAddress
    const { listname } = useParams();

    const handleGoToListMainPage = () => navigate(`/`)
    const handleGoToListPage = () => navigate(`../lists/${listname}`)
    const handleGoToItemsApplicantsPage = () => navigate(`../${listname}/applicants`)
    const handleGoToListApplicantsPageWithNewApplicant = (listURL) => navigate(`/list/applicants`, { state: { applicantURL: listURL } })


    useEffect(() => {
        console.log(`listAddress: ${listAddress}`)
    })


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

    const validateInputs = async (values) => {
        const errors = {};

        if (!values.itemName) {
            errors.itemName = "You have to input the itemName"
            return errors
        }
        else if (values.itemName.includes(",")) {
            errors.itemName = "Please do not use ',' for your itemName"
            return errors
        }
    }

    const formik = useFormik({
        initialValues: {
            itemName: "",
            itemDes: "",
            itemURL: "",
            hiddenError: true,
        },
        validate: validateInputs,
        onSubmit: async (values, { resetForm }) => {
            try {
                // TODO: submit
                // TODO: redirect to applicants page
                resetForm({ values: '' })
            } catch (e) {
                alert(e)
            }
        }
    })

    return (
        <Layout>
            <HeaderDobbyLabs />

            <Content className="content">
                <HeaderOne>Apply item to the list "{listname}" </HeaderOne>
                <ButtonRedirect onClick={handleGoToListMainPage} >Go back to main page</ButtonRedirect>
                <ButtonRedirect onClick={handleGoToListPage} style={{ marginLeft: '30px' }}> Go back to list page </ButtonRedirect>
                <ButtonRedirect onClick={handleGoToItemsApplicantsPage} style={{ marginLeft: '30px' }}> Show applicants </ButtonRedirect>

                <form style={{ marginTop: '30px' }} onSubmit={formik.handleSubmit}>
                    <InputGroup className="mb-4">
                        <Form.Label><b>Item name: </b></Form.Label>
                        <FormControl
                            id="itemName"
                            placeholder="itemName"
                            onChange={formik.handleChange}
                            value={formik.values.itemName}
                        />
                        {formik.errors.itemName ? <span style={{ color: "red" }}>{formik.errors.itemName}</span> : null}
                    </InputGroup>

                    <InputGroup className="mb-4">
                        <Form.Label><b>Item description: </b></Form.Label>
                        <FormControl
                            id="itemDes"
                            placeholder="itemDes"
                            onChange={formik.handleChange}
                            value={formik.values.itemDes}
                        />
                    </InputGroup>

                    <InputGroup className="mb-4">
                        <Form.Label><b>Item URL: </b></Form.Label>
                        <FormControl
                            id="itemURL"
                            placeholder="itemURL"
                            onChange={formik.handleChange}
                            value={formik.values.itemURL}
                        />
                    </InputGroup>

                    <input type="file" name="listImg" onChange={retrieveFile} /> <br></br>



                    <ButtonApply type='submit'>
                        Apply for "{listname}"
                    </ButtonApply>
                </form>
            </Content>
            <FooterDobbyLabs />
        </Layout>
    )

};

export default AddListPage;
