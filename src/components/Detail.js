import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { useSelector } from "react-redux";
import db from "../firebase";
import { selectUserId } from "../features/user/userSlice";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

const Detail = () => {
  const { id } = useParams();
  const [detailData, setDetailData] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [logoPath, setLogoPath] = useState(null);
  const [added, setAdded] = useState(false);
  const userId = useSelector(selectUserId);

  useEffect(() => {
    async function fetchDetail() {
      const [movieRes, videoRes, imageRes] = await Promise.all([
        axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`),
        axios.get(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}&language=en-US`),
        axios.get(`https://api.themoviedb.org/3/movie/${id}/images?api_key=${API_KEY}&include_image_language=en,null`)
      ]);

      setDetailData(movieRes.data);

      const trailer = videoRes.data.results.find(
        (v) => v.type === "Trailer" && v.site === "YouTube"
      );
      if (trailer) setTrailerKey(trailer.key);

      const logo = imageRes.data.logos?.[0];
      if (logo) setLogoPath(logo.file_path);
    }
    fetchDetail();
  }, [id]);

  useEffect(() => {
    if (!userId || !id) return;
    db.collection("watchlist")
      .doc(userId)
      .collection("movies")
      .doc(String(id))
      .get()
      .then((doc) => {
        if (doc.exists) setAdded(true);
      });
  }, [userId, id]);

  const handleAddToWatchlist = async () => {
    if (!userId) return alert("Please log in first!");
    if (added) {
      await db
        .collection("watchlist")
        .doc(userId)
        .collection("movies")
        .doc(String(id))
        .delete();
      setAdded(false);
    } else {
      await db
        .collection("watchlist")
        .doc(userId)
        .collection("movies")
        .doc(String(id))
        .set({
          id: detailData.id,
          title: detailData.title,
          backdrop_path: detailData.backdrop_path,
        });
      setAdded(true);
    }
  };

  if (!detailData) return <Loading>Loading...</Loading>;

  return (
    <Container>
      <Background>
        <img alt={detailData.title} src={`${IMAGE_BASE_URL}${detailData.backdrop_path}`} />
      </Background>

      <ImageTitle>
        {logoPath ? (
          <img alt={detailData.title} src={`${IMAGE_BASE_URL}${logoPath}`} />
        ) : (
          <h1>{detailData.title}</h1>
        )}
      </ImageTitle>

      <ContentMeta>
        <GenreTags>
          {detailData.genres?.map((g) => (
            <Tag key={g.id}>{g.name}</Tag>
          ))}
        </GenreTags>
        <Controls>
          <Player>
            <img src="/images/play-icon-black.png" alt="" />
            <span>Play</span>
          </Player>
          <TrailerBtn>
            <img src="/images/play-icon-white.png" alt="" />
            <span>Trailer</span>
          </TrailerBtn>
          <AddList onClick={handleAddToWatchlist} added={added}>
            {added ? <Checkmark>✓</Checkmark> : (
              <>
                <span />
                <span />
              </>
            )}
          </AddList>
          <GroupWatch>
            <div>
              <img src="/images/group-icon.png" alt="" />
            </div>
          </GroupWatch>
        </Controls>
        <SubTitle>{detailData.tagline}</SubTitle>
        <Description>{detailData.overview}</Description>
      </ContentMeta>

      {trailerKey && (
        <TrailerWrapper>
          <iframe
            width="100%"
            height="500px"
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1`}
            title="Trailer"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </TrailerWrapper>
      )}
    </Container>
  );
};

const Loading = styled.div`
  color: white;
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Container = styled.div`
  position: relative;
  min-height: calc(100vh - 250px);
  overflow-x: hidden;
  display: block;
  top: 72px;
  padding: 0 calc(3.5vw + 5px);
`;

const Background = styled.div`
  left: 0px;
  opacity: 0.8;
  position: fixed;
  right: 0px;
  top: 0px;
  z-index: -1;
  img {
    width: 100vw;
    height: 100vh;
    @media (max-width: 768px) {
      width: initial;
    }
  }
`;

const ImageTitle = styled.div`
  align-items: flex-end;
  display: flex;
  justify-content: flex-start;
  margin: 0px auto;
  height: 30vw;
  min-height: 170px;
  padding-bottom: 24px;
  width: 100%;
  img {
    max-width: 600px;
    min-width: 200px;
    width: 35vw;
  }
  h1 {
    color: white;
    font-size: 3vw;
  }
`;

const GenreTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
`;

const Tag = styled.span`
  background: rgba(249, 249, 249, 0.2);
  border: 1px solid rgba(249, 249, 249, 0.4);
  border-radius: 4px;
  color: rgb(249, 249, 249);
  font-size: 12px;
  padding: 4px 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ContentMeta = styled.div`
  max-width: 874px;
`;

const Controls = styled.div`
  align-items: center;
  display: flex;
  flex-flow: row nowrap;
  margin: 24px 0px;
  min-height: 56px;
`;

const Player = styled.button`
  font-size: 15px;
  margin: 0px 22px 0px 0px;
  padding: 0px 24px;
  height: 56px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 1.8px;
  text-align: center;
  text-transform: uppercase;
  background: rgb(249, 249, 249);
  border: none;
  color: rgb(0, 0, 0);
  img {
    width: 32px;
  }
  &:hover {
    background: rgb(198, 198, 198);
  }
`;

const TrailerBtn = styled(Player)`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgb(249, 249, 249);
  color: rgb(249, 249, 249);
`;

const AddList = styled.div`
  margin-right: 16px;
  height: 44px;
  width: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.added ? "rgba(255,255,255,0.3)" : "rgba(0, 0, 0, 0.6)"};
  border-radius: 50%;
  border: 2px solid white;
  cursor: pointer;
  transition: background 0.3s;
  span {
    background-color: rgb(249, 249, 249);
    display: inline-block;
    &:first-child {
      height: 2px;
      transform: translate(1px, 0px) rotate(0deg);
      width: 16px;
    }
    &:nth-child(2) {
      height: 16px;
      transform: translateX(-8px) rotate(0deg);
      width: 2px;
    }
  }
`;

const Checkmark = styled.span`
  color: white;
  font-size: 20px;
  font-weight: bold;
`;

const GroupWatch = styled.div`
  height: 44px;
  width: 44px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: white;
  div {
    height: 40px;
    width: 40px;
    background: rgb(0, 0, 0);
    border-radius: 50%;
    img {
      width: 100%;
    }
  }
`;

const SubTitle = styled.div`
  color: rgb(249, 249, 249);
  font-size: 15px;
  min-height: 20px;
`;

const Description = styled.div`
  line-height: 1.4;
  font-size: 20px;
  padding: 16px 0px;
  color: rgb(249, 249, 249);
`;

const TrailerWrapper = styled.div`
  margin-top: 40px;
  border-radius: 10px;
  overflow: hidden;
`;

export default Detail;