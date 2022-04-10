import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { lists } from "../static/staticLists"
import { Card, Layout } from 'antd';
import CardsWrapper from '../components/layouts/CardsWrapper'
import ButtonRedirect from '../components/atoms/ButtonRedirect';
import HeaderDobbyLabs from '../components/organisms/HeaderDobbyLabs';
import FooterDobbyLabs from '../components/organisms/FooterDobbyLabs';


const ListPage = () => {
    const { Header, Content, Footer } = Layout;

    const [listItems, setListItems] = useState(lists);
    const { listname } = useParams();
    const navigate = useNavigate();

    const handleGoToListMainPage = () => navigate(`/`)
    const handleGoToItemspplicantsPage = () => navigate(`../${listname}/applicants`)
    const handleGoToItemApplyPage = () => navigate(`../${listname}/apply`)

    useEffect(() => {
        handleListSelect()
    })

    const handleListSelect = () => {
        console.log(`Selected list: ${listname}`);

        const animals = lists.map((item) => {
            return (
                item.listName
            );
        });

        setListItems(lists[animals.indexOf(listname)].items);
        console.log(listItems)
    }

    return (
        <Layout>
            <HeaderDobbyLabs />
            <Content className="content">
                <h1>List "{listname}"</h1>
                <ButtonRedirect onClick={handleGoToListMainPage}>Go back to main page</ButtonRedirect>
                <ButtonRedirect onClick={handleGoToItemApplyPage} style={{ marginLeft: '30px' }}>Apply new item</ButtonRedirect>
                <ButtonRedirect onClick={handleGoToItemspplicantsPage} style={{ marginLeft: '30px' }}>Vote for applicants</ButtonRedirect>

                <CardsWrapper>
                    {listItems.map((item, index) =>
                        <Card
                            key={index}
                            style={{ margin: '1rem', padding: '1rem', width: '20%', backgroundColor: 'lightblue', border: '1px solid black' }}
                            cover={<img alt="listImg" src={item.itemImg} width="100%" />}
                        >
                            <div style={{ fontSize: 'larger', fontWeight: 'bolder' }}>{item.itemName}</div>
                            <div>{item.itemDes}</div>
                        </Card>
                    )}
                </CardsWrapper>
            </Content>
            <FooterDobbyLabs />
        </Layout >
    )

};

export default ListPage;
