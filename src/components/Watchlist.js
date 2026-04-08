import { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import db from "../firebase";
import { selectUserId } from "../features/user/userSlice";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = useSelector(selectUserId);
  const history = useHistory();

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const unsubscribe = db
      .collection("watchlist")
      .doc(userId)
      .collection("movies")
      .onSnapshot((snapshot) => {
        const movies = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setWatchlist(movies);
        setLoading(false);
      });

    return () => unsubscribe();
  }, [userId]);

  if (loading) return <LoadingText>Loading your watchlist...</LoadingText>;

  return (
    <Container>
      <h2>My Watchlist</h2>
      {watchlist.length === 0 ? (
        <Empty>No movies added yet. Hit the + button on any movie!</Empty>
      ) : (
        <Grid>
          {watchlist.map((movie) => (
            <Card
              key={movie.id}
              onClick={() => history.push(`/detail/${movie.id}`)}
            >
              <img
                src={`${IMAGE_BASE_URL}${movie.backdrop_path}`}
                alt={movie.title}
              />
              <span>{movie.title}</span>
            </Card>
          ))}
        </Grid>
      )}
    </Container>
  );
};

const LoadingText = styled.div`
  color: white;
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Container = styled.div`
  min-height: 100vh;
  padding: 100px calc(3.5vw + 5px) 40px;
  h2 {
    color: white;
    font-size: 1.8rem;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 30px;
  }
`;

const Empty = styled.p`
  color: rgba(249, 249, 249, 0.6);
  font-size: 16px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const Card = styled.div`
  cursor: pointer;
  border-radius: 10px;
  overflow: hidden;
  border: 3px solid transparent;
  transition: all 0.3s;
  background: #1a1a2e;
  img {
    width: 100%;
    height: 140px;
    object-fit: cover;
  }
  span {
    display: block;
    color: white;
    padding: 8px 12px;
    font-size: 14px;
  }
  &:hover {
    border-color: white;
    transform: scale(1.05);
  }
`;

export default Watchlist;