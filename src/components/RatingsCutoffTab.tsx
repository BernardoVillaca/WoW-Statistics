'use client'

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import useURLChange from '~/utils/hooks/useURLChange';


const RatingsCuttoffTab = () => {
  const queryParams = useURLChange();
  const [data, setData] = useState(null); 
  const [path, setPath] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPath(window.location.pathname);
    }
  }, []);
  
  const getQueryParams = () => {
    const params = new URLSearchParams(queryParams ?? '');
    let bracket = params.get('bracket') ?? '3v3';

    if (path?.includes('solo-shuffle')) {
      bracket = 'shuffle';
    }
    return {
      version: params.get('version') ?? 'retail',
      region: params.get('region') ?? 'us',
      bracket: bracket,
      search: params.get('search') ?? undefined,
      faction: params.get('faction') ?? undefined,
     
     
    };
  };
  useEffect(() => {
    const getRatingCutoffs = async () => {
      const response = await axios.get(`/api/getRatingCutoffs`,{
        params: getQueryParams()
      
      })
      console.log(response.data.cutoffs)
      setData(response.data.cutoffs)
     
   
    }
    getRatingCutoffs()


  }, [])


  return (
    <div className='flex h-10 bg-gray-800 rounded-xl justify-center items-center gap-48 '>
     
    </div>
  )
}

export default RatingsCuttoffTab