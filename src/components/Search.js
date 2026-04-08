import { useState, useRef } from "react";
import styled from "styled-components";
import axios from "axios";
import { useHistory } from "react-router-dom";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";
const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w92";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const history = useHistory();
  const debounceRef = useRef(null);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      // Debounce suggestions
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(async () => {
        const res = await axios.get(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${value}`
        );
        const all = res.data.results;
        setSuggestions(all.slice(0, 6));
        setResults(all);
        setShowSuggestions(true);
      }, 300);
    } else {
      setSuggestions([]);
      setResults([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (movie) => {
    setShowSuggestions(false);
    setQuery(movie.title);
    history.push(`/detail/${movie.id}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setShowSuggestions(false);
    }
  };

  return (
    <Container>
      <SearchWrapper>
        <SearchBar
          type="text"
          placeholder="Search for movies, shows..."
          value={query}
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          autoFocus
        />
        {showSuggestions && suggestions.length > 0 && (
          <SuggestionsDropdown>
            {suggestions.map((movie) => (
              <SuggestionItem
                key={movie.id}
                onMouseDown={() => handleSuggestionClick(movie)}
              >
                {movie.poster_path ? (
                  <SuggestionPoster
                    src={`${POSTER_BASE_URL}${movie.poster_path}`}
                    alt={movie.title}
                  />
                ) : (
                  <PosterPlaceholder />
                )}
                <SuggestionInfo>
                  <SuggestionTitle>{movie.title}</SuggestionTitle>
                  <SuggestionYear>
                    {movie.release_date?.split("-")[0] || "N/A"}
                    {movie.vote_average > 0 && (
                      <Rating>⭐ {movie.vote_average.toFixed(1)}</Rating>
                    )}
                  </SuggestionYear>
                </SuggestionInfo>
              </SuggestionItem>
            ))}
          </SuggestionsDropdown>
        )}
      </SearchWrapper>

      {results.length > 0 && (
        <ResultsHeader>
          {results.length} results for "{query}"
        </ResultsHeader>
      )}

      <Grid>
        {results.map((movie) =>
          movie.backdrop_path ? (
            <Card
              key={movie.id}
              onClick={() => history.push(`/detail/${movie.id}`)}
            >
              <img
                src={`${IMAGE_BASE_URL}${movie.backdrop_path}`}
                alt={movie.title}
              />
              <CardInfo>
                <span>{movie.title}</span>
                {movie.vote_average > 0 && (
                  <CardRating>⭐ {movie.vote_average.toFixed(1)}</CardRating>
                )}
              </CardInfo>
            </Card>
          ) : null
        )}
      </Grid>
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  padding: 100px calc(3.5vw + 5px) 40px;
`;

const SearchWrapper = styled.div`
  position: relative;
  margin-bottom: 40px;
`;

const SearchBar = styled.input`
  width: 100%;
  padding: 16px 24px;
  font-size: 1.2rem;
  border-radius: 8px;
  border: 2px solid rgba(249, 249, 249, 0.3);
  background: rgba(0, 0, 0, 0.6);
  color: white;
  outline: none;
  transition: border 0.3s;
  box-sizing: border-box;

  &:focus {
    border-color: white;
  }

  &::placeholder {
    color: rgba(249, 249, 249, 0.4);
  }
`;

const SuggestionsDropdown = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: #1a1a2e;
  border: 1px solid rgba(249, 249, 249, 0.2);
  border-radius: 8px;
  overflow: hidden;
  z-index: 100;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
`;

const SuggestionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: rgba(249, 249, 249, 0.1);
  }

  &:not(:last-child) {
    border-bottom: 1px solid rgba(249, 249, 249, 0.05);
  }
`;

const SuggestionPoster = styled.img`
  width: 40px;
  height: 56px;
  object-fit: cover;
  border-radius: 4px;
  flex-shrink: 0;
`;

const PosterPlaceholder = styled.div`
  width: 40px;
  height: 56px;
  background: rgba(249, 249, 249, 0.1);
  border-radius: 4px;
  flex-shrink: 0;
`;

const SuggestionInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SuggestionTitle = styled.span`
  color: white;
  font-size: 14px;
  font-weight: 500;
`;

const SuggestionYear = styled.span`
  color: rgba(249, 249, 249, 0.5);
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Rating = styled.span`
  color: rgba(249, 249, 249, 0.7);
`;

const ResultsHeader = styled.p`
  color: rgba(249, 249, 249, 0.6);
  font-size: 14px;
  margin-bottom: 20px;
  letter-spacing: 1px;
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

  &:hover {
    border-color: white;
    transform: scale(1.05);
  }
`;

const CardInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
`;

const CardRating = styled.span`
  color: rgba(249, 249, 249, 0.6);
  font-size: 12px;
  white-space: nowrap;
`;

export default Search;