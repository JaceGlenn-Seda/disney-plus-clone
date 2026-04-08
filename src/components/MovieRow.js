import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import axios from "axios";
import { useHistory } from "react-router-dom";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w300";

function MovieRow({ title, fetchUrl }) {
  const [movies, setMovies] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);
  const history = useHistory();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    async function fetchData() {
      const response = await axios.get(fetchUrl);
      setMovies(response.data.results);
    }
    fetchData();
  }, [isVisible, fetchUrl]);

  return (
    <Container ref={containerRef}>
      <h2>{title}</h2>
      <Content>
        {!isVisible
          ? Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
          : movies.map((movie) => (
              <Wrap
                key={movie.id}
                onClick={() => history.push(`/detail/${movie.id}`)}
              >
                <img
                  src={`${IMAGE_BASE_URL}${movie.backdrop_path || movie.poster_path}`}
                  alt={movie.title || movie.name}
                  loading="lazy"
                />
              </Wrap>
            ))}
      </Content>
    </Container>
  );
}

const Container = styled.div`
  padding: 0 0 26px 16px;
`;

const Content = styled.div`
  display: flex;
  overflow-x: scroll;
  gap: 10px;
  padding: 10px 0;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Wrap = styled.div`
  flex: 0 0 auto;
  width: 250px;
  height: 140px;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  border: 3px solid transparent;
  transition: all 0.3s;
  animation: fadeIn 0.5s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &:hover {
    border-color: white;
    transform: scale(1.05);
  }
`;

const SkeletonCard = styled.div`
  flex: 0 0 auto;
  width: 250px;
  height: 140px;
  border-radius: 10px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.05) 25%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.05) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

export default MovieRow;