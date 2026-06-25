import Navbar from '../components/Navbar'

function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="px-4 py-20 text-center">
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-blue-900 leading-tight">
          Rate Professors.
          <br />
          <span className="text-amber-500">Help Students.</span>
        </h1>
        <p className="text-slate-500 mt-4 max-w-md mx-auto">
          Real reviews from real students at The University of The Bahamas.
        </p>
      </section>
    </div>
  )
}

export default Home
