import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { lists } from "../static/staticLists"
import { Layout } from 'antd';
import { Card } from 'antd';
import CardsWrapper from '../components/layouts/CardsWrapper'


const ItemsApplicantsPage = () => {
    const { Header, Content, Footer } = Layout;
    const { Meta } = Card;

    const navigate = useNavigate();

    const { listname } = useParams();
    const [listApplicants, setListApplicants] = useState(lists);
    const [listApplicantsCopy, setListApplicantsCopy] = useState(lists);

    const handleGoToListMainPage = () => navigate(`/`)
    const handleGoToListPage = () => navigate(`/lists/${listname}`)


    useEffect(() => {
        console.log(`listname: ${listname}`)
        handleApplicantsSelect()
    })


    const handleApplicantsSelect = () => {
        const applicants = lists.map((item) => {
            return (
                item.listName
            );
        });

        setListApplicants(lists[applicants.indexOf(listname)].applicants);
        console.log(listApplicants)

        setListApplicantsCopy(listApplicants);
    }

    const handleVote = (index) => {
        console.log(listApplicantsCopy)
        console.log(`Voting Card index: ${index}`)

        const changingApplicant = listApplicantsCopy[index].applicantName
        console.log(`Changing vote in ${changingApplicant}`)

        listApplicantsCopy[index].applicantChallenged = true;
        console.log(listApplicantsCopy)
    }

    return (
        <Layout>
            <Content style={{ padding: '0 50px' }}>
                <h1>
                    Challenge/Vote for applicants in list "{listname}"
                </h1>

                <button onClick={handleGoToListMainPage}>Go back to main page</button>
                <button onClick={handleGoToListPage} style={{ marginLeft: '30px' }}>Go back to list page</button>

                <CardsWrapper>
                    {listApplicants.map((applicant, index) =>
                        <Card
                            key={index}
                            style={{ margin: '1rem', padding: '1rem', width: '20%', backgroundColor: 'magenta', border: '1px solid black', cursor: 'pointer' }}
                            cover={<img alt="example" src={applicant.applicantImg} width="100%" />}
                        >
                            <div style={{ fontSize: 'larger', fontWeight: 'bolder' }}>{applicant.applicantName}</div>
                            <div>{applicant.applicantDes}</div>
                            <button onClick={handleVote(index)}>Challenge</button>

                            {/* {applicant.applicantChallenged === "false" ?
                                <button onClick={handleVote(index)}>Challenge</button>
                                :
                                <button onClick={handleVote(index)}>UpVote</button>
                            } */}
                        </Card>
                    )}
                </CardsWrapper>
            </Content>
        </Layout>
    )

};

export default ItemsApplicantsPage;
