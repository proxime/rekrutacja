import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginAction } from '../store/actions/user';
import {
  getEncyclopediaDataAction,
  setEncyclopediaFilter,
} from '../store/actions/encyclopedia';
import { RootState } from '../store/reducers';
import { Filter, Result } from '../store/types/encyclopedia';
import Header from '../components/Header';
import HomepageSelect from '../components/HomepageSelect';
import Spinner from '../components/Spinner';
import SearchInput from '../components/SearchInput';
import HomepageCard from '../components/HomepageCard';

import '../styles/Homepage.scss';
import characterImg from '../img/character.png';
import planetImg from '../img/planet.png';
import speciesImg from '../img/species.png';
import starshipImg from '../img/starship.png';

interface LocationState {
  from?: {
    pathname: string;
  };
}

const Homepage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [elements, setElements] = useState<Result | null>([]);
  const { user } = useSelector((state: RootState) => state.user);
  const encyclopedia = useSelector((state: RootState) => state.encyclopedia);

  const dispatch = useDispatch();
  const location = useLocation<LocationState>();
  const history = useHistory<LocationState>();

  const handleLogin = () => {
    dispatch(loginAction());
  };

  const handleSetSearchValue = (value: string) => {
    setSearch(value);
  };

  const handleSetElements = useCallback(() => {
    setElements(encyclopedia[encyclopedia.filter]);
  }, [setElements, encyclopedia]);

  const handleChangeFilter = (filter: Filter) => {
    dispatch(setEncyclopediaFilter(filter));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderCard = (element: any) => {
    switch (encyclopedia.filter) {
      case 'characters':
        return (
          <>
            <p className="homepage__card-text">
              <span>Gender:</span> {element.gender}
            </p>
            <p className="homepage__card-text">
              <span>Height:</span> {element.height}
            </p>
          </>
        );
      case 'planets':
        return (
          <>
            <p className="homepage__card-text">
              <span>Climate:</span> {element.climate}
            </p>
            <p className="homepage__card-text">
              <span>Population:</span> {element.population}
            </p>
          </>
        );
      case 'species':
        return (
          <>
            <p className="homepage__card-text">
              <span>Classification:</span> {element.classification}
            </p>
            <p className="homepage__card-text">
              <span>Language:</span> {element.language}
            </p>
          </>
        );
      case 'starships':
        return (
          <>
            <p className="homepage__card-text">
              <span>Model:</span> {element.model}
            </p>
            <p className="homepage__card-text">
              <span>Hyperdrive rating:</span> {element.hyperdrive_rating}
            </p>
          </>
        );
      default:
        return <></>;
    }
  };

  useEffect(() => {
    if (user && !encyclopedia.fetched) {
      dispatch(getEncyclopediaDataAction());
    }
  }, [dispatch, user, encyclopedia.fetched]);

  useEffect(() => {
    handleSetElements();
  }, [handleSetElements]);

  useEffect(() => {
    if (user && location.state?.from?.pathname) {
      history.push(location.state.from.pathname);
    }
  }, [user, location, history]);

  const filteredElements = elements?.filter(
    (el) => el.name.toLowerCase().search(search.toLowerCase()) > -1
  );

  return (
    <>
      <Header />
      <main className="main">
        <div className="main__background"></div>
        <section className="homepage">
          {user ? (
            <>
              <div className="homepage__select-conainer">
                <HomepageSelect
                  title="Characters"
                  image={characterImg}
                  customClass="characters"
                  active={encyclopedia.filter === 'characters'}
                  setActive={() => handleChangeFilter('characters')}
                />
                <HomepageSelect
                  title="Planets"
                  image={planetImg}
                  customClass="planets"
                  active={encyclopedia.filter === 'planets'}
                  setActive={() => handleChangeFilter('planets')}
                />
                <HomepageSelect
                  title="Species"
                  image={speciesImg}
                  customClass="species"
                  active={encyclopedia.filter === 'species'}
                  setActive={() => handleChangeFilter('species')}
                />
                <HomepageSelect
                  title="Starships"
                  image={starshipImg}
                  customClass="starships"
                  active={encyclopedia.filter === 'starships'}
                  setActive={() => handleChangeFilter('starships')}
                />
              </div>
              <SearchInput onSubmit={handleSetSearchValue} />
              {encyclopedia.loading ? (
                <Spinner />
              ) : (
                <section className="homepage__cards">
                  {filteredElements && filteredElements.length > 0 ? (
                    filteredElements?.map((el) => (
                      <HomepageCard
                        key={el.name}
                        name={el.name}
                        type={encyclopedia.filter}
                      >
                        {renderCard(el)}
                      </HomepageCard>
                    ))
                  ) : (
                    <h3 className="homepage__cards-empty">No search results</h3>
                  )}
                </section>
              )}
            </>
          ) : (
            <div className="homepage__login">
              <h4 className="homepage__login-text">
                Sign in to unlock encyclopedia content
              </h4>
              <button
                type="button"
                className="homepage__login-button"
                onClick={handleLogin}
              >
                Sign in
              </button>
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default Homepage;
