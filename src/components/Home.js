import styled from "styled-components";
import ImgSlider from "./ImgSlider";
import Viewers from "./Viewers";
import MovieRow from "./MovieRow";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import db from "../firebase";
import { setMovies } from "../features/movie/movieSlice";
import { selectUserName } from "../features/user/userSlice";
import requests from "./requests";

const Home = (props) => {
  const dispatch = useDispatch();
  const userName = useSelector(selectUserName);

  useEffect(() => {
    db.collection("movies").onSnapshot((snapshot) => {
      let recommends = [], newDisneys = [], originals = [], trending = [];
      snapshot.docs.map((doc) => {
        switch (doc.data().type) {
          case "recommend": recommends = [...recommends, { id: doc.id, ...doc.data() }]; break;
          case "new": newDisneys = [...newDisneys, { id: doc.id, ...doc.data() }]; break;
          case "original": originals = [...originals, { id: doc.id, ...doc.data() }]; break;
          case "trending": trending = [...trending, { id: doc.id, ...doc.data() }]; break;
        }
      });
      dispatch(setMovies({ recommend: recommends, newDisney: newDisneys, original: originals, trending: trending }));
    });
  }, [userName]);

  return (
    <Container>
      <ImgSlider />
      <Viewers />
      <RowSection>
        <MovieRow title="Trending Now" fetchUrl={requests.fetchTrending} />
        <MovieRow title="Top Rated" fetchUrl={requests.fetchTopRated} />
        <MovieRow title="Disney" fetchUrl={requests.fetchDisney} />
        <MovieRow title="Pixar" fetchUrl={requests.fetchPixar} />
        <MovieRow title="Marvel" fetchUrl={requests.fetchMarvel} />
        <MovieRow title="Star Wars" fetchUrl={requests.fetchStarWars} />
        <MovieRow title="National Geographic" fetchUrl={requests.fetchNatGeo} />
        <MovieRow title="Action Movies" fetchUrl={requests.fetchActionMovies} />
        <MovieRow title="Comedy Movies" fetchUrl={requests.fetchComedyMovies} />
      </RowSection>
    </Container>
  );
};

const Container = styled.main`
  position: relative;
  min-height: calc(100vh - 250px);
  overflow-x: hidden;
  display: block;
  top: 72px;
  padding: 0 calc(3.5vw + 5px);
  scroll-behavior: smooth;

  &:after {
    background: url("/images/home-background.png") center center / cover
      no-repeat fixed;
    content: "";
    position: absolute;
    inset: 0px;
    opacity: 1;
    z-index: -1;
  }
`;

const RowSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 80px;
  animation: fadeUp 0.8s ease-in-out;

  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  h2 {
    color: rgb(249, 249, 249);
    font-size: 1.4rem;
    font-weight: 600;
    margin-bottom: 8px;
    padding-left: 4px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }
`;

export default Home;