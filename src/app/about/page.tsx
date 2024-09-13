import React from 'react'

const About = () => {
  return (
    <main className="flex flex-col min-h-screen text-white relative gap-4 py-2">
      <section className="max-w-3xl mx-auto p-4 ">
        <h1 className="text-3xl font-bold mb-4">About This Website</h1>
        <p className=" leading-relaxed text-secondary-gray">
          Welcome to my project! This website was created as a personal initiative to track various statistics while learning how to code. 
          I wanted to explore web development and data handling, so I decided to build a platform that lets me experiment with these technologies 
          while also serving as a practical tool for tracking data. 
        </p>
        <p className="leading-relaxed mt-4 text-secondary-gray">
          Through this journey, I’ve been able to dive into different aspects of web development, improve my coding skills, and deepen my understanding of 
          how to build and manage applications. I hope this project not only helps me grow as a developer but also serves as a resource for anyone interested in 
          the same topics.
        </p>
      </section>
    </main>
  )
}

export default About
