//Click sur le bouton random et coeur
$('.coeur').click(function(){
  $(this).toggleClass('cliquer');
});

$('.random').click(function(){
  $(this).toggleClass('cliquer');
});

//Montre les infos
$('#lePlayer').hover(function(){
  $('.information').toggleClass('monte');
});

//Configuration du lecteur
let audio = new Audio('http://music.dawnfoxes.com/_fxs_/_upls_/_sngs_/UK/clean_bandit-symphony-ft-zara_larsson.mp3');

$('.pause').hide(); //cache le bouton pause tant qu'il n'est pas pressé

//On s'occupe du bouton play
$('.play').click(function(){
  audio.play();
  $('.play').hide();
  $('.pause').show();
});

//Et le bouton pause
$('.pause').click(function(){
  audio.pause();
  $('.play').show();
  $('.pause').hide();
});
