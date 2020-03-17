(function () {
  //write your code
  const BASE_URL = 'https://movie-list.alphacamp.io'
  const INDEX_URL = BASE_URL + '/api/v1/movies/'
  const POSTER_URL = BASE_URL + '/posters/'
  //將api獲得的資料放到新的陣列中
  const data = []
  //設定不同顯示頁面的變數
  const showList = document.getElementById('list-display')
  const showPicture = document.getElementById('picture-display')
  //設定一個判斷Modal的boolean值
  let isShowList = false //代表預設為shopicture
  //頁數預設在第一頁
  let page = 1
  //將資料放到網頁中
  const dataPanel = document.getElementById('data-panel')
  let paginationData = []

  //串接api //更改commit測試
  axios.get(INDEX_URL)
    .then((response) => {
      data.push(...response.data.results)
      //displayDataList(data)
      getTotalPages(data)
      getPageData(1, data)
    }).catch((err) => console.log(err))

  //listen to data panel
  dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.btn-show-movie')) {
      showMovie(event.target.dataset.id)
    } else if (event.target.matches('.btn-add-favorite')) {
      addFavoriteItem(event.target.dataset.id)
    }
  })

  //將html事件與js綁定
  const searchForm = document.getElementById('search')
  const searchInput = document.getElementById('search-input')


  //將發送事件跟搜尋連結/將搜尋結果分頁 listen to search input
  searchForm.addEventListener('submit', event => {
    event.preventDefault()
    let input = searchInput.value.toLowerCase()
    let results = data.filter(
      movie => movie.title.toLowerCase().includes(input)
    )
    displayDataList(results)
    console.log(results)
    getTotalPages(results)
    getPageData(1, results)
  })

  function displayDataList(data) {
    let htmlContent = ''
    if (isShowList === false) {
      data.forEach(function (item, index) {
        htmlContent += `
          <div class="col-sm-3">
            <div class="card mb-2 size">
              <img class="card-img-top " src="${POSTER_URL}${item.image}" alt="Card image cap">
              <div class="card-body movie-item-body ">
                <h6 class="card-title">${item.title}</h5>
              </div>
              <div class="card-footer">
                <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
                <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
              </div>
            </div>
          </div>
        `
      })
    } else if (isShowList === true) {
      data.forEach(function (item, index) {
        htmlContent += `
          <ul class="list-group list-group-flush" style="width: 100%;">
                <li class="list-group-item d-flex justify-content-between align-items-center">${item.title}
                <div>
                  <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
                  <!-- favorite button --> 
                  <button class = "btn btn-info btn-add-favorite" data-id ="${item.id}" > + </button>
                  </div>
              </li>
            </ul>
      `
      })
    }
    dataPanel.innerHTML = htmlContent
  }

  //調用函式 將displayDataList 放到串聯api的位置(axios底下))

  //宣告一個新的函數,並發送request 將結果輸出至modal
  function showMovie(id) {
    const modalTitle = document.getElementById('show-movie-title')
    const modalImage = document.getElementById('show-movie-image')
    const modalDate = document.getElementById('show-movie-date')
    const modalDescription = document.getElementById('show-movie-description')

    //set request url 
    const url = INDEX_URL + id
    console.log(url)

    // request to show api
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

  //喜好事件
  function addFavoriteItem(id) {
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    const movie = data.find(item => item.id === Number(id))

    if (list.some(item => item.id === Number(id))) {
      alert(`${movie.title} is already in your favorite list.`)
    } else {
      list.push(movie)
      alert(`Added ${movie.title} to your favorite list!`)
    }
    localStorage.setItem('favoriteMovies', JSON.stringify(list))
  }

  //計算分頁頁碼
  const pagination = document.getElementById('pagination')
  const ITEM_PER_PAGE = 12

  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
      <li class = "page-item">
        <a class = "page-link" herf="javascript:;" data-page="${i + 1}">${i + 1}</a>
      </li>`
    }
    pagination.innerHTML = pageItemContent
  }

  function getPageData(pageNum, data) {
    paginationData = data || paginationData
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    displayDataList(pageData)
  }

  //listen to show-picture click event
  showPicture.addEventListener('click', event => {
    if (event.target.matches("#picture-display")) {
      isShowList = false //showpicture是預設
      getPageData(page)
    }
  })

  //listen to show-list click event 
  showList.addEventListener('click', event => {
    if (event.target.matches("#list-display")) {
      isShowList = true
      getPageData(page)
    }
  })

  // listen to pagination click event
  pagination.addEventListener('click', event => {
    console.log(event.target.dataset.page)
    page = event.target.dataset.page //保留當前頁面
    if (event.target.tagName === 'A') {
      getPageData(event.target.dataset.page)
    }
  })

})()