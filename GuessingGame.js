
function Game(){
    this.playersGuess = null,
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
}

function generateWinningNumber(){
    return Math.floor(Math.random() * 100 + 1);
}

Game.prototype.difference = function(){
    return Math.abs(this.playersGuess-this.winningNumber);
}

Game.prototype.isLower = function(){
    if(this.playersGuess>this.winningNumber){
        return false;
    } else {
        return true;
    }
}

Game.prototype.playersGuessSubmission = function(num){
    this.playersGuess = num;
    if(num<1||num>100||typeof num !== 'number'){
        throw "That is an invalid guess."
    } 
        
    return this.checkGuess();
    
}

Game.prototype.checkGuess = function(){
    if(this.playersGuess===this.winningNumber){
        $('#hint, #submit').prop('disabled',true);
        $('#feedback').text('Press Reset to play again!')
        return "You Win!"
    } else {
        if(this.pastGuesses.indexOf(this.playersGuess)>-1){
            return "You have already guessed that number.";
        } else {
            this.pastGuesses.push(this.playersGuess);
            $('#guess-list li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess);
           if(this.pastGuesses.length===5){
                $('#hint, #submit').prop('disabled',true);
                $('#feedback').text('Press Reset to try again');
               return "You Lose.";
           } 
           else {
            //    var diff = Math.abs(this.playersGuess-this.winningNumber);
               var diff = this.difference();
               if(this.isLower()){
                   $('#feedback').text('Guess Higher!');
               } else {
                   $('#feedback').text('Guess Lower!');
               }
               if(diff<10){
                   return 'You\re burning up!';
               } else if(diff<25){
                    return 'You\'re lukewarm.';
               } else if(diff<50){
                    return "You\'re a bit chilly.";
               } else {
                    return "You\'re ice cold!";
               }
           }
        }
    }
}

function newGame(){
    return new Game();
}

Game.prototype.provideHint = function(){
    var hintArray = [this.winningNumber,generateWinningNumber(),generateWinningNumber()]; 
    return shuffle(hintArray);
}

function shuffle(array) {
    var m = array.length, t, i;
      
        // While there remain elements to shuffle…
        while (m) {
      
          // Pick a remaining element…
          i = Math.floor(Math.random() * m--);
      
          // And swap it with the current element.
          t = array[m];
          array[m] = array[i];
          array[i] = t;
        }
      
    return array;
}

function makeAGuess(game){
    var guess = $('#input').val()
    $('#input').val('');
    var output = game.playersGuessSubmission(parseInt(guess,10));
    $('#feedback').text(output);
}

$(document).ready(function(){
    var game = new Game();
    hintTrys = 1;

    $('#hint').click(function(){
        var hints = game.provideHint();
        hintTrys--;
            if(hintTrys>=0){
            
                $('#clue').text('The winning number is either '+ hints[0]+', ' + hints[1]+', or '+hints[2]);
         
            } else {
                $('#clue').text(`You've run out of hints`);
            }
        
    });

    $('#reset').click(function(){
        game = new Game;
        $('#feedback').text('Guess between 1 and 100!');
        $('#hint, #submit').prop('disabled',false);
        $('.guess').text('?');
        $('#clue').text('');
        hintTrys = 1;
    });
   
    $('#submit').on('click',function(e){
        makeAGuess(game);
    });

    $('#input').keypress(function(e){
        if(e.which==13){
            makeAGuess(game);
        }
    });

});


