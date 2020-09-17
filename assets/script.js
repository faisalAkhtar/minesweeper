(function () {
    var MineSweaper = {
        init: function () {
            this.grid = document.querySelector('.grid')
            this.flagsLeft = document.querySelector('#flags-left')
            this.result = document.querySelector('#result')
            this.width = 10
            this.bombAmount = 20
            this.flags = 0
            this.squares = []
            this.isGameOver = false
            this.helpBtn = document.querySelector("#help")
            this.helps = 3
            this.flagBtn = document.querySelector("#flag")
            this.flagCursor = true
            this.createBoard()

            this.helpBtn.addEventListener("click", this.helpFunc);
            this.helpBtn.innerHTML = "? = " + this.helps

            this.flagBtn.addEventListener("click", this.flagFunc);
        },
        //create Board
        createBoard: function () {
            let _ = this,
                width = _.width,
                //get shuffled game array with random bombs
                bombsArray = Array(_.bombAmount).fill('bomb'),
                emptyArray = Array(width*width - _.bombAmount).fill('valid'),
                gameArray = emptyArray.concat(bombsArray),
                shuffledArray = gameArray.sort(() => Math.random() - 0.5)

            _.flagsLeft.innerHTML = _.bombAmount

            for (let i = 0; i < width*width; i++) {
                let square = document.createElement('div')
                square.setAttribute('id', i)
                square.classList.add(shuffledArray[i])
                _.grid.appendChild(square)
                _.squares.push(square)

                //normal click
                square.addEventListener('click', function(e) {
                    if(_.flagCursor) {
                        _.click(square)
                    } else {
                        _.addFlag(square)
                        _.flagCursor = true
                        _.flagBtn.classList.remove("pressed")
                    }
                })

                //cntrl and left click
                square.oncontextmenu = function(e) {
                    e.preventDefault()
                    _.addFlag(square)
                }
            }

            //add numbers
            for (let i = 0; i < _.squares.length; i++) {
                let total = 0,
                    isLeftEdge = (i % width === 0),
                    isRightEdge = (i % width === width -1)

                if (_.squares[i].classList.contains('valid')) {
                    if (i > 0 && !isLeftEdge && _.squares[i -1].classList.contains('bomb')) total ++
                    if (i > 9 && !isRightEdge && _.squares[i +1 -width].classList.contains('bomb')) total ++
                    if (i > 10 && _.squares[i -width].classList.contains('bomb')) total ++
                    if (i > 11 && !isLeftEdge && _.squares[i -1 -width].classList.contains('bomb')) total ++
                    if (i < 98 && !isRightEdge && _.squares[i +1].classList.contains('bomb')) total ++
                    if (i < 90 && !isLeftEdge && _.squares[i -1 +width].classList.contains('bomb')) total ++
                    if (i < 88 && !isRightEdge && _.squares[i +1 +width].classList.contains('bomb')) total ++
                    if (i < 89 && _.squares[i +width].classList.contains('bomb')) total ++
                    _.squares[i].setAttribute('data', total)
                }
            }
        },
        //add Flag with right click
        addFlag: function (square) {
            if (this.isGameOver) return
            if (!square.classList.contains('checked') && (this.flags < this.bombAmount)) {
                if (!square.classList.contains('flag')) {
                    square.classList.add('flag')
                    square.innerHTML = '&#128681;'
                    this.flags ++
                    this.flagsLeft.innerHTML = this.bombAmount- this.flags
                    this.checkForWin()
                } else {
                    square.classList.remove('flag')
                    square.innerHTML = ''
                    this.flags --
                    this.flagsLeft.innerHTML = this.bombAmount- this.flags
                }
            }
        },
        //add Flag with right click
        click: function (square) {
            let currentId = square.id
            if (this.isGameOver) return
            if (square.classList.contains('checked') || square.classList.contains('flag')) return
            if (square.classList.contains('bomb')) {
              this.gameOver(square)
            } else {
              let total = square.getAttribute('data')
              if (total !=0) {
                square.classList.add('checked')
                if (total == 1) square.classList.add('one')
                if (total == 2) square.classList.add('two')
                if (total == 3) square.classList.add('three')
                if (total == 4) square.classList.add('four')
                square.innerHTML = total
                return
              }
              this.checkSquare(square, currentId)
            }
            square.classList.add('checked')
        },
        //check neighboring squares once square is clicked
        checkSquare : function (square, currentId) {
            let width = this.width,
                squares = this.squares,
                isLeftEdge = (currentId % width === 0),
                isRightEdge = (currentId % width === width -1),
                newId, newSquare

            setTimeout(() => {
                if (currentId > 0 && !isLeftEdge) {
                    newId = squares[parseInt(currentId) -1].id
                    newSquare = document.getElementById(newId)
                    this.click(newSquare)
                }
                if (currentId > 9 && !isRightEdge) {
                    newId = squares[parseInt(currentId) +1 -width].id
                    newSquare = document.getElementById(newId)
                    this.click(newSquare)
                }
                if (currentId > 10) {
                    newId = squares[parseInt(currentId -width)].id
                    newSquare = document.getElementById(newId)
                    this.click(newSquare)
                }
                if (currentId > 11 && !isLeftEdge) {
                    newId = squares[parseInt(currentId) -1 -width].id
                    newSquare = document.getElementById(newId)
                    this.click(newSquare)
                }
                if (currentId < 98 && !isRightEdge) {
                    newId = squares[parseInt(currentId) +1].id
                    newSquare = document.getElementById(newId)
                    this.click(newSquare)
                }
                if (currentId < 90 && !isLeftEdge) {
                    newId = squares[parseInt(currentId) -1 +width].id
                    newSquare = document.getElementById(newId)
                    this.click(newSquare)
                }
                if (currentId < 88 && !isRightEdge) {
                    newId = squares[parseInt(currentId) +1 +width].id
                    newSquare = document.getElementById(newId)
                    this.click(newSquare)
                }
                if (currentId < 89) {
                    newId = squares[parseInt(currentId) +width].id
                    newSquare = document.getElementById(newId)
                    this.click(newSquare)
                }
            }, 10)
        },
        //game over
        gameOver: function (square) {
            result.innerHTML = 'BOOM! Game Over!'
            this.isGameOver = true

            //show ALL the bombs
            this.squares.forEach(square => {
                if (square.classList.contains('bomb')) {
                    square.innerHTML = '&#128163;'
                    square.classList.remove('bomb')
                    square.classList.add('checked')
                }
            })
        },
        //check for win
        checkForWin: function () {
            ///simplified win argument
            let matches = 0,
                squares = this.squares

            for (let i = 0; i < squares.length; i++) {
                if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
                    matches ++
                }
                if (matches === this.bombAmount) {
                    result.innerHTML = 'YOU WIN!'
                    isGameOver = true
                }
            }
        },
        //help function
        helpFunc: function () {
            let _ = MineSweaper
            if (_.isGameOver) return
            if (_.helps<=0) return
            let square
            for (let bomb of document.querySelectorAll(".bomb")) {
                if (!bomb.classList.contains("flag")) {
                    square = bomb
                    break
                }
            }
            _.addFlag(square)
            this.innerHTML = "? = " + (--_.helps)
        },
        flagFunc: function () {
            let _ = MineSweaper
            if (_.isGameOver) return
            if (_.flagCursor) {
                _.flagCursor = false
                this.classList.add("pressed")
            } else {
                _.flagCursor = true
                this.classList.remove("pressed")
            }
        }
    }

    MineSweaper.init()
})()