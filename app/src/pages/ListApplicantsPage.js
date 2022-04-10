import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

    const navigate = useNavigate();

    // const { listname } = useParams();
    // const [listApplicants, setListApplicants] = useState(lists);
    // const [listApplicantsCopy, setListApplicantsCopy] = useState(lists);

    const handleGoToListMainPage = () => navigate(`/`)


    useEffect(() => {
        console.log(listApplicants)
        console.log(listApplicants[1])
        // handleApplicantsSelect()
    })


    // const handleApplicantsSelect = () => {
    //     const applicants = lists.map((item) => {
    //         return (
    //             item.listName
    //         );
    //     });

    //     setListApplicants(lists[applicants.indexOf(listname)].applicants);
    //     console.log(listApplicants)

    //     setListApplicantsCopy(listApplicants);
    // }

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
                <h1>
                    List applicants
                </h1>

                <ButtonRedirect onClick={handleGoToListMainPage}>Go back to main page</ButtonRedirect>

                <CardsWrapper>
                    {listApplicants.map((applicant, index) =>
                        <Card
                            key={index}
                            style={{ margin: '1rem', padding: '1rem', width: '20%', backgroundColor: 'magenta', border: '1px solid black', cursor: 'pointer' }}
                            cover={<img alt="example" src={applicant.listApplicantImg} width="100%" />}
                        >
                            <Meta title={applicant.listApplicantName} description={applicant.listApplicantDes} />
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

export default ListApplicantsPage;
