import { React, useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Layout } from 'antd';
import { Button, Form, FormControl, InputGroup } from "react-bootstrap";
import { useFormik } from 'formik'
import ButtonRedirect from "../components/atoms/ButtonRedirect";
import HeaderDobbyLabs from "../components/organisms/HeaderDobbyLabs";
import FooterDobbyLabs from "../components/organisms/FooterDobbyLabs";
import HeaderOne from "../components/atoms/HeaderOne";
import ButtonApply from "../components/atoms/ButtonApply"
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import useListItems from "../hooks/useListItems"
import useListAddress from "../hooks/useListAddress"

const AddListPage = () => {
    const { Content } = Layout;
    const navigate = useNavigate();
    const location = useLocation()

    // const [listNames, setListNames] = useState(Array)
    const listAddress = location.state.listAddress
    const { listname } = useParams();

    const handleGoToListMainPage = () => navigate(`/`)
    const handleGoToListPage = () => navigate(`../lists/${listname}`)
    const handleGoToItemsApplicantsPage = () => navigate(`../${listname}/applicants`)

    // const APIURL = 'https://api.thegraph.com/subgraphs/name/rabeles11/reviewdao'


    useEffect(() => {
        console.log(`listAddress: ${listAddress}`)
    })

    // useEffect(async () => {
    //     // console.log(`listNames:`)
    //     // console.log(listNames)

    //     // console.log(`UseEffect listAddress: ${listAddress}`)
    //     // if (listAddress.length !== 0) {
    //     //     getListNames(listAddress)
    //     // }

    //     // console.log(listNames)

    //     // if (listNames !== "undefined") {
    //     //     console.log(listNames)
    //     //     const currentListNames = listNames.map((list) => { return list.name })
    //     //     console.log(currentListNames.indexOf(listname))

    //     //     if (currentListNames.indexOf(listname) === -1) {
    //     //         alert(`There is no list called ${listname}`)
    //     //         handleGoToListMainPage()
    //     //     }
    //     // }
    // }, [listAddress])


    // const getListNames = async (addr) => {
    //     console.log(`listAddress: ${addr}`)

    //     const GET_LISTNAMES_BY_ADDRESS = `
    //         query {
    //             factoryContracts(first: 5, orderBy: name) {
    //                 baseUri
    //                 name
    //                 newList
    //             }
    //         }
    //     `
    //     const client = new ApolloClient({
    //         uri: APIURL,
    //         cache: new InMemoryCache(),
    //     })

    //     client
    //         .query({
    //             query: gql(GET_LISTNAMES_BY_ADDRESS),
    //             variables: {
    //                 address: addr,
    //             },
    //         })
    //         .then((data) => setListNames(data.data.factoryContracts))
    //         // .then((data) => console.log(data.data.factoryContracts))

    //         .catch((err) => {
    //             console.log('Error fetching data: ', err)
    //         })

    //     await client.query(GET_LISTNAMES_BY_ADDRESS).toPromise()
    // }

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
