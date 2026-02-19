import React from 'react';
import Nav from '../components/Nav';
import Banner from '../components/Banner';
import Row from '../components/Row';

const Home = ({ type }) => {
    // type can be 'movie' or 'series'
    const isSeries = type === 'series';

    return (
        <div className="home">
            <Nav />
            <Banner />
            <Row title={isSeries ? "Trending Series" : "Trending Now"} keyword="trending" isLargeRow type={type} />
            <Row title="Top Rated" keyword="star" type={type} />
            <Row title={isSeries ? "Action Series" : "Action Movies"} keyword="fast" type={type} />
            <Row title={isSeries ? "Comedy Series" : "Comedy Movies"} keyword="comedy" type={type} />
            <Row title={isSeries ? "Horror Series" : "Horror Movies"} keyword="scary" type={type} />
            <Row title={isSeries ? "Romance Series" : "Romance Movies"} keyword="love" type={type} />
            <Row title="Documentaries" keyword="planet" type={type} />
        </div>
    );
}

export default Home;
