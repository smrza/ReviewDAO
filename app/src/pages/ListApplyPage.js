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
import { ethers } from "ethers";
import sha256 from "js-sha256"


const client = create('https://ipfs.infura.io:5001/api/v0');


const ListApplyPage = () => {

    const ABI = [
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "newList",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "bytes32",
                    "name": "hash",
                    "type": "bytes32"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "baseUri",
                    "type": "string"
                }
            ],
            "name": "_NewList",
            "type": "event"
        },
        {
            "inputs": [],
            "name": "allLists",
            "outputs": [
                {
                    "internalType": "contract ReviewDAOList[]",
                    "name": "",
                    "type": "address[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "nameHash_",
                    "type": "bytes32"
                },
                {
                    "internalType": "string",
                    "name": "name_",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "baseUri_",
                    "type": "string"
                },
                {
                    "internalType": "address",
                    "name": "creator_",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "token_",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "ReviewDAO_",
                    "type": "address"
                }
            ],
            "name": "createList",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "nameHash_",
                    "type": "bytes32"
                }
            ],
            "name": "getList",
            "outputs": [
                {
                    "internalType": "contract ReviewDAOList",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "nameHash_",
                    "type": "bytes32"
                }
            ],
            "name": "getListAddress",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]

    const CONTRACT_ADDRESS = '0xb86d6edbc400De3fc87557D97A68461b104b94C1';
    const tokenAddress = '0xd0715b566044Fe48C0CC0B435C0072609Ea157bb';
    const ReviewDAOAddress = '0x99beDEDB0501ae930CE14AADe1c327D45Bd315a7';

    const { Content } = Layout;
    const navigate = useNavigate();

    const [file, setFile] = useState(null);
    const [listName, setListname] = useState("");
    const [listDes, setListDes] = useState("");

    const handleGoToListMainPage = () => navigate(`/`)
    const handleGoToListApplicantsPage = () => navigate(`/list/applicants`)
    const handleGoToListApplicantsPageWithNewApplicant = (listURL) => navigate(`/list/applicants`, { state: { applicantURL: listURL } })

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);


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
            console.log(contract)
            console.log(listName)
            console.log(`0x${sha256(listName)}`)
            console.log(imgURL)
            console.log("0xc1cce50ee4b87ed2d4581d3d81aa37b45dcff49f")

            contract.createList(`0x${sha256(listName)}`, listName, imgURL,
                "0xc1cce50ee4b87ed2d4581d3d81aa37b45dcff49f",   // creator - walletAddress 
                tokenAddress,
                ReviewDAOAddress
            )

            // handleGoToListApplicantsPageWithNewApplicant(listURL)

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
            errors.itemName = "Please do not use ',' to your itemName"
            return errors
        }

    }

    const formik = useFormik({
        initialValues: {
            itemName: "",
            itemDes: "",
            itemImg: "",
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
                <HeaderOne>Apply new list</HeaderOne>
                <ButtonRedirect onClick={handleGoToListMainPage}> Go back to main page </ButtonRedirect>
                <ButtonRedirect onClick={handleGoToListApplicantsPage}> Show list applicants </ButtonRedirect>

                <form onSubmit={handleSubmit}>
                    <span> List name: </span>
                    <InputItem type="text" name="listName" placeholder="listName" onChange={e => setListname(e.target.value)} /> <br></br>

                    <span> List image: </span>
                    <input type="file" name="listImg" onChange={retrieveFile} /> <br></br>
                    <ButtonApply type="submit"> Apply list </ButtonApply>
                </form>

                {/* <form style={{ marginTop: '30px' }} onSubmit={formik.handleSubmit}>
                    <InputGroup className="mb-4">
                        <Form.Label><b>List name: </b></Form.Label>
                        <FormControl
                            id="itemName"
                            placeholder="itemName"
                            onChange={formik.handleChange}
                            value={formik.values.itemName}
                        />
                        {formik.errors.itemName ? <span style={{ color: "red" }}>{formik.errors.itemName}</span> : null}
                    </InputGroup>

                    <InputGroup className="mb-4">
                        <Form.Label><b>List description: </b></Form.Label>
                        <FormControl
                            id="itemDes"
                            placeholder="itemDes"
                            onChange={formik.handleChange}
                            value={formik.values.itemDes}
                        />
                    </InputGroup>

                    <InputGroup className="mb-4">
                        <Form.Label><b>List img: </b></Form.Label>
                        <input type="file" name="listImg" onChange={retrieveFile} /> <br></br>
                    </InputGroup>

                    <ButtonApply type='submit'>
                        Apply new list
                    </ButtonApply>
                </form> */}
            </Content>
            <FooterDobbyLabs />
        </Layout>
    )
};

export default ListApplyPage;
