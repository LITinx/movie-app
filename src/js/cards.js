const API_KEY = 'f07def32c8f5c266f3762c51dee8b5da';
const wrapper = document.getElementById('wrapper');
const btnPrev = document.getElementById('btnPrev');
const btnNext = document.getElementById('btnNext');
const iconLeft = document.getElementById('btnLeft');
const iconRight = document.getElementById('btnRight');
const searcBtn = document.getElementById('btnSearch');
const searchInput = document.getElementById('searchInput');
const popularWrapper = document.querySelector('.popular');
const dropDownMenu = document.querySelector('.menu');
const ulMenu = document.querySelector('.ulMenu');
const popularBtn = document.getElementById('popular');
const topRatedBtn = document.getElementById('topRated');
const upcomingBtn = document.getElementById('upcoming');
const menuNav = document.querySelector('.menuNav');
const burger = document.querySelector('.burger');
const body = document.querySelector('body');
burger.addEventListener('click', () => {
	menuNav.classList.toggle('active');
	burger.classList.toggle('active');
	body.classList.toggle('lock');
});
let pages = 1;
let movieStatus = 'popular';
let search;
popularBtn.addEventListener('click', () => {
	wrapper.innerHTML = '';
	pages = 1;
	menuNav.classList.toggle('active');
	burger.classList.toggle('active');
	body.classList.toggle('lock');
	movieStatus = 'popular';
	popularWrapper.innerHTML = 'Popular';
	fetchingMovies();
});
topRatedBtn.addEventListener('click', () => {
	wrapper.innerHTML = '';
	pages = 1;
	menuNav.classList.toggle('active');
	burger.classList.toggle('active');
	body.classList.toggle('lock');
	movieStatus = 'top_rated';
	popularWrapper.innerHTML = 'Top Rated';
	fetchingMovies();
});
upcomingBtn.addEventListener('click', () => {
	wrapper.innerHTML = '';
	pages = 1;
	menuNav.classList.toggle('active');
	burger.classList.toggle('active');
	body.classList.toggle('lock');
	movieStatus = 'upcoming';
	popularWrapper.innerHTML = 'Up Coming';
	fetchingMovies();
});
dropDownMenu.addEventListener('click', () => {
	ulMenu.classList.toggle('hidden');
});
btnNext.addEventListener('click', () => {
	if (pages < 40) {
		pages++;
		wrapper.innerHTML = '';
		fetchingMovies(search);
	}
});
btnPrev.addEventListener('click', () => {
	if (pages > 1) {
		pages--;
		wrapper.innerHTML = '';
		fetchingMovies(search);
	}
});
searcBtn.addEventListener('click', (e) => {
	e.preventDefault();
	search = searchInput.value
		.split(' ')
		.filter((e) => e !== '')
		.join('%20');
	movieStatus = 'search';
	fetchingMovies(search);
	searchInput.value = '';
});
const searchMovies = async (searchValue) => {
	wrapper.innerHTML = '';
	const res = await fetch(`
		https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${searchValue}&page=${pages}&include_adult=false
	`);
	const data = await res.json();
	popularWrapper.innerHTML = 'Search Results';
	if (data.hasOwnProperty('errors')) {
		wrapper.innerHTML = `
		  <h2 class="text-center grid-col text-red-500 text-2xl font-bold">There are no such films or no such films in our database</h2> 
		`;
		btnDisable();
	}
	if (data.total_results === 0) {
		wrapper.innerHTML = `
		  <h2 class="text-center grid-col text-red-500 text-2xl font-bold">There are no such films or no such films in our database</h2> 
		`;
		btnDisable();
	}
	if (data.total_pages <= 1) {
		btnDisable();
	}
	if (!data.success) {
		for (let i = 0; i < 20; i++) {
			cards(data.results[i]);
		}
	}
};
const btnDisable = () => {
	btnPrev.disabled = true;
	iconLeft.classList.add('text-gray-500');
	btnNext.disabled = true;
	iconRight.classList.add('text-gray-500');
};
// https://api.themoviedb.org/3/movie/550?api_key=
const fetchPopularMovies = async (genre) => {
	try {
		const res = await fetch(
			`https://api.themoviedb.org/3/movie/${genre}?api_key=${API_KEY}&language=en-US&page=${pages}`,
		);
		const data = await res.json();
		console.log(data);
		if (data.success !== false) {
			for (let i = 0; i < 20; i++) {
				cards(data.results[i]);
			}
		}
		pagesChecker();
	} catch (err) {
		console.error(`Error ${err}`);
	}
};
const fetchingMovies = (searchValue) => {
	if (movieStatus === 'popular') {
		fetchPopularMovies('popular');
	}
	if (movieStatus === 'top_rated') {
		fetchPopularMovies('top_rated');
	}
	if (movieStatus === 'upcoming') {
		fetchPopularMovies('upcoming');
	}
	if (movieStatus === 'search') {
		searchMovies(searchValue);
		pagesChecker();
	}
};
fetchingMovies();

