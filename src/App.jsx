import { useEffect, useState } from "react"
import { Link, Route, Routes } from "react-router-dom";

const initialData = [
  {
    name : 'Phantom',
    poster : 'https://qph.cf2.quoracdn.net/main-qimg-245f0d35e914644556f4fc765b9701b2.webp',
    rating : 8.8,
    description : 'Phantom Movie'
  },
  {
    name : 'Kabil',
    poster : 'https://files.prokerala.com/movies/pics/300x360/movie-poster-63297.jpg',
    rating : 6.8,
    description : 'Kabil Movie - main character Rittik '
  },
  {
    name : 'Mission Raniganj',
    poster : 'https://akm-img-a-in.tosshub.com/indiatoday/styles/medium_crop_simple/public/2023-09/whatsapp_image_2023-09-06_at_5.40.25_pm.jpeg?VersionId=a4rK_IJUvFRl4xgRAHEekapgF9JYPCnF&size=750:*',
    rating : 7,
    description : 'Misson - this is the movie - the main character of which is Akshay Kumar.'
  },
  {
    name : 'My name is Khan',
    poster : 'https://www.tallengestore.com/cdn/shop/products/MyNameIsKhan-ShahRukhKhan-BollywoodHindiMoviePoster_bb2d24c3-a88a-4158-845d-2bd636e9b682_large.jpg?v=1675251810',
    rating : 9,
    description : 'The main character of this movie is Shahrukh khan.'
  },
  
]
const KEY = "cc192ffc";
const apiUrl = `http://www.omdbapi.com/?apikey=${KEY}&s='intersteller'`

