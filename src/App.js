import React, { useState, useEffect } from 'react'
import { FaSearch } from 'react-icons/fa'
import Photo from './Photo'


const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`
const mainUrl = `https://api.unsplash.com/photos/`
const searchUrl = `https://api.unsplash.com/search/photos/`

function App() {

  const [loading, setLoading] = useState(false)
  const [photos, setPhotos] = useState([])
  const  [page, setPage] = useState(0)
  const [query, setQuery] = useState('')


  const fetchImages = async() =>{
    setLoading(true)
    let url;
    const urlPage = `&page=${page}`
    const urlQuery = `&query=${query}`
  

    if(query){
      url = `${searchUrl}${clientID}${urlPage}${urlQuery}`
    }
    else{
      url = `${mainUrl}${clientID}${urlPage}`
    }
 

    try {
      const response = await fetch(url);
      const data = await response.json();
      setPhotos((oldPhoto) => {
        if(query && page === 1){
          return data.results
        }
       else if(query){
          return [...oldPhoto, ...data.results]
        }
        else{
          return [...oldPhoto, ...data]
        }
      })
      setLoading(false)

    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }


  useEffect(()=>{
    fetchImages();
  },[page])


  
  useEffect(()=>{
    const event = window.addEventListener('scroll', () =>{
      if(!loading && window.innerHeight + window.scrollY >= document.body.scrollHeight - 2){
        setPage((oldPage) => {
          return oldPage + 1;
        })
      }
    });
    return () => window.removeEventListener('scroll', event)
  },[loading])
  const handleSubmit = (e) =>{
    e.preventDefault();
    if(!query) return;
    if(page === 1){
      fetchImages()
    }
    setPage(2)
  }
  return <main>
      <section className="search">
        <form action="" className="search-form">
          <input type="text" placeholder='search' value={query} onChange={(e)=>setQuery(e.target.value)} className='form-input'/>
          <button type="submit" className='submit-btn' onClick={handleSubmit}><FaSearch/></button>
        </form>
      </section>
      <section className="photos">
        <div className="photos-center">
          {photos.map((photo, index) =>{
            return <Photo key={photo.id} {...photo} />
          })}
        </div>
        {loading && <h2 className='loading'>Loading...</h2>}
      </section>
  </main>
}

export default App
