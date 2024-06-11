import React from 'react'


fetch('https://wowstats-blush.vercel.app/api/updateDb')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));


const Home = () => {
  return (
    <div>Home</div>
  )
}

export default Home