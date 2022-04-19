import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react'
import UserList from './userList';
import instance from '../../axios'

const SearchUser = () => {
    
   const  [searchQuery , setSearchQuery] = useState({search:''});
    const  [searchResult , setSearchResult] = useState([{one:1},{two:2},{three:3},{four:4},{five:5},{six:6},{seven:7},{eight:8},{nine:9},{ten:10}]);
    const [isLoading, setIsLoading] = useState(true);
   useEffect(() => {
       const getUserSearch =async()=>{
           const res = await instance.get('api/user?search='+searchQuery.search)
           setSearchResult(res.data)
           if(res.data.length>0){
               setIsLoading(false)
               
            }else{
                setIsLoading(true)
                setSearchResult([{one:1},{two:2},{three:3},{four:4},{five:5},{six:6},{seven:7},{eight:8},{nine:9},{ten:10}])
            }
            // console.log(searchResult)
        }
        // setIsLoading(false)
        getUserSearch() 
        return () => {
            setIsLoading(true)
            setSearchResult([])
        }
    }, [searchQuery]);
  return (
    <>
    <Box>
    <div className="searchBar-2aylmZ container-2oNtJn medium-2NClDM">
      <div className="inner-2pOSmK">
        <input
        name="search"
        className="input-2m5SfJ outline-none"
          placeholder="Search user"
          aria-label="Search"
          value={searchQuery.search}
          onChange={(e)=>setSearchQuery({...searchQuery, [e.target.name]:e.target.value})}
        />
        <div
          className="iconLayout-3Bjizv medium-2NClDM"
          tabIndex="-1"
          aria-hidden="true"
          role="button"
        >
          <div className="iconContainer-6pgShY">
            {searchQuery.search?<svg
            onClick={()=>setSearchQuery({...searchQuery, search:''})}
              className="cursor-pointer clear-3102V9 cross icon-3CDcPB"
              aria-label="Clear"
              aria-hidden="false"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z"
              ></path>
            </svg>:
            <svg
            className="icon-3CDcPB search visible-CwPfRb"
            aria-label="Search"
            aria-hidden="false"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            >
            <path
              fill="currentColor"
              d="M21.707 20.293L16.314 14.9C17.403 13.504 18 11.799 18 10C18 7.863 17.167 5.854 15.656 4.344C14.146 2.832 12.137 2 10 2C7.863 2 5.854 2.832 4.344 4.344C2.833 5.854 2 7.863 2 10C2 12.137 2.833 14.146 4.344 15.656C5.854 17.168 7.863 18 10 18C11.799 18 13.504 17.404 14.9 16.314L20.293 21.706L21.707 20.293ZM10 16C8.397 16 6.891 15.376 5.758 14.243C4.624 13.11 4 11.603 4 10C4 8.398 4.624 6.891 5.758 5.758C6.891 4.624 8.397 4 10 4C11.603 4 13.109 4.624 14.242 5.758C15.376 6.891 16 8.398 16 10C16 11.603 15.376 13.11 14.242 14.243C13.109 15.376 11.603 16 10 16Z"
            ></path>
          </svg>
            }
          </div>
        </div>
      </div>
      </div>

    </Box>
    <UserList loading={isLoading} data={searchResult}/>
    </>
  )
}

export default SearchUser