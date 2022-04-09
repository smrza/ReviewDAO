import React from 'react';
import { Layout } from 'antd';


const FooterDobbyLabs = () => {
    const { Footer } = Layout;

    return (
        <Footer style={{ textAlign: 'center', color: 'white', backgroundColor: '#001529', marginTop: '50px', paddingTop: '20px', position: 'absolute', bottom: '0', width: '100%', height: "70px" }}>
            DOBBY LABS ©2022
        </Footer>
    );
};

export default FooterDobbyLabs;