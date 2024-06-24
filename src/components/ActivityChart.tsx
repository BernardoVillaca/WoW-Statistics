import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { ActivityMap } from '~/utils/helper/activityMap'

const ActivityChart = () => {
  const [activityData, setActivityData] = useState<ActivityMap>()



  useEffect(() => {
    const getActivityData = async () => {
      const response = await axios.get('/api/getActivity')
      setActivityData(response.data.activityData)
    }
    void getActivityData()
  }, [])



  




  return (
    <div className='flex flex-col w-1/2 h-full pt-2 '>
      <div className='flex flex-col h-10 w-full items-center place-content-center bg-gray-800 rounded-xl'>
        <span>Activity</span>
      </div>
    </div>


  )
}

export default ActivityChart