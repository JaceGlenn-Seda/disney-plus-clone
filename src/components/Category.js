import { useParams } from "react-router-dom";
import styled from "styled-components";
import MovieRow from "./MovieRow";
import requests from "./requests";

const categoryMap = {
  disney: {
    title: "Disney",
    fetchUrl: requests.fetchDisney,
    logo: "/images/viewers-disney.png",
    bg: "linear-gradient(135deg, #1a1a6e 0%, #000814 100%)",
    accent: "#1a6ef5",
  },
  pixar: {
    title: "Pixar",
    fetchUrl: requests.fetchPixar,
    logo: "/images/viewers-pixar.png",
    bg: "linear-gradient(135deg, #0d3b6e 0%, #000814 100%)",
    accent: "#00b4ff",
  },
  marvel: {
    title: "Marvel",
    fetchUrl: requests.fetchMarvel,
    logo: "/images/viewers-marvel.png",
    bg: "linear-gradient(135deg, #6e0000 0%, #000814 100%)",
    accent: "#ec1d24",
  },
  starwars: {
    title: "Star Wars",
    fetchUrl: requests.fetchStarWars,
    logo: "/images/viewers-starwars.png",
    bg: "linear-gradient(135deg, #1a1200 0%, #000814 100%)",
    accent: "#ffe300",
  },
  natgeo: {
    title: "National Geographic",
    fetchUrl: requests.fetchNatGeo,
    logo: "/images/viewers-national.png",
    bg: "linear-gradient(135deg, #1a4a00 0%, #000814 100%)",
    accent: "#ffcc00",
  },
};

const Category = () => {
  const { id } = useParams();
  const category = categoryMap[id];

  if (!category) {
    return <NotFound>Category not found.</NotFound>;
  }

  return (
    <Container>
      <Hero bg={category.bg}>
        <HeroOverlay />
        <HeroContent>
          <LogoImg src={category.logo} alt={category.title} />
          <TagLine accent={category.accent}>
            The best of {category.title}, all in one place.
          </TagLine>
        </HeroContent>
      </Hero>
      <RowSection>
        <MovieRow
          title={`${category.title} Movies`}
          fetchUrl={category.fetchUrl}
        />
      </RowSection>
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  padding-top: 70px;
`;

const Hero = styled.div`
  position: relative;
  height: 420px;
  background: ${(props) => props.bg};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 150px;
    background: linear-gradient(to bottom, transparent, #040714);
    z-index: 2;
  }
`;

const HeroOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at center,
    rgba(255, 255, 255, 0.08) 0%,
    transparent 70%
  );
  z-index: 1;
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  text-align: center;
  width: 100%;
  padding: 0 40px;
`;

const LogoImg = styled.img`
  width: 60vw;
  max-width: 700px;
  min-width: 300px;
  filter: brightness(1.2) drop-shadow(0 0 40px rgba(255, 255, 255, 0.4));
`;

const TagLine = styled.p`
  color: rgba(249, 249, 249, 0.7);
  font-size: 1rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  border-top: 1px solid ${(props) => props.accent};
  padding-top: 14px;
`;

const RowSection = styled.div`
  padding: 20px calc(3.5vw + 5px) 60px;

  h2 {
    color: rgb(249, 249, 249);
    font-size: 1.4rem;
    font-weight: 600;
    margin-bottom: 8px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }
`;

const NotFound = styled.div`
  color: white;
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

export default Category;