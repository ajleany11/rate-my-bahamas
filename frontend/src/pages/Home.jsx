import Navbar from '../components/Navbar'
import SearchBar from '../components/SearchBar'

function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar showSearch={false} />

      <section className="px-4 py-20 bg-gradient-to-b from-blue-50 to-slate-50 text-center">
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-blue-900 leading-tight">
          Rate Professors.
          <br />
          <span className="text-amber-500">Help Students.</span>
        </h1>
        <p className="text-slate-500 mt-4 max-w-md mx-auto">
          Real reviews from real students at The University of The Bahamas.
        </p>

        <div className="mt-8 max-w-md mx-auto bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <SearchBar size="lg" />
        </div>
      </section>
    </div>
  )
}

export default Home
