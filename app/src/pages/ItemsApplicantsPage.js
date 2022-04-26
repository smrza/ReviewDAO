import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { lists } from "../static/staticLists"
import { Layout } from 'antd';
import { Card } from 'antd';
import CardsWrapper from '../components/layouts/CardsWrapper'
import ButtonRedirect from '../components/atoms/ButtonRedirect';
import HeaderDobbyLabs from '../components/organisms/HeaderDobbyLabs';
import FooterDobbyLabs from '../components/organisms/FooterDobbyLabs';
import HeaderOne from '../components/atoms/HeaderOne';

const ItemsApplicantsPage = () => {
    const { Content } = Layout;
    const { Meta } = Card;

    const navigate = useNavigate();

    const { listname } = useParams();
    const [listApplicants, setListApplicants] = useState(lists);
    const [listApplicantsCopy, setListApplicantsCopy] = useState(lists);

    const handleGoToListMainPage = () => navigate(`/`)
    const handleGoToListPage = () => navigate(`/lists/${listname}`)


    useEffect(() => {
        console.log(listname)
        handleApplicantsSelect()
    })


    const handleApplicantsSelect = () => {
        const applicants = lists.map((item) => {
            return (
                item.listName
            );
        });

        if (applicants.indexOf(listname) === -1) {
            alert(`There is no list called "${listname}"`)
            handleGoToListMainPage()
        }
        else {
            setListApplicants(lists[applicants.indexOf(listname)].applicants);
            setListApplicantsCopy(listApplicants);
        }
    }

    // const handleVote = (index) => {
    //     console.log(listApplicantsCopy)
    //     console.log(`Voting Card index: ${index}`)

    //     const changingApplicant = listApplicantsCopy[index].applicantName
    //     console.log(`Changing vote in ${changingApplicant}`)

    //     listApplicantsCopy[index].applicantChallenged = true;
    //     console.log(listApplicantsCopy)
    // }

    return (
        <Layout>
            <HeaderDobbyLabs />

            <Content className="content">
                <HeaderOne>
                    Challenge/Vote for applicants in list "{listname}"
                </HeaderOne>

                <ButtonRedirect onClick={handleGoToListMainPage}>Go back to main page</ButtonRedirect>
                <ButtonRedirect onClick={handleGoToListPage} style={{ marginLeft: '30px' }}>Go back to list page</ButtonRedirect>

                <CardsWrapper>
                    {listApplicants.map((applicant, index) =>
                        <Card
                            key={index}
                            style={{ margin: '1rem', padding: '1rem', width: '20%', backgroundColor: 'lightgray', border: '1px solid black', cursor: 'pointer' }}
                            cover={<img alt="example" src={applicant.applicantImg} width="100%" />}
                        >
                            <Meta title={applicant.applicantName} description={applicant.applicantDes} />
                            {/* <button onClick={handleVote(index)}>Challenge</button> */}

                            {/* {applicant.applicantChallenged === "false" ?
                                <button onClick={handleVote(index)}>Challenge</button>
                                :
                                <button onClick={handleVote(index)}>UpVote</button>
                            } */}
                        </Card>
                    )}
                </CardsWrapper>
            </Content>
            <FooterDobbyLabs />
        </Layout>
    )

};

export default ItemsApplicantsPage;
