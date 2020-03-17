
(function () {
  //清單來自local Storage不是api
  //卡片設計有差異,無須有加入收藏的按鈕,而是移出按鈕
  const BASE_URL = 'https://movie-list.alphacamp.io'
  const INDEX_URL = BASE_URL + '/api/v1/movies/'
  const POSTER_URL = BASE_URL + '/posters/'
  const dataPanel = document.getElementById('data-panel')
  const data = JSON.parse(localStorage.getItem('favoriteMovies')) || []

  displayDataList(data)

  function displayDataList(data) {
    let htmlContent = ''
    data.forEach(function (item, index) {
      htmlContent += `
        <div class="col-sm-3">
          <div class="card mb-2">
            <img class="card-img-top " src="${POSTER_URL}${item.image}" alt="Card image cap">
            <div class="card-body movie-item-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
              <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
            </div>
          </div>
        </div>
      `
    })
    dataPanel.innerHTML = htmlContent
  }

  //listen to the data panel
  dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.btn-show-movie')) {
      showMovie(event.target.dataset.id)
    } else if (event.target.matches('.btn-remove-favorite')) {
      removeFavoriteItem(event.target.dataset.id)
    }
  })

  function showMovie(id) {
    const modalTitle = document.getElementById('show-movie-title')
    const modalImage = document.getElementById('show-movie-image')
    const modalDate = document.getElementById('show-movie-date')
    const modalDescription = document.getElementById('show-movie-description')

    //set request url 
    const url = INDEX_URL + id
    console.log(url)

    // requesr to show api
    axios.get(url).then(response => {
      const data = response.data.results
      console.log(data)
      //insert data into modal ui
      modalTitle.textContent = data.title
      modalImage.innerHTML = `<img src = "${POSTER_URL}${data.image}" class = "img-fluid" alt="Responsive image">`
      modalDate.textContent = `release at : ${data.release_date}`
      modalDescription.textContent = `${data.description}`
    })
  }

  function removeFavoriteItem(id) {
    //find movie by id
    const index = data.findIndex(item => item.id === Number(id))
    if (index === -1) return

    //remove movie and update localStorage
    data.splice(index, 1)
    //將新的資料使用setItem再次傳入
    localStorage.setItem('favoriteMovies', JSON.stringify(data))

    //repaint datalist
    displayDataList(data)
  }
})()