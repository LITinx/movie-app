const API_KEY = 'f07def32c8f5c266f3762c51dee8b5da'
const wrapper = document.getElementById('wrapper')
const btnPrev = document.getElementById('btnPrev')
const btnNext = document.getElementById('btnNext')
const iconLeft = document.getElementById('btnLeft')
const iconRight = document.getElementById('btnRight')
const searcBtn = document.getElementById('btnSearch')
const searchInput = document.getElementById('searchInput')
let pages = 1
btnNext.addEventListener('click', () => {
	if (pages < 15) {
		pages++
		wrapper.innerHTML = ''
		fetchingMovies()
	}
})
btnPrev.addEventListener('click', () => {
	if (pages > 1) {
		pages--
		wrapper.innerHTML = ''
		fetchingMovies()
	}
})
searcBtn.addEventListener('click', (e) => {
	e.preventDefault()
	let search = searchInput.value
		.split(' ')
		.filter((e) => e !== '')
		.join('%20')
	searchMovies(search)
	searchInput.value = ''
})
const searchMovies = async (searchValue) => {
	wrapper.innerHTML = ''
	const res = await fetch(`
		https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&language=en-US&query=${searchValue}&page=1&include_adult=false
	`)
	const data = await res.json()
	console.log(data)
	if (data.success !== false) {
		for (let i = 0; i < 20; i++) {
			carts(data.results[i])
		}
	}
}
// https://api.themoviedb.org/3/movie/550?api_key=
const fetchingMovies = async () => {
	const res = await fetch(
		`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${pages}`,
	)
	const data = await res.json()
	pagesChecker()
	console.log(data)
	if (data.success !== false) {
		for (let i = 0; i < 20; i++) {
			carts(data.results[i])
		}
	}
}
fetchingMovies()

const pagesChecker = () => {
	if (pages === 14) {
		btnNext.disabled = true
		iconRight.classList.add('text-gray-500')
	}
	if (pages < 14) {
		btnNext.disabled = false
		iconRight.classList.remove('text-gray-500')
	}
	if (pages === 1) {
		btnPrev.disabled = true
		iconLeft.classList.add('text-gray-500')
	}
	if (pages > 1) {
		btnPrev.disabled = false
		iconLeft.classList.remove('text-gray-500')
	}
}

const carts = (movie) => {
	wrapper.innerHTML += `
  <div class="p-4 space-y-2 w-48 ">
      <img src="${
				movie.poster_path
					? `https://www.themoviedb.org/t/p/w600_and_h900_bestv2/${movie.poster_path}`
					: 'https://www.ceeol.com/images/no-image.jpg'
			}" alt="${movie.title ? movie.title : ''}"
        class="w-full rounded-lg shadow-sm shadow-black cursor-pointer object-cover">
      <h4 class="text-[16px] font-semibold break-words cursor-pointer">
        ${movie.title ? movie.title : ''}
      </h4>
      <p class="text-gray-500 text-sm">${
				movie.release_date ? movie.release_date : 'Coming Out'
			}</p>
  </div>
  `
}
