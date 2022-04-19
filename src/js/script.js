const API_KEY = 'f07def32c8f5c266f3762c51dee8b5da'
const wrapper = document.getElementById('wrapper')

// https://api.themoviedb.org/3/movie/550?api_key=
const fetchingMovies = async () => {
	for (let i = 2; i < 50; i++) {
		const res = await fetch(
			`https://api.themoviedb.org/3/movie/${i}?api_key=${API_KEY}`,
		)
		const data = await res.json()
		// console.log(data)
		if (data.success !== false) carts(data)
	}
}
fetchingMovies()

const carts = (movie) => {
	wrapper.innerHTML += `
  <div class="p-4 border-2 border-gray-700 rounded-lg space-y-2">
      <img src="${
				movie.poster_path
					? `https://www.themoviedb.org/t/p/w600_and_h900_bestv2/${movie.poster_path}`
					: ''
			}" alt="${movie.title ? movie.title : ''}"
        class="w-48 rounded-md">
      <h4 class="text-xl font-semibold">
        ${movie.title ? movie.title : ''}
      </h4>
      <p class="">${movie.overview ? movie.overview : ''}</p>
  </div>
  `
}