const pagesChecker = () => {
	if (pages === 14) {
		btnNext.disabled = true;
		iconRight.classList.add('text-gray-500');
	}
	if (pages < 14) {
		btnNext.disabled = false;
		iconRight.classList.remove('text-gray-500');
	}
	if (pages === 1) {
		btnPrev.disabled = true;
		iconLeft.classList.add('text-gray-500');
	}
	if (pages > 1) {
		btnPrev.disabled = false;
		iconLeft.classList.remove('text-gray-500');
	}
};

const cards = (movie) => {
	wrapper.innerHTML += `
		<div class="p-4 w-48 card relative">
      <img loading="lazy" src="${
				movie.poster_path
					? `https://www.themoviedb.org/t/p/w600_and_h900_bestv2/${movie.poster_path}`
					: 'https://www.ceeol.com/images/no-image.jpg'
			}" alt="${movie.title ? movie.title : 'film photo'}"
        class="w-full rounded-lg shadow-sm shadow-black cursor-pointer object-cover cardImg">
      <div class="relative">
        <span
          class="text-sm border-[3px] rounded-full p-1 ${
						movie.vote_average < 6.5 ? 'border-yellow-400' : 'border-green-400'
					}
					 rate absolute font-bold text-white bg-gray-800">${movie.vote_average * 10}<span
            class="text-[8px]">%</span></span>
      </div>
      <div class="mt-5">
        <h4 class="text-[16px] font-semibold break-words cursor-pointer">${
					movie.title ? movie.title : movie.name
				}
        </h4>
        <p class="text-gray-500 text-sm">
          ${movie.release_date ? movie.release_date : 'Coming Out'}</p>
      </div> 
				<div class="min-w-fit min-h-fit bg-slate-300 absolute top-10 flex-col sm:flex-row cardModal rounded-2xl z-10"
					id="modalMenu">
				<img src="${
					movie.backdrop_path
						? `https://www.themoviedb.org/t/p/w600_and_h900_bestv2/${movie.backdrop_path}`
						: 'https://www.ceeol.com/images/no-image.jpg'
				}" alt=""
						class="w-60 object-cover h-80 p-3 ">
				<div class="p-4 md:pl-0 pl-4 pt-2 md:p-6 bg-slate-300 rounded-2xl">
					<h2 class="font-bold  text-2xl pb-5">${
						movie.title
					} <span class="font-normal">(${movie.release_date
		.split('-')
		.shift()})</span></h2>
					<div class="flex gap-4 items-center">
						<div class="">
							<span
								class="text-lg border-[3px] rounded-full p-2  ${
									movie.vote_average < 6.5
										? 'border-yellow-400'
										: 'border-green-400'
								} rate font-bold text-white bg-gray-800">${
		movie.vote_average * 10
	}<span
									class="text-[8px]">%</span></span>
						</div>
						<h6 class="text-md">User Score</h6>
					</div>
					<div class="pt-4">
						<h4 class="text-lg font-medium">Overview</h4>
						<p class="para">${movie.overview}</p>
					</div>
				</div>
			</div>
		</div>
  `;
};
