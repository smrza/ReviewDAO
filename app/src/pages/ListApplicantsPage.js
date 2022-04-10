import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Layout } from 'antd';
import { Card } from 'antd';
import CardsWrapper from '../components/layouts/CardsWrapper'
import ButtonRedirect from '../components/atoms/ButtonRedirect';
import HeaderDobbyLabs from '../components/organisms/HeaderDobbyLabs';
import FooterDobbyLabs from '../components/organisms/FooterDobbyLabs';
import { listApplicants } from '../static/listApplicants'

const ListApplicantsPage = () => {
    const { Content } = Layout;
    const { Meta } = Card;
    // const { applicantURL } = useParams();
    const location = useLocation();

    const [applicant, setApplicant] = useState([])

    const navigate = useNavigate();

    const handleGoToListMainPage = () => navigate(`/`)
    const handleGoToListApplyPage = () => navigate(`/list/apply`)


    useEffect(() => {
        if (location.state !== null) {
            console.log(`applicantURL: ${location.state.applicantURL}`)
            fetch(location.state.applicantURL)
                .then(res => res.json())
                .then(
                    (result) => {
                        setApplicant(result);
                    },
                    (error) => {
                        console.log(error)
                    }
                )
        }
    }, [])


    return (
        <Layout>
            <HeaderDobbyLabs />

            <Content className="content">
                <h1>
                    List applicants
                </h1>

                <ButtonRedirect onClick={handleGoToListMainPage}>Go back to main page</ButtonRedirect>
                <ButtonRedirect onClick={handleGoToListApplyPage}>Apply new list</ButtonRedirect>

                <CardsWrapper>
                    {listApplicants.map((applicant, index) =>
                        <Card
                            key={index}
                            style={{ margin: '1rem', padding: '1rem', width: '20%', backgroundColor: 'magenta', border: '1px solid black', cursor: 'pointer' }}
                            cover={<img alt="applicantImg" src={applicant.listApplicantImg} width="100%" />}
                        >
                            <Meta title={applicant.listApplicantName} description={applicant.listApplicantDes} />
                        </Card>
                    )}
                    {location.state !== null ?
                        <Card
                            style={{ margin: '1rem', padding: '1rem', width: '20%', backgroundColor: 'magenta', border: '1px solid black', cursor: 'pointer' }}
                            cover={<img alt="applicantImg" src={applicant.listApplicantImg} width="100%" />}
                        >
                            <Meta title={applicant.listApplicantName} description={applicant.listApplicantDes} />
                        </Card>
                        : null
                    }
                </CardsWrapper>
            </Content>
            <FooterDobbyLabs />
        </Layout>
    )

};

export default ListApplicantsPage;