export default function App () {
  const [movieData, setMovieData] = useState(initialData);
  const [searchInput, setSearchInput] = useState('space')
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] =useState(null);
  const [watched, setWatched] = useState([]);
  // lets make this 

  // not fetching really - now 
  // next -> make some initial data and display it in the screen . Try to use the concept as much //
  //as possible.

  function handleAddWatched (movieDetails) {
    setWatched((watched) => [...watched, movieDetails]);
  }
  function handleRemoveWatched (id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id))
  }


  useEffect(function () {
    async function fetchMovie () {
      try {
        setIsLoading(true)
        setError('')
        const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${searchInput}`)
        if (!res.ok) {
          throw new Error ('Something went wrong with fetching Movies')
        }
        const data  = await res.json();
        if (data.Response === 'False') throw new Error ('🌹 Movie not found')

       // console.log(data.Search);
        setMovieData(data.Search);
        setIsLoading(false)
      }
      catch (error) {
        console.log(error);
        setError(error.message);
        setIsLoading(false)
      }
    }

    
  if (searchInput.length === 0) {
    setIsLoading(false)
  }
  if (searchInput.length < 3) {
    setMovieData([]);
    setError('PLEASE TYPE MORE THAN 3 LATTER');
    return;
  }
    fetchMovie();
  }, [searchInput])

  return (
    <>
    <Routes>
      
    
      
      <Route path="/" element={<>
        <NavBar searchInput={searchInput} setSearchInput={setSearchInput} />
          <Body movieData={movieData} isLoading={isLoading} error={error}
          setSelectedId={setSelectedId}
          />
      
      </>} />
      <Route path="/detail-page" element={<>
      {
        selectedId === null ? (
          <div className="zeroSelected">
            <h2>Please don't Refresh the page || select a movie again</h2>
          </div>
        ) : (
          <Details selectedId={selectedId}
          handleAddWatched={handleAddWatched}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          watched={watched}
          />
        )
      }
        </>} />
        <Route path="/watch-list-page" element={
          <>
          {
              watched.length === 0 ? (
                <>
                     
             
              <div className="emptyWatchList">
                 <h2>WatchList is empty | Please add some movie</h2>
                <Link to={'/'}>
                   <div className="homeRedirect">
                        <Buttons>
                             Home
                        </Buttons>
                   </div>
              </Link>
              </div>
      
                 </>
              ) : (
                <>
        
                <WatchList watched={watched}
                   handleRemoveWatched={handleRemoveWatched}
                   isLoading={isLoading}
                   setIsLoading={setIsLoading} > <Stats watched={watched} /> </WatchList>
                </>
              )
          }
          </>
        } />

    </Routes>
        
    </>
  )
}

function NavBar ({searchInput, setSearchInput}) {
  return (
    <>
    <div className="navBar">
      <input type="text" placeholder="search"
      value={searchInput}
      onChange={(e) => setSearchInput(e.target.value)}
      
      />
    </div>
    </>
  )
}

function Loader () {
  return (
    <>
    <div className="loaderClass">
       <h2 className="loader">Loading</h2>
    </div>
    </>
  )
}
function ErrorMessage ({children}) {
  return (
    <>
    {
      children
    }
    </>
  )
}
function Body ({movieData, isLoading, error, setSelectedId}) {
  return (
    <>
    <div className="body">
      <div className="head">
      <h2 className="headTitle">Movies</h2>
      <Link to={'/watch-list-page'} 
      >

        <Buttons>
          Go to WatchList
             </Buttons>
      </Link>

      </div>
      <div className="movies">
        {isLoading ? <Loader /> : (
          error ? (
            <>
                 <ErrorMessage >
                <div className="errorMessage">
                  <h3>
                    {error}
                  </h3>
                </div>
              </ErrorMessage>
            </>
          ) : 
          <Movie movieData={movieData} setSelectedId={setSelectedId} /> 
        )
        }
      </div>
    </div>
    
    </>
  )
}

function Movie ({movieData, setSelectedId}) {

  //console.log(data[0].name)
  //map - this should be done with map method.
  //next-> api integration

  /* 
  Poster: "https://m.media-amazon.com/images/M/MV5BMmNlYzRiNDctZWNhMi00MzI4LThkZTctMTUzMmZkMmFmNThmXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg"
​​
Title: "2001: A Space Odyssey"
​​
Type: "movie"
​​
Year: "1968"
​​
imdbID: "tt0062622"
*/

function handleSelectMovie (id) {
    setSelectedId(id);
}
  return (
    <>
      
      <div className="movieContainer">

      {
        movieData?.map((d, idx) => {
          return (
            <Link to={'/detail-page'} key={idx} className="movieName" 
            onClick={() => handleSelectMovie(d.imdbID)}
            >
                <img src={d.Poster} alt={d.Title} />
                <h4> {d.Title} </h4>
            </Link>
          )
        } )
      }
      </div>
    </>
  )
}

function Details ({selectedId, handleAddWatched, isLoading, setIsLoading, watched }) {

    const [singleMovie, setSingleMovie] = useState({})
    const [isWatched, setIsWatched] = useState(false);

    const alreadyAdded = watched.map((movie) => movie.imdbID).includes(selectedId);

    const {
      Title : title,
      Poster : poster,
      Year : year,
      Plot : plot,
      Runtime : runtime,
      imdbRating,
      Director : director,
      Released : released ,
      Actors : actors,
      Genre : genre,
      
    }  =   singleMovie;

    function handleAdd () {
      const newWatchMovie = {
        title,
        poster,
        runtime,
        released,
        year,
        imdbRating,
        imdbID : `${selectedId}`
      }
      handleAddWatched(newWatchMovie);
      setIsWatched((watch) => !watch);
    }

   // console.log(singleMovie);

  useEffect(function () {
    async function fetchMovieById () {
      setIsLoading(true)
      const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`);
      const data = await res.json();
     // console.log(data);
      setSingleMovie(data);
      setIsLoading(false)
    }

    fetchMovieById();
  }, [selectedId]);
  /* Actors: "Josh Hutcherson, Jonah Bobo, Dax Shepard"
​
imdbVotes: "116,886"*/
useEffect(function () {
   
    document.title = `Movie | ${singleMovie.Title}`
    return function () {
      document.title = 'Movie App';
    }
}, [singleMovie.Title])
  return (
    <>
    {
      isLoading ? (
        <Loader/>
      ) :
      (

        <div className="details">
      <div className="imgCont">
        <img src={singleMovie.Poster} alt={singleMovie.Title} />
      </div>
      <div className="textCont">
        <h2>
          {singleMovie.Title}
           </h2>
        <p> Hours :  {singleMovie.Runtime} </p>
        <p > Description
          {singleMovie.Plot}
        </p>
        <p className="directedBy"> Directed By : {singleMovie.Director} </p>
        <p>Released Date : {singleMovie.Released} </p>
        <p>IMDB Rating : {singleMovie.imdbRating} </p>
        <p> Language : {singleMovie.Language} </p>
        <p> Actors : {singleMovie.Actors} </p>
        <p>
          Genre : {singleMovie.Genre}
        </p>
        <div className="twoButtons">
          <div>
              {
                alreadyAdded ? (
                  <p> <i> Movie Added to watchList</i></p>
                ) : (
                  <>
             <button className="buttons" onClick={handleAdd}  >

                <Buttons>
                   {
                    isWatched ? 'Remove from WatchList' : ' + Add to WatchList'
                   }
                 
                 </Buttons>
             </button>
                   </>
                )
              }
              </div>
              
             <Link to={'/watch-list-page'} >
             <button className='GoWatch' >
                <Buttons>
                  Go to WatchList
                </Buttons>
             </button>
             </Link>
        </div>
      </div>
    </div>
    )
  }
    </>
  )
}
function Buttons ({children}) {
  return (
    <>
    <div className="buttons">
      {
            children
      }
    </div>
    </>
  )
}
function Stats ({watched}) {
  const avgRating = average(watched.map((movie) => movie.imdbRating ))
  //console.log(avgRating);
  return (
    <>
    <div className="stats">
      <h4>Average Rating : {avgRating.toFixed(2)} </h4>
       <h4>Total no. of Movie : {watched.length} </h4>
    </div>

    </>
  )
}

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

function WatchList ({watched, handleRemoveWatched, children}) {
  //console.log(watched.length)
  return (
    <>
      <div className="watchListContainer">
   
      {
        watched.map((movie) => {
          return (
            <div key={movie.imdbID}>
              
                  <WatchMovie movie={movie} handleRemoveWatched={handleRemoveWatched} />
                  
            </div>
                
                )
              })
        }
        </div>
        {
          children
        }
      
     </>
   )
}
function WatchMovie ({movie, handleRemoveWatched}) {
  return (
    <>
   
   <div className="watchMovie">
      
     
     <div className="watchImg">
        <img src={movie.poster} alt={movie.title} />
      </div>
      <div className="watchedMovieName">
        <p>{movie.title}</p>
        <div className="ratingN-btn">
            <p> Ratings : {movie.imdbRating} </p>
              <div className="removeButton" onClick={() => handleRemoveWatched(movie.imdbID)}>
                <Buttons>
                    ❌
               </Buttons>
            </div>

         </div>
      </div>
    
    </div>
    </>
  )
}