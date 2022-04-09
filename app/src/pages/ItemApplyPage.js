import { React, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom'
import { Layout } from 'antd';
import { Button, Form, FormControl, InputGroup } from "react-bootstrap";
import { useFormik } from 'formik'
import { lists } from '../static/staticLists'


const AddListPage = () => {
    const { Header, Content, Footer } = Layout;
    const navigate = useNavigate();
    const { listname } = useParams();

    const handleGoToListMainPage = () => navigate(`/`)
    const handleGoToListPage = () => navigate(`../lists/${listname}`)
    const handleGoToItemsApplicantsPage = () => navigate(`../${listname}/applicants`)


    useEffect(() => {
        const currentListNames = lists.map((num) => { return num.listName })

        if (currentListNames.indexOf(listname) === -1) {
            alert(`There is no list called ${listname}`)
            handleGoToListMainPage()
        }
    })

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
            console.log(`Applied - itemName: ${formik.values.itemName}, itemDes: ${formik.values.itemDes}, itemURL: ${formik.values.itemURL}`)

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
            <Content style={{ padding: '0 50px' }}>
                <h1>Apply item to the list "{listname}" </h1>
                <button onClick={handleGoToListMainPage} >Go back to main page</button>
                <button onClick={handleGoToListPage} style={{ marginLeft: '30px' }}> Go back to list page </button>
                <button onClick={handleGoToItemsApplicantsPage} style={{ marginLeft: '30px' }}> Show applicants </button>


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


                    <Button type='submit'>
                        Apply for "{listname}"
                    </Button>
                </form>
            </Content>
        </Layout>
    )

};

export default AddListPage;
